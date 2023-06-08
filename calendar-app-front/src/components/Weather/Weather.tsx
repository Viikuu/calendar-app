import React from 'react';
import brokenClouds from './img/brokenClouds.png'
import clearSky from './img/clearSky.png'
import fewClouds from './img/fewClouds.png'
import mist from './img/mist.png'
import rain from './img/rain.png'
import scatteredClouds from './img/scatteredClouds.png'
import showerRain from './img/showerRain.png'
import snow from './img/snow.png'
import thunderstorm from './img/thunderstorm.png'

export const Weather: React.FC<{ temperature: string, icon: string }> = ({temperature, icon}) => {
  return (
      <div className="weather">
        <img className="weatherImage" src={(() => {
          switch(icon) {
            case 'broken clouds':
              return brokenClouds;
            case 'clear sky':
              return clearSky;
            case 'few clouds':
              return fewClouds;
            case 'mist':
              return mist;
            case 'rain':
              return rain;
            case 'scattered clouds':
              return scatteredClouds;
            case 'shower rain':
              return showerRain;
            case 'snow':
              return snow;
            case 'thunderstorm':
              return thunderstorm;
            default:
              return ''
          }
      })()}></img>
        <div className="temperature">
          {temperature}
        </div>
      </div>
  )
}