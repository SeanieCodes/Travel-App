const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function airtableFetch(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(
        `${AIRTABLE_URL}${endpoint}`,
        { ...defaultOptions, ...options }
    );

    if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
    }

    return response.json();
}

export async function saveCityToAirtable(city) {
    try {
        const response = await airtableFetch(
            `/Cities?filterByFormula={cityId}="${city.id}"`
        );

        if (response.records && response.records.length > 0) {
            return response.records[0];
        }

        const createResponse = await airtableFetch('/Cities', {
            method: 'POST',
            body: JSON.stringify({
                records: [{
                    fields: {
                        cityId: city.id,
                        cityName: city.name,
                        country: city.country,
                        latitude: Number(city.lat) || 0,
                        longitude: Number(city.lon) || 0,
                        lastUpdated: new Date().toISOString()
                    }
                }]
            })
        });

        return createResponse.records[0];
    } catch (error) {
        console.error('Error saving city to Airtable:', error);
        throw error;
    }
}

export async function getCityFromAirtable(cityId) {
    try {
        const response = await airtableFetch(
            `/Cities?filterByFormula={cityId}="${cityId}"`
        );
        return response.records[0] || null;
    } catch (error) {
        console.error('Error fetching city from Airtable:', error);
        throw error;
    }
}

export async function saveWeatherToAirtable(cityId, weatherData) {
    try {
        
        const processedData = {
            cityId: cityId,
            temperature: Number(weatherData.temperature),
            condition: weatherData.condition,
            description: weatherData.description,
            humidity: Number(weatherData.humidity),
            windSpeed: Number(weatherData.windSpeed),
            timeStamp: new Date().toISOString()
        };

        const response = await airtableFetch('/WeatherData', {
            method: 'POST',
            body: JSON.stringify({
                records: [{
                    fields: processedData
                }]
            })
        });

        return response.records[0];
    } catch (error) {
        console.error('Error saving weather to Airtable:', error);
        throw error;
    }
}

export async function getWeatherFromAirtable(cityId) {
    try {
        const response = await airtableFetch(
            `/WeatherData?filterByFormula={cityId}="${cityId}"&sort[0][field]=timeStamp&sort[0][direction]=desc&maxRecords=1`
        );
        return response.records[0] || null;
    } catch (error) {
        console.error('Error fetching weather from Airtable:', error);
        throw error;
    }
}