import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatRawDateString } from '../../utils/dateTimeUtils';
import CitySearch from '../CitySearch/CitySearch';
import WeatherCard from '../WeatherCard/WeatherCard';
import TransportationCard from '../TransportationCard/TransportationCard';
import LandmarksCard from '../LandmarksCard/LandmarksCard';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import backgroundImage from '../../assets/PinkFlower.png';
import './CityCard.css';

const CityCard = ({ onDateSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentCity, setCurrentCity] = useState(null);

    useEffect(() => {
        if (location.state?.city) {
            setCurrentCity(location.state.city);
        }
    }, [location.state]);

    const handleCitySelect = (city) => {
        setCurrentCity(city);
    };

    const handleDateRangeSelect = (dateRange) => {
        if (!currentCity) return;

        const formattedCityName = `${currentCity.name}, ${currentCity.country}`;
        
        dateRange.forEach(date => {
            const dateStr = formatRawDateString(date);
            onDateSelect(dateStr, {
                ...currentCity,
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
            <CitySearch onCitySelect={handleCitySelect} />
            {currentCity && (
                <div className="city-card">
                    <h1>{`${currentCity.name}, ${currentCity.country}`}</h1>
                    <WeatherCard city={currentCity} />
                    <TransportationCard city={currentCity} />
                    <LandmarksCard city={currentCity} />
                    <DateRangePicker onDateRangeSelect={handleDateRangeSelect} />
                </div>
            )}
        </div>
    );
};

export default CityCard;