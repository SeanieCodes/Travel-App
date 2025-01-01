const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

async function getWeatherForCity(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=metric`
        );
        const weatherData = await response.json();
        return {
            temperature: weatherData.main.temp,
            condition: weatherData.weather[0].main,
            humidity: weatherData.main.humidity
        };
    } catch (error) {
        console.error('Failed to get weather:', error);
        return null;
    }
}

export { getWeatherForCity };