import { saveCityToAirtable, saveWeatherToAirtable } from './airtableAPI';

const BASE_URL = 'http://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

async function searchCities(searchQuery) {
    if (!searchQuery?.trim()) {
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }

        const data = await response.json();
        
        const uniqueCities = new Map();
        
        data.forEach(city => {
            const key = `${city.name}-${city.country}`;
            if (!uniqueCities.has(key)) {
                uniqueCities.set(key, {
                    id: `${city.name}-${city.country}${city.state ? `-${city.state}` : ''}`,
                    name: city.name,
                    country: city.country,
                    state: city.state,
                    lat: city.lat,
                    lon: city.lon
                });
            }
        });

        return Array.from(uniqueCities.values());
    } catch (error) {
        console.error('Error searching cities:', error);
        return [];
    }
}

async function getWeather(city) {
    try {
        let weatherUrl;
        if (city.lat && city.lon) {
            weatherUrl = `${BASE_URL}/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`;
        } else {
            weatherUrl = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city.name)}&appid=${API_KEY}&units=metric`;
        }

        const response = await fetch(weatherUrl);
        const weatherData = await response.json();

        return {
            temperature: Math.round(weatherData.main.temp),
            condition: weatherData.weather[0].main,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            icon: weatherData.weather[0].icon
        };
    } catch (error) {
        console.error('Failed to get weather:', error);
        return null;
    }
}

async function handleCitySelection(city) {
    try {
        await saveCityToAirtable(city);
        
        const weatherData = await getWeather(city);
        if (!weatherData) return null;

        await saveWeatherToAirtable(city.id, weatherData);

        return weatherData;
    } catch (error) {
        console.error('Failed to handle city selection:', error);
        return null;
    }
}

export { searchCities, getWeather, handleCitySelection };