import React, { useState } from "react";
import "./CitySearch.css";

const CitySearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        setResults([
            { id: 1, name: "Paris" },
            { id: 2, name: "New York" },
            { id: 3, name: "Tokyo" },
        ]);
    };

    return (
        <div className="city-search">
            <h1>Search for a City</h1>
            <input
                type="text"
                placeholder="Enter city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <ul>
                {results.map((city) => (
                    <li key={city.id}>{city.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CitySearch;
