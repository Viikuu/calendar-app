import React from 'react';
import { Calendar } from './Calendar';

export const DataPicker: React.FC = () => {
  return (
    <div className='data-picker-container'>
      <div className='background-container'></div>
      <Calendar />
    </div>
  )
}