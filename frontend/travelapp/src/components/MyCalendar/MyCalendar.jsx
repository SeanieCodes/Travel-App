import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import CitySearch from '../CitySearch/CitySearch';
import backgroundImage from '../../assets/pinkflower.avif';
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
        <div 
        className="calendar-page"
        style={{ backgroundImage: `url(${backgroundImage})` 
        }}>
            <div className="title-container">
            <h1>Meridian</h1>
            </div>
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