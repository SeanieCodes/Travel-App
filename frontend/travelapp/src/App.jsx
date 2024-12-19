import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import CitySearch from './components/CitySearch/CitySearch';
import CityCard from './components/CityCard/CityCard';

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Calendar</Link></li>
                    <li><Link to="/city-search">City Search</Link></li>
                    <li><Link to="/city-card">City Card</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/city-search" element={<CitySearch />} />
                <Route path="/city-card" element={<CityCard />} />
            </Routes>
        </Router>
    );
};

export default App;
