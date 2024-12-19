import {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="app">
            <Calendar onChange={setDate} value={date} />
        </div>
    );
}

export default MyCalendar;