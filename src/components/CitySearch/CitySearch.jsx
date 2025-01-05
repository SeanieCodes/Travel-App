import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchCities } from "../../APIs/openWeatherAPI";
import "./CitySearch.css";

const CitySearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const cityResults = await searchCities(searchQuery);
                setResults(cityResults);
            } catch (error) {
                console.error("Failed to search cities:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCityClick = (city) => {
        setSearchQuery("");
        setResults([]);
        navigate("/city-card", { state: { city: city } });
    };

    return (
        <div className="search-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={isLoading ? "loading" : ""}
                />
                {results.length > 0 && (
                    <ul className="dropdown">
                        {results.map((city) => (
                            <li 
                                key={city.id} 
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