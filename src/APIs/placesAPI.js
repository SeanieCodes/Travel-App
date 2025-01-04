const googleApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

async function getPlaceDetails(cityName) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName}&inputtype=textquery&key=${googleApiKey}`
        );
        const placeData = await response.json();
        return {
            name: placeData.candidates[0].name,
            location: placeData.candidates[0].formatted_address
        };
    } catch (error) {
        console.error('Failed to get place details:', error);
        return null;
    }
}

export { getPlaceDetails };