import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CitySearch from '../CitySearch/CitySearch';
import WeatherCard from '../WeatherCard/WeatherCard';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import './CityCard.css';

const CityCard = ({ onDateSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentCity, setCurrentCity] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        if (location.state?.city) {
            setCurrentCity(location.state.city);
            setCurrentWeather(location.state.weatherData);
        }
    }, [location.state]);

    const handleCitySelect = (city, weatherData) => {
        setCurrentCity(city);
        setCurrentWeather(weatherData);
    };

    const handleDateRangeSelect = (dateRange) => {
        if (!currentCity) return;

        const formattedCityName = `${currentCity.name}, ${currentCity.country}`;
        
        dateRange.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            onDateSelect(dateStr, {
                ...currentCity,
                name: formattedCityName
            });
        });
        navigate('/');
    };

    return (
        <div className="city-card-page">
            <CitySearch onCitySelect={handleCitySelect} />
            {currentCity && (
                <div className="city-card">
                    <h1>{`${currentCity.name}, ${currentCity.country}`}</h1>
                    <WeatherCard 
                        city={currentCity} 
                        initialWeatherData={currentWeather}
                    />
                    <DateRangePicker onDateRangeSelect={handleDateRangeSelect} />
                    <button onClick={() => navigate("/")} className="back-btn">
                        Back to Calendar
                    </button>
                </div>
            )}
        </div>
    );
};

export default CityCard;