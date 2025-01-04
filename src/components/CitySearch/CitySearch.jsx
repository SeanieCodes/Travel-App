import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitySearch.css";

const CitySearch = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            setResults([
                { id: 1, name: "London, England" },
                { id: 2, name: "London, Ontario" },
            ]);
        } else {
            setResults([]);
        }
    };

    const handleCityClick = (city) => {
        setSearchQuery("");
        setResults([]);  
        navigate("/city-card", { state: { city: city } });
    };

    return (
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
                            key={city.id} 
                            onClick={() => handleCityClick(city)}
                        >
                            {city.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CitySearch;
