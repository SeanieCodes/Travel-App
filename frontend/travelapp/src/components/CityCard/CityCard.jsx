import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import CitySearch from '../CitySearch/CitySearch';
import WeatherCard from '../WeatherCard/WeatherCard';
import './CityCard.css';

const CityCard = ({ onDateSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const city = location.state?.city || { name: "Unknown City" };

    const handleDateSelect = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        onDateSelect(dateStr, city);
    };

    return (
        <div className="city-card-page">
            <CitySearch />
            <div className="city-card">
                <h1>{city.name}</h1>
                <WeatherCard city={city} />
                <Calendar onChange={handleDateSelect} />
                <button onClick={() => navigate("/")}>
                    Back to Calendar
                </button>
            </div>
        </div>
    );
};

export default CityCard;