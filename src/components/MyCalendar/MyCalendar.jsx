import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import CitySearch from '../CitySearch/CitySearch';
import { formatCalendarDate } from '../../utils/dateTimeUtils';
import "react-calendar/dist/Calendar.css";
import "./MyCalendar.css";

const MyCalendar = ({ cityDates }) => {
    const navigate = useNavigate();
    
    const handleDateClick = (date) => {
        const formattedDate = formatCalendarDate(date);
        navigate(`/itinerary/${formattedDate}`);
    };

    const getTileContent = ({ date }) => {
        const dateStr = formatCalendarDate(date);
        const cityName = cityDates[dateStr]?.name;

        return cityName ? (
            <div className="calendar-tile-content">
                {cityName}
            </div>
        ) : null;
    };

    return (
        <div className="calendar-page">
            <div className="title-container">
                <h1>alcove</h1>
            </div>
            <div className="search-container-wrapper">
                <CitySearch />
            </div>
            <div className="calendar-wrapper">
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