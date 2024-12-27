import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import CitySearch from '../CitySearch/CitySearch';
import "react-calendar/dist/Calendar.css";
import "./MyCalendar.css";

const MyCalendar = ({ cityDates }) => {
    
    const navigate = useNavigate();
    const handleDateClick = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        navigate(`/itinerary/${formattedDate}`);
    };
    const getTileContent = ({ date }) => {
        const dateStr = date.toISOString().split('T')[0];
        return cityDates[dateStr]?.name || '';
    };

    return (
        <div className="calendar-page">
            <h1>Travel Planner</h1>
            <CitySearch />
            <Calendar 
                onChange={handleDateClick} 
                tileContent={getTileContent}
            />
        </div>
    );
};

export default MyCalendar;