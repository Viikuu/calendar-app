import React, { useEffect, useState } from "react";
import { CalendarDate, Weekday, Month } from '../../utils/types';
import './Day.css';
import { Months, Weekdays } from "../../configs/Weekdays";
import { DayEvent, DayEventI } from '../DayEvent/DayEvent';

interface DayProps {
  selected: CalendarDate,
  setSelected: React.Dispatch<React.SetStateAction<any>>,
}

export const Day: React.FC<DayProps> = ({ selected, setSelected }) => {
  return <div className="dayComponent">
    <div className= "dayHeader">
      <h2 className="dayInfo"> {selected.year},{selected.day},{Months[selected.month]}</h2>  
      <button className="xButton" onClick={()=>{setSelected(null)}}>-</button>
    </div>
    {list.events.map((event, index) => (
      <DayEvent { ...event } key = {index}/>
    ))}

    <div className="addNewEventButt">
      <button className="addNewButt">+</button>
    </div>
    
  </div>
}