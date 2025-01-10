import { useState, useEffect } from 'react';
import { getWeather } from '../../APIs/openWeatherAPI';
import './WeatherCard.css';

const WeatherCard = ({ city, initialWeatherData }) => {
    const [weather, setWeather] = useState(initialWeatherData || null);

    useEffect(() => {
        if (initialWeatherData) {
            setWeather(initialWeatherData);
            setLoading(false);
            return;
        }

        async function loadWeather() {
            try {
                const weatherData = await getWeather(city);
                setWeather(weatherData);
            } catch (error) {
                console.error('Failed to load weather:', error);
            }
        }

        if (city?.name && !initialWeatherData) {
            loadWeather();
        }
    }, [city, initialWeatherData]);

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
                    <span className="detail-value">
                        {weather.condition}
                    </span>
                </div>
                
                <div className="weather-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">
                        {weather.humidity}%
                    </span>
                </div>

                <div className="weather-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">
                        {weather.windSpeed} m/s
                    </span>
                </div>

                <div className="weather-detail-item">
                    <span className="detail-label">Description</span>
                    <span className="detail-value">
                        {weather.description}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;