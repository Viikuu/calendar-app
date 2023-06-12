import React, {useContext} from 'react';
import axios from 'axios';
import { DayEvent } from '../../DayEvent/DayEvent';
import { useEffect } from 'react';
import { DayEventI, Month, parseDate } from '../../../utils/types';
import { mainRoute } from '../../../utils/roots';
import { Months } from '../../../configs/Weekdays';
import { EventsContext } from '../../../pages/Main/Main';
import { EventContextType } from '../../Calendar';

type GeneratedEventProps = {
  eventType: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
}

export const GeneratedEvent: React.FC<GeneratedEventProps> = ({ eventType, setShow }) => {
  const [event, setEvent] = React.useState<DayEventI | null>(null);
  const [date, setDate] = React.useState<{ day?: string, month?: string }>({ day: (new Date().getDate()).toString(), month: Months[new Date().getMonth()] });
  const [days, setDays] = React.useState<number>(1);
  const [termins, setTermins] = React.useState([]);

  const { events, setEvents } = useContext(EventsContext) as EventContextType;

  useEffect(() => { 
    (async () => { 
      const res = await axios.get(`${mainRoute}/events/termin/${eventType.replace(' ', '')}`, { withCredentials: true });
      setTermins(res.data.termins);
    })();
  }, [])
  
  useEffect(() => {
    setEvent({
      date: new Date(),
      color: eventType === 'Travel' ? '#72DBDB' :  '#874ED2',
      title: eventType ==='Other' ? '': eventType,
      description: "",
      type: eventType,
    } as DayEventI)
  }, [eventType])
  
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
      <div>
        {termins && (eventType !== 'Travel') && (<>          
          <label className='terminInfo'>Free termins within this week with good weather for outdoor sports!</label>
          {termins.map((termin, index) => {
            return <div className={'termins'} key={index}>
              <div>
                <label> Day: {termin.day} </label>
                <label>Hours: {termin.hours}</label>
              </div>
            </div>
          })}
        </>
        )}

        {termins && (eventType === 'Travel') && (<>
          <div className='terminsParent'>
          
          <label className='terminInfo'>Long weekends in this year!</label>
          {termins.map((termin, index) => {
            return <div className={'termins'} key={index}>
              <div>
                <label>Days: {termin.dayCount}</label>
                <label> Dates: {termin.startDate} - {termin.endDate} </label>
                <label>Needs holidays from work? <input type='checkbox' disabled checked={termin.needBridgeDay}></input></label>
              </div>
            </div>
          })}
            
          </div>  
        </>
        )}

      </div>
      {event !== null &&
        <DayEvent
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onEventDelete={null}
          onMinuteChange={onMinuteChange}
          onHourChange={onHourChange}
          dayEventProp={event}
          repetability={eventType}
          date={date}
          setDate={setDate}
        />}
      {eventType === 'Travel' && <div>
        <label > How many days : </label>
        <input type='number' value={days} onChange={(e) => {
          setDays(Number(e.target.value));
        }}></input>
      </div>
      }
      <button onClick={
        async () => {
          console.log(event);
          setShow(false);
          console.log(eventType);
          
          if (eventType === 'Travel') {
            const createdEvent = {
              ...event,
              date: (new Date(event.date.getFullYear(), Months.indexOf(date.month as Month), Number(date.day), event.date.getHours(), event.date.getMinutes())),
            }
            
            try {
              const response = await axios.post(`${mainRoute}/events/travel`, { event: { ...createdEvent }, days }, { withCredentials: true });
              console.log(response.data.events);
              
              setEvents([...events, ...parseDate(response.data.events)]);
            } catch (err) {
              console.log(err);
            }
            
          } else {
            const createdEvent = {
              ...event,
              date: (new Date(event.date.getFullYear(), event.date.getMonth(), Number(date.day), event.date.getHours(), event.date.getMinutes())),
            }
            console.log(createdEvent);
            
            try {
              const response = await axios.post([mainRoute, 'events'].join('/'), 
              {
                event: { ...createdEvent },
                }, { withCredentials: true });

              setEvents([...events, ...parseDate([response.data.event])]);
            } catch (err) {
              console.log(err);
            }
            
          }
          
        }
      }>
        Save
      </button>
    </>
  )
}