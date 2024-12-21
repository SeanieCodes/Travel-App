import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import CityCard from './components/CityCard/CityCard';

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Calendar</Link></li>
                    <li><Link to="/city-card">City Card</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/city-card" element={<CityCard />} />
            </Routes>
        </Router>
    );
};

export default App;