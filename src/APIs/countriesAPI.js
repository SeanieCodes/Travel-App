async function getCountryInfo(countryCode) {
    try {
        const response = await fetch(
            `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        const countryData = await response.json();
        
        return {
            name: countryData[0].name.common,
            capital: countryData[0].capital[0],
            population: countryData[0].population,
            currency: Object.keys(countryData[0].currencies)[0]
        };
    } catch (error) {
        console.error('Failed to get country info:', error);
        return null;
    }
}

export { getCountryInfo };