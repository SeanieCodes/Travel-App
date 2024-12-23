import { useLocation, useNavigate } from "react-router-dom";
import CitySearch from "../CitySearch/CitySearch";
import "./CityCard.css";

const CityCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const city = location.state?.city || { name: "Unknown City" };

    return (
        <div className="city-card-page">
            <CitySearch />
            <div className="city-card">
                <h1>{city.name}</h1>
                <p><strong>Weather:</strong> Sunny</p>
                <p><strong>Population:</strong> 2M</p>
                <button onClick={() => navigate("/")}>Back to Calendar</button>
            </div>
        </div>
    );
};

export default CityCard;