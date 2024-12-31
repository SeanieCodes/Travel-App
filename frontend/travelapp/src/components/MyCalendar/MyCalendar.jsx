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
    const getTileContent = ({ date, view }) => {
        if (view !== 'month') return null;
        const dateStr = date.toISOString().split('T')[0];
        const cityName = cityDates[dateStr]?.name;

        return cityName ? (
            <div className="calendar-tile-content">
                {cityName}
            </div>
        ) : null;
    };

    return (
        <div className="calendar-page">
            <h1>Travel Planner</h1>
            <div className="calendar-container">
                <CitySearch />
                <Calendar 
                    onChange={handleDateClick} 
                    tileContent={getTileContent}
                    className="main-calendar"
                />
            </div>
        </div>
    );
};

export default MyCalendar;