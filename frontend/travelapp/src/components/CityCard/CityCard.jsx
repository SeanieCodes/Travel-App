import "./CityCard.css";

const CityCard = ({ city = "Paris", weather = "Sunny", population = "2M" }) => {
    return (
        <div className="city-card">
            <h1>{city}</h1>
            <p><strong>Weather:</strong> {weather}</p>
            <p><strong>Population:</strong> {population}</p>
        </div>
    );
};

export default CityCard;