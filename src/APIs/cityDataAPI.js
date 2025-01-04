import { getWeatherForCity } from './weatherAPI';
import { getPlaceDetails } from './placesAPI';
import { getCountryInfo } from './countriesAPI';

const airtableToken = import.meta.env.VITE_AIRTABLE_TOKEN
const airtableBaseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
const airtableTableName = 'Cities';

async function getCityData(cityName) {
    try {
        const placeData = await getPlaceDetails(cityName);
        
        const [weatherData, countryData] = await Promise.all([
            getWeatherForCity(cityName),
            getCountryInfo(placeData.countryCode)
        ]);

        const cityData = {
            name: cityName,
            lastUpdated: new Date().toISOString(),
            weatherData: JSON.stringify(weatherData),
            placeDetails: JSON.stringify(placeData),
            countryInfo: JSON.stringify(countryData)
        };

        const response = await fetch(
            `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${airtableToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{
                        fields: cityData
                    }]
                })
            }
        );

        return cityData;
    } catch (error) {
        console.error('Failed to get city data:', error);
        return null;
    }
}

export { getCityData };