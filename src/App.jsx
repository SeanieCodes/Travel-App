import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyCalendar from './components/MyCalendar/MyCalendar';
import CityCard from './components/CityCard/CityCard';
import ItineraryPage from './components/ItineraryPage/ItineraryPage';

const App = () => {

    const [cityDates, setCityDates] = useState({});
    const assignCityToDate = (date, city) => {
        setCityDates((prevDates) => ({
            ...prevDates,
            [date]: city
        }));
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={<MyCalendar cityDates={cityDates} />} 
                />
                <Route 
                    path="/city-card" 
                    element={<CityCard onDateSelect={assignCityToDate} />} 
                />
                <Route 
                    path="/itinerary/:date" 
                    element={<ItineraryPage cityDates={cityDates}/>} 
                />
            </Routes>
        </Router>
    );
};

export default App;