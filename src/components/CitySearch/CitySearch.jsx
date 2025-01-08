import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchCities, handleCitySelection } from "../../APIs/openWeatherAPI";
import "./CitySearch.css";

const CitySearch = ({ onCitySelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const cityResults = await searchCities(searchQuery);
                setResults(cityResults);
            } catch (error) {
                console.error("Failed to search cities:", error);
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCityClick = async (city) => {
        setSearchQuery("");
        setResults([]);
        
        const weatherData = await handleCitySelection(city);
        
        if (location.pathname === "/city-card") {
            onCitySelect?.(city, weatherData);
        } else {
            navigate("/city-card", { 
                state: { 
                    city,
                    weatherData  
                } 
            });
        }
    };

    return (
        <div className="search-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {results.length > 0 && (
                    <ul className="dropdown">
                        {results.map((city) => (
                            <li 
                                key={`${city.id}-${city.lat}-${city.lon}`}
                                onClick={() => handleCityClick(city)}
                            >
                                {`${city.name}, ${city.country}`}
                                {city.state && ` (${city.state})`}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CitySearch;