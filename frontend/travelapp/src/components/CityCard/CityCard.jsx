import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
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
        dateRange.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            onDateSelect(dateStr, city);
        });
        navigate('/');
    };

    return (
        <div
        className="city-card-page"
        style={{ backgroundImage: `url(${backgroundImage})` 
        }}
        >
            <CitySearch />
            <div className="city-card">
                <h1>{city.name}</h1>
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