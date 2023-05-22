import React, { useEffect, useState } from "react";
import { CalendarDate, Weekday, Month } from '../../utils/types';
import './Day.css';
import { Months, Weekdays } from "../../configs/Weekdays";
import { DayEvent, DayEventI } from '../DayEvent/DayEvent';

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

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => el.id == event.target.id ? { ...el, title }: el),
        ],
      });
  }

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => el.id == event.target.id ? { ...el, description }: el),
        ],
      });
  }

  const onEventDelete = (id:string) => {
    setSelected({
      ...selected,
      events: [
        ...selected.events.filter((el) => el.id !== id),
        ],
      });
  }

  const onMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minute = event.target.value;
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => el.id == event.target.id ? { ...el, time: {...el.time, minute} }: el),
        ],
      });
  }

  const onHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hour = event.target.value;
    setSelected({
      ...selected,
      events: [
        ...selected.events.map((el) => el.id == event.target.id ? { ...el, time: {...el.time, hour} }: el),
        ],
      });
  }

  return <div className="dayComponent">
    <div className= "dayHeader">
      <h2 className="dayInfo"> {selected.year},{selected.day},{Months[selected.month]}</h2>  
      <button className="xButton" onClick={(event)=>{setSelected(null)}}>-</button>
    </div>
    <div className="scroll">
      {selected.events.map((event, index) => (
        <DayEvent
          key={index}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onEventDelete={onEventDelete}
          onMinuteChange={onMinuteChange}
          onHourChange={onHourChange}
          dayEventProp={event}
        />
      ))}
      {selected.events.length < 8 ?
        <div className="addNewEventButt">
          <button className="addNewButt" onClick={() => {
            setSelected({
              ...selected,
              events: [
                ...selected.events,
                {
                  id: selected.events.length,
                  year: selected.year,
                  month: selected.month,
                  day: selected.day,
                  color: colors[Math.floor(Math.random()*colors.length)],
                  time: {
                    hour: (new Date()).getHours(),
                    minute: (new Date()).getMinutes(),
                  },
                  title: "Title",
                  description: "",
                },
              ],
            });
          }}>+</button>
        </div> :
        <></>
      }
    </div>
    
    
  </div>
}