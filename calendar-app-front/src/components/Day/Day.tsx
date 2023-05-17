import React, { useEffect, useState } from "react";
import { CalendarDate, Weekday, Month } from '../../utils/types';
import './Day.css';
import { Months, Weekdays } from "../../configs/Weekdays";

interface DayProps {
  selected: CalendarDate,
  setSelected: React.Dispatch<React.SetStateAction<any>>,
}

const list = {
  active: true,
  day: 5,
  month: 4,
  weekday: "Friday",
  year: 2023,
  events: [
    {
      id: 123,
      color: "#bc986a",
      time: {
        hour: 16,
        minute: 53,
      },
      title: "work to do",
      description: "i have to do some work, like working stuff etc",
    },
  ]
}

export const Day: React.FC<DayProps> = ({ selected, setSelected }) => {
  return <div className="dayComponent">
    <div className= "dayHeader">
      <h2 className="dayInfo"> {selected.year},{selected.day},{Months[selected.month]}</h2>  
      <button className="xButton">X</button>
    </div>
    <div className="dayEvent">
      <div className="dayEventContainer">
        <div className="dot" style={{backgroundColor:"blue"}}></div>
        <div className="time">
          <span style={{margin: '10px'}}>Hour: </span>
          <select name="hour" id="hour">
            {[...Array(24).keys()].map(hour => (
              <option>{hour}</option>
            ))}
          </select>
          <span style={{margin: '10px'}}>Minute:</span> 
          <select name="minute" id="minute">
            {[...Array(60).keys()].map(hour => (
              <option>{hour}</option>
            ))}
          </select>
        </div>
        <div>
          <span style={{margin: '10px'}}>Title:</span>
          <input value={"work to do"} />
        </div>
        
        <button className="dot" style={{backgroundColor:"#B80F0A", border: "none"}}>
        X
        </button>

      </div>
      <div className="dayEventDescription">
        <span style={{margin: '10px'}}>Description:</span>
        <input type="text" value={"work to do"}/>
      </div>
    </div>
    <div className="addNewEventButt">
      <button className="dot" style={{width:'40px', height:'40px', backgroundColor: '#3f704d'}}>+</button>
    </div>
    
    
  </div>
}