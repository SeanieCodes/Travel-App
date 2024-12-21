import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import CityCard from './components/CityCard/CityCard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/city-card" element={<CityCard />} />
            </Routes>
        </Router>
    );
};

export default App;