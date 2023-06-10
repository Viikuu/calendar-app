import { useEffect, useRef, useState, createContext, useContext } from "react";
import { CalendarDate, DayEventI, Weekday, parseDate } from '../utils/types';
import { Months, Weekdays } from "../configs/Weekdays";
import { Day } from "./Day/Day";
import { Dot } from "./Dot/Dot";
import axios from "axios";
import { mainRoute } from "../utils/roots";
import { EventsContext, UserContext, userContextType } from "../pages/Main/Main";
import { useNavigate } from "react-router-dom";
import { Weather } from "./Weather/Weather";



export type EventContextType = {
  events: Array<DayEventI>,
  setEvents: React.Dispatch<React.SetStateAction<DayEventI[]>>,
}

export const Calendar: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [weatherEvents, setWeatherEvents] = useState<Array<DayEventI>>([]);
  const [holidayEvents, setHolidayEvents] = useState<Array<DayEventI>>([]);
  const [selected, setSelected] = useState<CalendarDate | null>(null);
  const [year, setYear] = useState<number>((new Date).getFullYear());
  const [month, setMonth] = useState<number>((new Date).getMonth());
  const [calendarDays, setCalendarDays] = useState<CalendarDate[]>([]);

  const { user, setUser } = useContext(UserContext) as userContextType;
  const { events, setEvents } = useContext(EventsContext) as EventContextType;
  const prevSelectedRef = useRef<CalendarDate | null>(null);

  interface getEventsType {
    events: Array<DayEventI>
  }
  async function genDays(dt: Date) {
    const thisDay = dt.getDate();
    const thisMonth = dt.getMonth();
    const thisYear = dt.getFullYear();
    
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
        const d = daysInPrevMonth - paddingDays + i + 1;
        const m = thisMonth - 1 === -1 ? 11 : thisMonth - 1;
        const y = thisMonth - 1 === -1 ? thisYear - 1 : thisYear
        calDays.push({
          day: d,
          month: m,
          year: y,
          weekday: (new Date(y, m, d)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          events: [...events.filter(event => event.date.getDate() === d && event.date.getMonth() === m && event.date.getFullYear() === y)],
          weatherEvents: weatherEvents.filter(event => event.date.getDate() === d && event.date.getMonth() === m && event.date.getFullYear() === y)[0],
          holidayEvents: [...holidayEvents.filter(event => event.date.getDate() === d && event.date.getMonth() === m && event.date.getFullYear() === y)],
          active: false,
        });
      } else {
        calDays.push({
          day: i - paddingDays + 1,
          month: thisMonth,
          year: thisYear,
          weekday: (new Date(thisYear, thisMonth, i - paddingDays + 1)).toLocaleDateString('en', { weekday: 'long' }) as Weekday,
          events: [...events.filter(event => event.date.getDate() === i - paddingDays + 1 && event.date.getMonth() === thisMonth && event.date.getFullYear() === thisYear)],
          weatherEvents: weatherEvents.filter(event => event.date.getDate() === i - paddingDays + 1 && event.date.getMonth() === thisMonth && event.date.getFullYear() === thisYear)[0],
          holidayEvents: [...holidayEvents.filter(event => event.date.getDate() === i - paddingDays + 1 && event.date.getMonth() === thisMonth && event.date.getFullYear() === thisYear)],
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

  async function getTypedEvents(type: string) { //getWeather, getHolidays
    const data = await axios.get<getEventsType>([mainRoute, 'events', type].join('/'), { withCredentials: true });
    const fetchedEvents = parseDate(data.data.events);
    return fetchedEvents;
  }

  async function getEvents() {
    try {
      if (user.showWeather) {
        setWeatherEvents(await getTypedEvents('getWeather'));
      }
      if (user.showHolidays) {
        setHolidayEvents(await getTypedEvents(`getHolidays/${user.country}`));
      }
      const { data: { events } } = await axios.get<getEventsType>([mainRoute, 'events'].join('/'), { withCredentials: true });
      const fetchedEvents = parseDate(events);
      setEvents(fetchedEvents);
      
    } catch (error) {
      navigate('/login');
    }
  }

  useEffect(() => { 
    console.log(events);
    
  }, [events]);

  useEffect(() => {
    if (user.showHolidays && !loading) {
      (async () => { 
        setHolidayEvents(await getTypedEvents(`getHolidays/${user.country}`));
      })();
    } else {
      setHolidayEvents([]);
    }
  }, [user.showHolidays, user.country]);

  useEffect(() => {
    if (user.showWeather && !loading) {
      (async () => { 
        setWeatherEvents(await getTypedEvents('getWeather'));
      })();
    } else {
      setWeatherEvents([]);
    }
  }, [user.showWeather, user.city]);
  
  useEffect(() => {
    const dt = new Date();
    (async () => {
      await getEvents();
      setLoading(false);
    })();
    
    setYear(dt.getFullYear());
    setMonth(dt.getMonth());
  }, []);

  useEffect(() => {
    const dt = new Date(year, month);
    genDays(dt);
    if (selected !== null) {
      setSelected({
        ...selected,
        weatherEvents: weatherEvents.filter(event => event.date.getDate() === selected.day && event.date.getMonth() === selected.month && event.date.getFullYear() === selected.year)[0],
        holidayEvents: [...holidayEvents.filter(event => event.date.getDate() === selected.day && event.date.getMonth() === selected.month && event.date.getFullYear() === selected.year)],
      });
    }
  }, [year, month, weatherEvents, holidayEvents, loading, events.length]);

  useEffect(() => {
    if (selected !== null && prevSelectedRef.current !== null) {
      setCalendarDays(calendarDays.map(el => el.day === selected.day && el.month === selected.month && el.year == selected.year ? {...el,events: selected.events } : el));
    }
    prevSelectedRef.current = selected;
  }, [selected?.events]);

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
            <div className="month-nav-info"> {Months[month]} {year}</div>
            <div>
              <button onClick={decreaseMonth}> {' < '}</button>
              <button onClick={increaseMonth}> {' > '} </button>
            </div>
          </div>

          <div className="weekdays-container">
            {Weekdays.map(day => (
              <div key={day} className="week-day"> {day} </div>
            ))}
          </div>
          <div className="calendar">
            {calendarDays.length !== 0 && calendarDays.map((date, index) => (
              <div key={index}
                className={`calendarDays ${!date.active ? 'noActive' : ''} 
              ${date.weekday === 'Saturday' ? 'saturday' : ''} 
              ${date.weekday === 'Sunday' ? 'sunday' : ''} 
              ${selected?.day === date.day && selected?.month === date.month && selected?.year === date.year ? 'selected' : ''} 
              ${date.holidayEvents.some(event=> event.description === 'Public Holiday') ? 'holiday' : ''}
              ${isToday(date) ? 'isToday' : ''}`}
                onClick={
                  (e) => {
                    const thisCalendarDate = calendarDays[index];
                    if (selected?.day === thisCalendarDate.day && selected?.month === thisCalendarDate.month && selected?.year === thisCalendarDate.year) {
                      setSelected(null);
                    } else {
                      setSelected(thisCalendarDate);
                    }
                  }
                }
              >
                <div className="dayInfo">
                  <label>{date.day}</label>
                  {date.weatherEvents && date.active ? <Weather icon={date.weatherEvents.title} temperature={date.weatherEvents.description}/> : ""}
                
                </div>
                <div className="inDayEvents">
                  {date.events.map((event, index) => (<Dot key={index} color={event.color} />))}
                </div>
              </div>
            ))
            
            }
          </div>
        </div> 
      {selected !== null ? <Day selected={selected} setSelected={setSelected} /> : ""}
    </div>)
}