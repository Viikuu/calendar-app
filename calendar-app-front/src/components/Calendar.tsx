import React, { useEffect, useRef, useState } from "react";
import { CalendarDate, DayEventI, Weekday } from '../utils/types';
import { Months, Weekdays } from "../configs/Weekdays";
import { Day } from "./Day/Day";
import { Dot } from "./Dot/Dot";

export const Calendar: React.FC = () => {
  
  //const [nav, setNav] = useState<number>(0);
  const [events, setEvents] = useState<Array<DayEventI>>([
  ]);
  const [selected, setSelected] = useState<CalendarDate | null>(null);
  const [year, setYear] = useState<number>((new Date).getFullYear());
  const [month, setMonth] = useState<number>((new Date).getMonth());
  const [calendarDays, setCalendarDays] = useState<CalendarDate[]>([]);

  const prevSelectedRef = useRef<CalendarDate | null>(null);

  async function genDays(dt: Date) {
    const thisDay = dt.getDate();
    const thisMonth = dt.getMonth();
    const thisYear = dt.getFullYear();
    const a = process.env.REACT_APP_MY_ENV_VARIABLE
    await
    
    setMonth(thisMonth);
    setYear(thisYear);

    const firstDayOfMonth = new Date(thisYear, thisMonth, 1);
    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
  
    const dateString = firstDayOfMonth.toLocaleDateString('en', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    
    const paddingDays = Weekdays.indexOf(dateString.split(', ')[0] as Weekday);
    
    const daysInPrevMonth = new Date(thisYear, thisMonth, 0).getDate();
    
    const calDays: CalendarDate[] = [];

    for (let i = 0; i < daysInMonth + paddingDays; i++) {
      if (i < paddingDays) {
        const d = daysInPrevMonth - paddingDays + i
        const m = thisMonth - 1 === -1 ? 11 : thisMonth - 1;
        const y = thisMonth - 1 === -1 ? thisYear - 1 : thisYear
        calDays.push({
          day: d,
          month: m,
          year: y,
          weekday: (new Date(y, m, d)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          events: [...events.filter(event => event.day === d && event.month === m && event.year === y)],
          active: false,
        });
      } else {
        calDays.push({
          day: i - paddingDays + 1,
          month: thisMonth,
          year: thisYear,
          weekday: (new Date(thisYear, thisMonth, i - paddingDays + 1)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          events: [...events.filter(event => event.day === i - paddingDays + 1 && event.month === thisMonth && event.year === thisYear)],
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
    setYear(dt.getFullYear());
    setMonth(dt.getMonth());
  }, []);

  useEffect(() => {
    const dt = new Date(year, month);
    genDays(dt);
  }, [year, month,events]);

  useEffect(() => {
    if (selected !== null && prevSelectedRef.current !== null) {
      setCalendarDays(calendarDays.map(el => el.day === selected.day && el.month === selected.month && el.year == selected.year ? selected : el));
    }
    prevSelectedRef.current = selected;
  },[selected]);

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
          {calendarDays.length !== 0 && calendarDays.map((date, index) => (
            <div key={index}
              className={`calendarDays ${!date.active ? 'noActive': ''} ${selected === date ? 'selected': ''} ${isToday(date) ? 'isToday': ''}`}
              onClick={
                (e) => {
                  const thisCalendarDate = calendarDays[index];
                  if (thisCalendarDate === selected) {
                    setSelected(null);
                  } else {
                    setSelected(thisCalendarDate);
                  }
                }
              }
            >
              {date.day}
              <div className="inDayEvents">
                {date.events.map((event,index) => (<Dot key={index} color={event.color}/>))}
              </div>
            </div>
            ))
            
          }
        </div>
      </div>
      {selected !== null ? <Day selected = {selected} setSelected = {setSelected} />: ""}
    </div>
  )
}