import { useLocation, useNavigate } from 'react-router-dom';
import CitySearch from '../CitySearch/CitySearch';
import WeatherCard from '../WeatherCard/WeatherCard';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import backgroundImage from '../../assets/pinkflower.avif';
import './CityCard.css';

const CityCard = ({ onDateSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const city = location.state?.city || { name: "Unknown City" };

    const handleDateRangeSelect = (dateRange) => {
        const formattedCityName = `${city.name}, ${city.country}`;
        
        dateRange.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            onDateSelect(dateStr, {
                ...city,
                name: formattedCityName
            });
        });
        navigate('/');
    };

    return (
        <div
            className="city-card-page"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <CitySearch />
            <div className="city-card">
                <h1>{`${city.name}, ${city.country}`}</h1>
                <WeatherCard city={city} />
                <DateRangePicker onDateRangeSelect={handleDateRangeSelect} />
                <button onClick={() => navigate("/")} className="back-btn">
                    Back to Calendar
                </button>
            </div>
        </div>
    );
};

export default CityCard;