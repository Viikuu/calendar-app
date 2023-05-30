export interface DayEventI {
  _id: string,
  color: string,
  day: number;
  month: number;
  year: number;
  time: {
    hour: number,
    minute: number,
  },
  title: string,
  description: string,
}

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  weekday: Weekday;
  active: boolean;
  events: Array<DayEventI>
}

export type userData = {
  user: {
    _id: string,
    email: string,
  }
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
