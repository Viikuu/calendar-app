import React, { useEffect, useState, useContext } from "react";
import { CalendarDate, parseDate } from '../../utils/types';
import './Day.css';
import { Months} from "../../configs/Weekdays";
import { DayEvent, DayEventI } from '../DayEvent/DayEvent';
import axios from "axios";
import { mainRoute } from "../../utils/roots";
import { EventContextType, EventsContext } from "../Calendar";
import { Weather } from "../Weather/Weather";
import { UserContext, userContextType } from "../../pages/Main/Main";

interface DayProps {
  selected: CalendarDate,
  setSelected: React.Dispatch<React.SetStateAction<any>>,
}

const colors = [
  '#659DBd',
  '#E27D60',
  '#85DCBA',
  '#E8A87C',
  '#C38D9E',
  '#41B3A3',
  '#F64C72',
  '#7395AE',
  '#5D5C61',
  '#3500D3',
  '#6F2232',
  '#AFD275',
  '#45A29E'
]

export const Day: React.FC<DayProps> = ({ selected, setSelected }) => {

  const { events, setEvents } = useContext(EventsContext) as EventContextType; 
  const { user, setUser } = useContext(UserContext) as userContextType;

  const onTitleChangeSave = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    await axios.put([mainRoute, 'events', event.target.id].join('/'), {
                event: { title },
              }, { withCredentials: true,
            })
  }

  const onTitleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setEvents([
      ...events.map((el) => {
          if (el._id == event.target.id) {
            
            return { ...el, title }
          }
          return el;
        }),
    ])
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => {
          if (el._id == event.target.id) {
            
            return { ...el, title }
          }
          return el;
        }),
        ],
      });
  }
  const onDescriptionChangeSave = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;
    await axios.put([mainRoute, 'events', event.target.id].join('/'), {
                event: { description },
              }, { withCredentials: true
            })
  }

  const onDescriptionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;

    setEvents([
      ...events.map((el) => {
          if (el._id == event.target.id) {
            
            return { ...el, description }
          }
          return el;
        }),
    ])
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => {
          if (el._id == event.target.id) {
            
            return { ...el, description }
          }
          return el;
        }),
        ],
      });
  }

  const onEventDelete = async (id: string) => {
    await axios.delete([mainRoute, 'events', id].join('/'), {
             withCredentials: true
    })
    setEvents([
      ...events.filter((el) => el._id !== id)
    ])
    setSelected({
      ...selected,
      events: [
        ...selected.events.filter((el) => el._id !== id),
        ],
      });
  }

  const onMinuteChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const minute = Number(event.target.value);
    let date = new Date();
    setEvents([
      ...events.map((el) => {
          if (el._id == event.target.id) {
            date = new Date(
              el.date.getFullYear(),
              el.date.getMonth(),
              el.date.getDate(),
              el.date.getHours(),
              minute,
            );
            return { ...el, date }
          }
          return el;
        }),
    ])
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => {
          if (el._id == event.target.id) {
            date = new Date(
              el.date.getFullYear(),
              el.date.getMonth(),
              el.date.getDate(),
              el.date.getHours(),
              minute,
            );
            return { ...el, date }
          }
          return el;
        }),
        ],
    });
    await axios.put([mainRoute, 'events', event.target.id].join('/'), {
      event: { date },
    }, { withCredentials: true }
    );

  }

  const onHourChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const hour = Number(event.target.value);
    let date = new Date();
    setEvents([
      ...events.map((el) => {
          if (el._id == event.target.id) {
            date = new Date(
              el.date.getFullYear(),
              el.date.getMonth(),
              el.date.getDate(),
              hour,
              el.date.getMinutes(),
            );
            return { ...el, date }
          }
          return el;
        }),
    ])
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => {
          if (el._id == event.target.id) {
            date = new Date(
              el.date.getFullYear(),
              el.date.getMonth(),
              el.date.getDate(),
              hour,
              el.date.getMinutes(),
            );
            return { ...el, date }
          }
          return el;
        }),
        ],
    });
    await axios.put([mainRoute, 'events', event.target.id].join('/'), 
              {
                event: { date },
              }, { withCredentials: true }
            )
  }

  return <div className="dayComponent">
    <div className= "dayHeader">
      <h2 className="dayDetailedInfo"> {selected.day} {Months[selected.month]} {selected.year}</h2>  
      {selected.weatherEvents && selected.active && user.showWeather ?
        <Weather size={'big'} icon={selected.weatherEvents.title} temperature={selected.weatherEvents.description} text={selected.weatherEvents.location} /> :
        ""}
      
      <button className="xButton" onClick={(event)=>{setSelected(null)}}>-</button>
    </div>
    {selected.holidayEvents && selected.active && user.showHolidays ? <div>holiday</div> : <></> }
    <div className="scroll">
      {selected.events.map((event, index) => (
        <DayEvent
          key={index}
          onTitleChange={onTitleChange}
          onDescriptionChangeSave={onDescriptionChangeSave}
          onTitleChangeSave={onTitleChangeSave}
          onDescriptionChange={onDescriptionChange}
          onEventDelete={onEventDelete}
          onMinuteChange={onMinuteChange}
          onHourChange={onHourChange}
          dayEventProp={event}
        />
      ))}
      {selected.events.length < 8 ?
        <div className="addNewEventButt">
          <button className="addNewButt" onClick={async () => {
            const newEvent = {
              date: (
                new Date(selected.year,
                  selected.month,
                  selected.day,
                  (new Date()).getHours(),
                  (new Date()).getMinutes(),
              )),
              color: colors[Math.floor(Math.random() * colors.length)],
              title: "Title",
              description: "",
            };
            
            const {data: {event:createdEvent}} = await axios.post([mainRoute, 'events'].join('/'), 
              {
                event: { ...newEvent },
              }, { withCredentials: true });
            const [parsedEvent] = parseDate([createdEvent]);
            
            setEvents([
              ...events,
              parsedEvent,
            ]);
            setSelected({
              ...selected,
              events: [
                ...selected.events,
                parsedEvent,
              ],
            });
          }}>+</button>
        </div> :
        <></>
      }
    </div>
    
    
  </div>
}