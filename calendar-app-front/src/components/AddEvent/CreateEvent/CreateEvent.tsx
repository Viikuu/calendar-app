import React from 'react';
import axios from 'axios';
import { DayEvent } from '../../DayEvent/DayEvent';
import { useEffect } from 'react';
import { DayEventI, Weekday, parseDate } from '../../../utils/types';
import { EventsContext } from '../../../pages/Main/Main';
import { EventContextType } from '../../Calendar';
import { mainRoute } from '../../../utils/roots';
import { Weekdays } from '../../../configs/Weekdays';

type CreateEventProps = {
  eventType: string,
  repetability: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
}

export const CreateEvent: React.FC<CreateEventProps> = ({ eventType, repetability, setShow }) => {
  const [event, setEvent] = React.useState<DayEventI | null>(null);
  const [repeatableDate, setRepeatableDate] = React.useState<{ day?: string, month?: string, dayName?: string }>({ day: '1', month: 'January', dayName: 'Monday' });
  const [repeatTimes, setRepeatTimes] = React.useState<number>(1);
  const { events, setEvents } = React.useContext(EventsContext) as EventContextType;
  
  useEffect(() => {
    setEvent({
              date: new Date(),
              color: '#02385A',
              title: eventType ==='Other' ? '': eventType,
              description: "",
              type: eventType,
    } as DayEventI)
  }, [eventType])

  useEffect(() => {
    console.log(repeatableDate);
    console.log(event);
    console.log(repeatTimes);
    
  }, [event, repeatableDate, repeatTimes]);
  
  function onTitleChange(ev) { 
    setEvent({...event, title: ev.target.value} as DayEventI);
  }
  function onDescriptionChange(ev) {
    setEvent({ ...event, description: ev.target.value } as DayEventI);
  }
  function onMinuteChange(ev) {
    setEvent({ ...event, date: new Date(event.date.setMinutes(ev.target.value)) } as DayEventI);
  }
  function onHourChange(ev) {
    setEvent({ ...event, date: new Date(event.date.setHours(ev.target.value)) } as DayEventI);
  }

  return (
    <>
      {event !== null &&
        <DayEvent
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onEventDelete={null}
          onMinuteChange={onMinuteChange}
          onHourChange={onHourChange}
          dayEventProp={event}
          repetability={repetability}
          date={repeatableDate}
          setDate={setRepeatableDate}
        />}
      <div>
        <label > Repeat : </label>
        <input type='number' value={repeatTimes} onChange={(e) => {
          setRepeatTimes(Number(e.target.value));
        }}></input>
      </div>
      <button onClick={
        async () => {
          
          setShow(false);
          let newEvent = { ...event };
          let sendRepeatTimes = repeatTimes;
          if (repetability === 'Weekly') {
            const firstDay = (new Date(new Date().getFullYear(), new Date().getMonth(), 1 )).toLocaleDateString('en', {
              weekday: 'long',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            });
            const paddingDays = Weekdays.indexOf(firstDay.split(', ')[0] as Weekday);

            const dayIndex = Weekdays.indexOf(repeatableDate.dayName as Weekday);
            const additionalDays = (new Date().getDate())/7;
            const firstDayE = (new Date(new Date().getFullYear(), new Date().getMonth(), 1 + paddingDays + additionalDays, event.date.getHours(), event.date.getMinutes()));
            newEvent = {
              ...event,
              date: firstDayE
            } 

          } else if (repetability === 'Monthly') {
            if (new Date().getDate() > Number(repeatableDate.day)) {
              sendRepeatTimes++;
            }
            newEvent = {
              ...event,
              date: new Date(new Date().getFullYear(), new Date().getMonth(), Number(repeatableDate.day), event.date.getHours(), event.date.getMinutes())
            };
          } else if (repetability === 'Yearly') {
            const month = Weekdays.indexOf(repeatableDate.month as Weekday)
            if (new Date().getMonth() > month) {
              sendRepeatTimes++;
            }
            newEvent = {
              ...event,
              date: new Date(new Date().getFullYear(), month, Number(repeatableDate.day), event.date.getHours(), event.date.getMinutes())
            };
          }

          try {
            const response = await axios.post(`${mainRoute}/events/repetable`, { event: { ...newEvent }, repeatTimes: sendRepeatTimes, repetability }, { withCredentials: true });
            console.log(response);
            
            setEvents([...events, ...parseDate(response.data.events)]);
          } catch (err) {
            console.log(err);
          }
        }
      }>
        Save
      </button>
    </>
  )
}