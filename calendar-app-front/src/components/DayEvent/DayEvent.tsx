import React, { useEffect, useState } from "react";
import './DayEvent.css';

export const DayEvent: React.FC<DayEventI> = (dayEventProp ) => {
  return (
    <div className="dayEvent">
      <div className="dayEventContainer">
        <div className="time">
          <select value={dayEventProp.time.hour } name="hour" id="hour">
            {[...Array(24).keys()].map(hour => (
              <option>{hour < 10 ? "0"+hour : hour}</option>
            ))}
          </select>
          :
          <select value={dayEventProp.time.minute} name="minute" id="minute">
            {[...Array(60).keys()].map(minute => (
              <option>{minute < 10 ? "0" + minute : minute}</option>
            ))}
          </select>
        </div>
        
        <button className="dot">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
        </button>

      </div>
      <div>
          <span style={{margin: '10px'}}>Title:</span>
          <input value={dayEventProp.title} />
      </div>
      
      
      <div className="dayEventDescription">
        <span style={{margin: '10px'}}>Description:</span>
        <input type="text" value={dayEventProp.description}/>
      </div>
    </div>
  )
}
