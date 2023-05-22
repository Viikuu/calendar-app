import React from 'react';
import './Dot.css';

export const Dot: React.FC<{color:string}> = ({color}) => {
  return (
    <div className='inDayEventDot' style={{backgroundColor:color}}>

    </div>
  )
}