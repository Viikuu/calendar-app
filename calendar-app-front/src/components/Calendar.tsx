import React, { useEffect, useState } from "react";
import { CalendarDate, Weekday } from '../utils/types';
import { Months, Weekdays } from "../configs/Weekdays";
import { Day } from "./Day";

export const Calendar: React.FC = () => {
  
  //const [nav, setNav] = useState<number>(0);
  
  //const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState<CalendarDate|null>(null);
  const [year, setYear] = useState<number>((new Date).getFullYear());
  const [month, setMonth] = useState<number>((new Date).getMonth());
  const [calendarDays, setCalendarDays] = useState<CalendarDate[]>([]);

  function genDays(dt: Date) {
    const thisDay = dt.getDate();
    const thisMonth = dt.getMonth();
    const thisYear = dt.getFullYear();
    
    setMonth(thisMonth);
    setYear(thisYear);


    const firstDayOfMonth = new Date(thisYear, thisMonth , 1);
    const daysInMonth = new Date(thisYear, thisMonth  + 1, 0).getDate();
  
    const dateString = firstDayOfMonth.toLocaleDateString('en', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    
    const paddingDays = Weekdays.indexOf(dateString.split(', ')[0] as Weekday);
    
    const daysInPrevMonth = new Date(thisYear, thisMonth , 0).getDate();
    
    const calDays: CalendarDate[] = [];

    for (let i = 0; i < daysInMonth + paddingDays; i++) {
      if (i < paddingDays) {
        const d = daysInPrevMonth - paddingDays + i
        const m = thisMonth - 1 === -1 ? 11 : thisMonth  - 1;
        const y = thisMonth - 1 === -1 ? thisYear - 1 : thisYear
        calDays.push({
          day: d,
          month: m,
          year: y,
          weekday: (new Date(y, m, d)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          active: false,
        });
      } else {
        calDays.push({
          day: i - paddingDays + 1,
          month: thisMonth ,
          year: thisYear,
          weekday: (new Date(thisYear, thisMonth , i - paddingDays + 1)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          active: true,
        });
      }
    }
    setCalendarDays(calDays);
  }

  function isToday(dt: CalendarDate): boolean {
    const today = new Date();
    return today.getDate() === dt.day &&
      today.getMonth() === dt.month &&
      today.getFullYear() === dt.year;
  }
  
  useEffect(() => {
    const dt = new Date();
    genDays(dt);
  },[]);

  useEffect(() => {
    const dt = new Date(year, month);
    genDays(dt);
  }, [year, month]);

  const decreaseMonth = () => {
    setMonth(() => month - 1);
  }

  const increaseMonth = () => {
    setMonth(() => month + 1);
  }
  return (
    <div className="calendar-container">
      <div className="datepicker-container">

        <div className="month-nav-container">
          <div className="month-nav-info"> {year}, {Months[month]} </div>
          <div>
            <button onClick={decreaseMonth}> {' < '}</button>
            <button onClick={increaseMonth}> {' > '} </button>
          </div>
        </div>

        <div className="weekdays-container">
          { Weekdays.map(day => (
            <div key={day} className="week-day"> {day} </div>
          ))}
        </div>
        <div className="calendar">
          {calendarDays.length !== 0 && calendarDays.map(date => (
            <div key={[date.day, date.month, date.year].join('.')}
              id={[date.day, date.month, date.year].join('.')}
              className={`calendarDays ${!date.active ? 'noActive': ''} ${selected === date ? 'selected': ''} ${isToday(date) ? 'isToday': ''}`}
              onClick={
                (e) => {
                  const thisDate = e.target.id.split('.');
                  const thisCalendarDate = calendarDays.find((day: CalendarDate) =>  day.day == thisDate[0] && day.month == thisDate[1] && day.year == thisDate[2]) as CalendarDate;
                  setSelected(thisCalendarDate);
                }
              }
            > {date.day} </div>
            ))
            
          }
        </div>
      </div>
      {selected !== null ? <Day selected = {selected} setSelected = {setSelected} />: ""}
    </div>
  )
}