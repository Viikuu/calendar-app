import React, { useEffect, useState } from "react";
import './DayEvent.css';
import { DayEventI } from '../../utils/types';

type DayEventProps = {
  dayEventProp: DayEventI,
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onEventDelete: (id: string) => void,
  onDescriptionChangeSave: any,
  onTitleChangeSave: any, 
  onMinuteChange: any,
  onHourChange: any,
}

export const DayEvent: React.FC<DayEventProps> = ({ dayEventProp, onTitleChange, onDescriptionChange, onEventDelete, onHourChange, onMinuteChange, onTitleChangeSave,onDescriptionChangeSave  } ) => {
  return (
    <div className="dayEvent" style={{ backgroundColor: dayEventProp.color }}>
      <div className="dayEventContainer">
        <button className="dot" onClick={() => onEventDelete(dayEventProp._id)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
        </button>
      </div>
      <div className="dayEventTitle">
          <span style={{margin: '10px'}}>Title:</span>
        <input value={dayEventProp.title} id={dayEventProp._id} onChange={onTitleChange} onBlur={onTitleChangeSave} />
      </div>
      <div className="time">
        <span style={{margin: '10px'}}>Time:</span>
          <select value={dayEventProp.date.getHours() } onChange={onHourChange} id={dayEventProp._id}  name="hour">
            {[...Array(24).keys()].map((hour,index) => (
              <option key={index} value={hour}>{hour < 10 ? "0"+hour : hour}</option>
            ))}
          </select>
          :
          <select value={dayEventProp.date.getMinutes()} onChange={onMinuteChange} id={dayEventProp._id}  name="minute">
            {[...Array(60).keys()].map((minute,index) => (
              <option key={index} value={minute}>{minute < 10 ? "0" + minute : minute}</option>
            ))}
          </select>
        </div>
      
      
      <div className="dayEventDescription">
        <span style={{margin: '10px'}}>Description:</span>
        <input type="text" value={dayEventProp.description} id={dayEventProp._id} onChange={onDescriptionChange} onBlur={onDescriptionChangeSave}/>
      </div>
    </div>
  )
}
