import './App.css';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './contexts/UserContext';
import MyCalendar from './components/MyCalendar/MyCalendar';
import CityCard from './components/CityCard/CityCard';
import ItineraryPage from './components/ItineraryPage/ItineraryPage';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import SignoutButton from './components/SignoutButton/SignoutButton';
import { checkAuth } from './services/authService';
import { getTravelPlan, saveTravelPlan } from './services/travelService';
import { formatRawDateString, sortActivitiesByTime } from './utils/dateTimeUtils';

// Protected route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <SignoutButton />
      {children}
    </>
  );
};

const AppContent = () => {
    const { user, loading: authLoading } = useContext(UserContext);
    const [cityDates, setCityDates] = useState({});
    const [dateActivities, setDateActivities] = useState({});
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    // Load user's travel data when authentication changes
    useEffect(() => {
        const loadTravelData = async () => {
            try {
                if (user && !authLoading) {
                    const travelPlan = await getTravelPlan();
                    
                    // Convert array structure to object structure for frontend
                    const cityDatesObj = {};
                    if (travelPlan.cityDates && travelPlan.cityDates.length > 0) {
                        travelPlan.cityDates.forEach(item => {
                            cityDatesObj[item.date] = {
                                id: item.cityId,
                                name: item.cityName
                            };
                        });
                        setCityDates(cityDatesObj);
                    }
                    
                    const activitiesObj = {};
                    if (travelPlan.dateActivities && travelPlan.dateActivities.length > 0) {
                        travelPlan.dateActivities.forEach(item => {
                            activitiesObj[item.date] = item.activities;
                        });
                        setDateActivities(activitiesObj);
                    }
                } else if (authLoading) {
                    return; // Don't set loading to false yet
                }
            } catch (err) {
                console.error("Failed to load travel data:", err);
                setError("Failed to load your travel plans. Please try again later.");
            } finally {
                if (!authLoading) {
                    setDataLoading(false);
                }
            }
        };
        
        loadTravelData();
    }, [user, authLoading]);
    
    // Save travel data whenever it changes
    useEffect(() => {
        const saveTravelData = async () => {
            try {
                setSaveError(null); // Clear previous errors
                
                // Only save if authenticated, not loading, and we have data to save
                if (user && !authLoading && !dataLoading && Object.keys(cityDates).length > 0) {
                    // Convert object structure to array structure for backend
                    const cityDatesArray = Object.entries(cityDates).map(([date, city]) => ({
                        date,
                        cityId: city.id,
                        cityName: city.name
                    }));
                    
                    const activitiesArray = Object.entries(dateActivities).map(([date, activities]) => ({
                        date,
                        activities
                    }));
                    
                    await saveTravelPlan({
                        cityDates: cityDatesArray,
                        dateActivities: activitiesArray
                    });
                }
            } catch (err) {
                console.error("Failed to save travel data:", err);
                setSaveError("Failed to save your changes. Please try again later.");
            }
        };
        
        // Debounce saving to avoid too many API calls
        const timeoutId = setTimeout(saveTravelData, 500);
        return () => clearTimeout(timeoutId);
    }, [cityDates, dateActivities, user, authLoading, dataLoading]);

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

    if (authLoading || dataLoading) {
        return <div className="loading">Loading your travel plans...</div>;
    }

    return (
        <>
            {(error || saveError) && (
                <div className="error-notification">
                    {error || saveError}
                </div>
            )}
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
        </>
    );
};

const App = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
};

export default App;