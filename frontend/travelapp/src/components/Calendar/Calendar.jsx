import { useState } from "react";
import Calendar from "react-calendar";
import CitySearch from "../CitySearch/CitySearch";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="calendar-page">
            <CitySearch />
            <div className="calendar-container">
                <h1>Your Travel Calendar</h1>
                <Calendar onChange={setDate} value={date} />
            </div>
        </div>
    );
};

export default MyCalendar;
