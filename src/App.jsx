import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyCalendar from './components/MyCalendar/MyCalendar';
import CityCard from './components/CityCard/CityCard';
import ItineraryPage from './components/ItineraryPage/ItineraryPage';
import { formatRawDateString, sortActivitiesByTime } from './utils/dateTimeUtils';

const App = () => {
    const [cityDates, setCityDates] = useState({});
    const [dateActivities, setDateActivities] = useState({});

    const assignCityToDate = (date, city) => {
        const normalizedDate = formatRawDateString(date);
        setCityDates((prevDates) => ({
            ...prevDates,
            [normalizedDate]: {
                id: city.id,
                name: city.name
            }
        }));
    };

    const addActivity = (date, activity) => {
        setDateActivities(prev => {
            const existingActivities = prev[date] || [];
            const updatedActivities = sortActivitiesByTime([...existingActivities, activity]);
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
                [date]: sortActivitiesByTime(activities)
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