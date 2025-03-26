import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import MyCalendar from './components/MyCalendar/MyCalendar';
import CityCard from './components/CityCard/CityCard';
import ItineraryPage from './components/ItineraryPage/ItineraryPage';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import { checkAuth } from './services/authService';
import { formatRawDateString, sortActivitiesByTime } from './utils/dateTimeUtils';

// Protected route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

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
    }

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
        <UserProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                    
                    {/* Protected routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <MyCalendar cityDates={cityDates} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/city-card" 
                        element={
                            <ProtectedRoute>
                                <CityCard onDateSelect={assignCityToDate} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/itinerary/:date" 
                        element={
                            <ProtectedRoute>
                                <ItineraryPage 
                                    cityDates={cityDates}
                                    activities={dateActivities}
                                    onAddActivity={addActivity}
                                    onUpdateActivity={updateActivity}
                                    onDeleteActivity={deleteActivity}
                                />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Redirect any other routes to login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;