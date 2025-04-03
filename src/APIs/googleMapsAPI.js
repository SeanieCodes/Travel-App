const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
const PROXY_BASE_URL = `${API_URL}/proxy?url=`;
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Helper function to ensure we're making secure requests
function ensureHttps(url) {
  return url.replace('http://', 'https://');
}

// Helper function to handle API requests through the proxy
async function proxyFetch(url) {
  try {
    const encodedUrl = encodeURIComponent(ensureHttps(url));
    const response = await fetch(`${PROXY_BASE_URL}${encodedUrl}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in proxyFetch:', error);
    throw error;
  }
}

/**
 * Get transportation information for a city
 * Including major transit stations, airports, and public transit availability
 */
export async function getTransportationInfo(city) {
  try {
    if (!city?.name) {
      throw new Error('City information is required');
    }

    // First, search for general transportation info
    const transitUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=public+transportation+in+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const transitData = await proxyFetch(transitUrl);

    // Then, search specifically for airports
    const airportUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=airport+in+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const airportData = await proxyFetch(airportUrl);

    // Process the results to get meaningful information
    const transitHubs = transitData.results
      .filter(place => 
        place.types.some(type => 
          ['transit_station', 'bus_station', 'subway_station', 'train_station'].includes(type)
        )
      )
      .slice(0, 3)
      .map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        types: place.types,
        icon: place.icon
      }));

    const airports = airportData.results
      .filter(place => 
        place.types.includes('airport')
      )
      .slice(0, 2)
      .map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        international: place.name.toLowerCase().includes('international'),
        icon: place.icon
      }));

    // Determine the public transit score based on number and variety of options
    const transitTypes = new Set();
    transitData.results.forEach(place => {
      place.types.forEach(type => {
        if (['bus_station', 'subway_station', 'train_station', 'tram_station'].includes(type)) {
          transitTypes.add(type);
        }
      });
    });

    const publicTransitScore = (() => {
      if (transitTypes.size >= 3) return 'Excellent';
      if (transitTypes.size >= 2) return 'Good';
      if (transitTypes.size >= 1) return 'Limited';
      return 'Poor';
    })();

    return {
      transitHubs,
      airports,
      publicTransitScore,
      hasPublicTransit: transitTypes.size > 0,
      transitTypes: Array.from(transitTypes)
    };
  } catch (error) {
    console.error('Error getting transportation info:', error);
    return {
      transitHubs: [],
      airports: [],
      publicTransitScore: 'Unknown',
      hasPublicTransit: false,
      transitTypes: [],
      error: 'Could not load transportation data'
    };
  }
}

/**
 * Get popular attractions and landmarks in a city
 */
export async function getLandmarks(city) {
  try {
    if (!city?.name) {
      throw new Error('City information is required');
    }

    // Search for tourist attractions and landmarks
    const attractionsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const attractionsData = await proxyFetch(attractionsUrl);

    // Search for museums and cultural venues
    const museumsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=museums+in+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const museumsData = await proxyFetch(museumsUrl);

    // Combine and process the results
    const attractionsList = [...attractionsData.results, ...museumsData.results]
      // Remove duplicates based on place_id
      .filter((attraction, index, self) => 
        index === self.findIndex(a => a.place_id === attraction.place_id)
      )
      // Sort by rating (highest first)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      // Take top attractions
      .slice(0, 6)
      .map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || 'No ratings yet',
        totalRatings: place.user_ratings_total || 0,
        photo: place.photos?.[0]?.photo_reference 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
          : null,
        types: place.types.filter(type => 
          !['point_of_interest', 'establishment', 'tourist_attraction'].includes(type)
        ),
        icon: place.icon
      }));

    // Determine if the city is culturally rich based on number of attractions
    const culturalScore = (() => {
      if (attractionsList.length >= 5) return 'Rich';
      if (attractionsList.length >= 3) return 'Good';
      if (attractionsList.length >= 1) return 'Some attractions';
      return 'Limited information';
    })();

    return {
      attractions: attractionsList,
      culturalScore,
      totalFound: attractionsData.results.length + museumsData.results.length
    };
  } catch (error) {
    console.error('Error getting landmarks info:', error);
    return {
      attractions: [],
      culturalScore: 'Unknown',
      totalFound: 0,
      error: 'Could not load attractions data'
    };
  }
}

/**
 * Get information about local food and restaurants
 */
export async function getLocalCuisine(city) {
  try {
    if (!city?.name) {
      throw new Error('City information is required');
    }

    // Search for popular restaurants
    const restaurantsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=best+restaurants+in+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const restaurantsData = await proxyFetch(restaurantsUrl);

    // Search for local cuisine specifically
    const localCuisineUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=local+cuisine+${encodeURIComponent(city.name)}+${encodeURIComponent(city.country)}&key=${API_KEY}`;
    const localCuisineData = await proxyFetch(localCuisineUrl);

    // Process and combine results
    const restaurants = [...restaurantsData.results, ...localCuisineData.results]
      // Remove duplicates
      .filter((restaurant, index, self) => 
        index === self.findIndex(r => r.place_id === restaurant.place_id)
      )
      // Sort by rating
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      // Take top restaurants
      .slice(0, 5)
      .map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || 'No ratings yet',
        totalRatings: place.user_ratings_total || 0,
        priceLevel: place.price_level ? '$'.repeat(place.price_level) : 'Unknown',
        cuisineType: place.types.filter(type => 
          ['restaurant', 'food', 'cafe', 'bakery', 'bar'].includes(type)
        ),
        photo: place.photos?.[0]?.photo_reference 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
          : null
      }));

    // Calculate cuisine diversity score based on variety of restaurant types
    const cuisineTypes = new Set();
    restaurants.forEach(restaurant => {
      restaurant.cuisineType.forEach(type => cuisineTypes.add(type));
    });

    const foodScore = (() => {
      const avgRating = restaurants.reduce((sum, restaurant) => 
        sum + (typeof restaurant.rating === 'number' ? restaurant.rating : 0), 0
      ) / (restaurants.filter(r => typeof r.rating === 'number').length || 1);
      
      if (avgRating >= 4.5) return 'Exceptional';
      if (avgRating >= 4.0) return 'Excellent';
      if (avgRating >= 3.5) return 'Very Good';
      if (avgRating >= 3.0) return 'Good';
      return 'Average';
    })();

    return {
      restaurants,
      foodScore,
      cuisineTypes: Array.from(cuisineTypes),
      topRestaurantRating: restaurants[0]?.rating || 'No data'
    };
  } catch (error) {
    console.error('Error getting cuisine info:', error);
    return {
      restaurants: [],
      foodScore: 'Unknown',
      cuisineTypes: [],
      error: 'Could not load restaurant data'
    };
  }
}

/**
 * Get estimated travel times between two cities (if planning multi-city trips)
 */
export async function getTravelTime(originCity, destinationCity, mode = 'driving') {
  try {
    if (!originCity?.name || !destinationCity?.name) {
      throw new Error('Origin and destination cities are required');
    }

    const origin = `${originCity.name},${originCity.country}`;
    const destination = `${destinationCity.name},${destinationCity.country}`;
    
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${API_KEY}`;
    
    const directionsData = await proxyFetch(directionsUrl);
    
    if (!directionsData.routes || directionsData.routes.length === 0) {
      return {
        travelTimeText: 'Not available',
        travelTimeValue: 0,
        distanceText: 'Not available',
        distanceValue: 0,
        error: 'No route found'
      };
    }
    
    const route = directionsData.routes[0];
    const leg = route.legs[0];
    
    return {
      travelTimeText: leg.duration.text,
      travelTimeValue: leg.duration.value, // in seconds
      distanceText: leg.distance.text,
      distanceValue: leg.distance.value, // in meters
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      steps: leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
        travelMode: step.travel_mode
      }))
    };
  } catch (error) {
    console.error('Error getting travel time:', error);
    return {
      travelTimeText: 'Not available',
      travelTimeValue: 0,
      distanceText: 'Not available',
      distanceValue: 0,
      error: 'Could not calculate travel time'
    };
  }
}

/**
 * Geocode a city name to get latitude/longitude
 * Useful if you need precise coordinates for other API calls
 */
export async function geocodeCity(city) {
  try {
    if (!city?.name) {
      throw new Error('City name is required');
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city.name)},${encodeURIComponent(city.country)}&key=${API_KEY}`;
    
    const geocodeData = await proxyFetch(geocodeUrl);
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return {
        lat: null,
        lng: null,
        formattedAddress: '',
        error: 'Location not found'
      };
    }
    
    const location = geocodeData.results[0].geometry.location;
    
    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: geocodeData.results[0].formatted_address,
      placeId: geocodeData.results[0].place_id
    };
  } catch (error) {
    console.error('Error geocoding city:', error);
    return {
      lat: null,
      lng: null,
      formattedAddress: '',
      error: 'Could not geocode location'
    };
  }
}

export default {
  getTransportationInfo,
  getLandmarks,
  getLocalCuisine,
  getTravelTime,
  geocodeCity
};