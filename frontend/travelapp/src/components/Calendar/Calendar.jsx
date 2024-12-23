import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CitySearch from "../CitySearch/CitySearch";
import "./Calendar.css";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="calendar-page">
            <h1>Travel Planner</h1>
            <CitySearch />
            <Calendar onChange={setDate} value={date} />
        </div>
    );
};

export default MyCalendar;
