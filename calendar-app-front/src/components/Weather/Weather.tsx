import React from 'react';
import './Weather.css'

export const Weather: React.FC<{ temperature: string, icon: string }> = ({temperature, icon}) => {
  return (
      <div className="weather">
      <img className="weatherImage" src={(() => {
        if(['803', '804'].includes(icon)) return 'http://openweathermap.org/img/wn/04d@2x.png';
        if(['800'].includes(icon)) return 'http://openweathermap.org/img/wn/01d@2x.png';
        if(['801'].includes(icon)) return 'http://openweathermap.org/img/wn/02d@2x.png';
        if(['701', '711', '721', '731', '741', '751', '761', '762', '771', '781'].includes(icon)) return 'http://openweathermap.org/img/wn/50d@2x.png';
        if(['500', '501', '502', '503', '504'].includes(icon)) return 'http://openweathermap.org/img/wn/10d@2x.png';
        if(['802'].includes(icon)) return 'http://openweathermap.org/img/wn/03d@2x.png';
        if(['520', '521', '522', '531', '300', '301', '302', '310', '311', '312', '313', '314', '321'].includes(icon))return 'http://openweathermap.org/img/wn/09d@2x.png';
        if(['511', '600', '601', '602', '611', '612', '613', '615', '616', '620', '621', '622'].includes(icon)) return 'http://openweathermap.org/img/wn/13d@2x.png';
        if(['200', '201', '202', '210', '211', '212', '221', '230', '231', '232'].includes(icon)) return 'http://openweathermap.org/img/wn/11d@2x.png';
      })()}></img>
        <div className="temperature">
          {temperature}
        </div>
      </div>
  )
}