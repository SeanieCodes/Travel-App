import { useState, useEffect } from 'react';
import { getWeatherForCity } from '../../APIs/weatherAPI';
import './WeatherCard.css';

const WeatherCard = ({ city }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWeather() {
            try {
                setLoading(true);
                const weatherData = await getWeatherForCity(city.name);
                setWeather(weatherData);
            } catch (error) {
                console.error('Failed to load weather:', error);
            } finally {
                setLoading(false);
            }
        }

        if (city?.name) {
            loadWeather();
        }
    }, [city]);

    if (loading) {
        return <div className="weather-card">Loading weather data...</div>;
    }

    if (!weather) {
        return <div className="weather-card">Could not load weather data</div>;
    }

    return (
        <div className="weather-card">
            <div className="weather-header">
                <h2 className="weather-title">Current Weather</h2>
                <span className="temperature">{weather.temperature}°C</span>
            </div>

            <div className="weather-details">
                <div className="weather-detail-item">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{weather.condition}</span>
                </div>
                
                <div className="weather-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weather.humidity}%</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;