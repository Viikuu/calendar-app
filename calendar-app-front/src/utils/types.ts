export interface DayEventI {
  _id: string,
  color: string,
  date: Date,
  title: string,
  description: string,
  type: string,
  location: string,
}

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  weekday: Weekday;
  active: boolean;
  events: Array<DayEventI>;
  weatherEvents: DayEventI | null;
  holidayEvents: Array<DayEventI>;
}

export type userData = {
  user: userType,
}

export type userType = {
  _id: string,
  email: string,
  city: string,
  country: string,
  showHolidays: boolean,
  showWeather: boolean,

}

export type countriesType = {
  name: string,
  code: string,
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export function parseDate(events: Array<DayEventI>) {
  return events.map((el: DayEventI) => {
    return { ...el, date: new Date(el.date) }
  })
}
