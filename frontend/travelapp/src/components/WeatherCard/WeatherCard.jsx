import './WeatherCard.css';

const WeatherCard = ({ city }) => {

    const mockWeather = {
        temperature: "22°C",
        condition: "Sunny",
        humidity: "45%",
        windSpeed: "10 km/h",
        precipitation: "0%"
    };

    return (
        <div className="weather-card">
            <div className="weather-header">
                <h2 className="weather-title">Current Weather</h2>
                <span className="temperature">{mockWeather.temperature}</span>
            </div>

            <div className="weather-details">
                <div className="weather-detail-item">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{mockWeather.condition}</span>
                </div>
                
                <div className="weather-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{mockWeather.humidity}</span>
                </div>

                <div className="weather-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{mockWeather.windSpeed}</span>
                </div>

                <div className="weather-detail-item">
                    <span className="detail-label">Precipitation</span>
                    <span className="detail-value">{mockWeather.precipitation}</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;