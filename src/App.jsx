import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyCalendar from './components/MyCalendar/MyCalendar';
import CityCard from './components/CityCard/CityCard';
import ItineraryPage from './components/ItineraryPage/ItineraryPage';

const App = () => {
    const [cityDates, setCityDates] = useState({});
    const [dateActivities, setDateActivities] = useState({});

    const formatDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const assignCityToDate = (date, city) => {
        const normalizedDate = formatDateString(date);
        setCityDates((prevDates) => {
            const cityData = {
                id: city.id,
                name: city.name
            };
            return {
                ...prevDates,
                [normalizedDate]: cityData
            };
        });
    };

    const addActivity = (date, activity) => {
        setDateActivities(prev => {
            const existingActivities = prev[date] || [];
            const updatedActivities = [...existingActivities, activity]
                .sort((a, b) => a.time.localeCompare(b.time));
            return {
                ...prev,
                [date]: updatedActivities
            };
        });
    };

    const updateActivity = (date, index, updatedActivity) => {
        setDateActivities(prev => {
            const activities = [...(prev[date] || [])];
            activities[index] = updatedActivity;
            return {
                ...prev,
                [date]: activities.sort((a, b) => a.time.localeCompare(b.time))
            };
        });
    };

    const deleteActivity = (date, index) => {
        setDateActivities(prev => {
            const activities = prev[date]?.filter((_, i) => i !== index) || [];
            return {
                ...prev,
                [date]: activities
            };
        });
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
                    element={
                        <ItineraryPage 
                            cityDates={cityDates}
                            activities={dateActivities}
                            onAddActivity={addActivity}
                            onUpdateActivity={updateActivity}
                            onDeleteActivity={deleteActivity}
                        />
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;