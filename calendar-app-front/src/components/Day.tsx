import React, { useEffect, useState } from "react";
import { CalendarDate, Weekday, Month } from '../utils/types';
import { Months, Weekdays } from "../configs/Weekdays";

interface DayProps {
  selected: CalendarDate,
  setSelected: React.Dispatch<React.SetStateAction<any>>,
}

export const Day: React.FC<DayProps> = ({selected, setSelected}) => {
  return <div className="dayComponent">
    <div className="dayInfo"> {selected.year},{selected.day},{Months[selected.month]}</div>
    <div>
      <form>
     <h1>New Order</h1>
     <label>Name</label>
     <input name="name"  />
     <label>Address</label>
     <input name="address"  />
     <label>Date</label>
     <input name="date"  />
     <label>Order Number</label>
     <input name="order" />
     <input type="submit" />
   </form>

    </div>
  </div>
}