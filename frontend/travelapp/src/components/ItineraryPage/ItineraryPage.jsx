import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/pinkflower.avif';
import './ItineraryPage.css';

const ItineraryPage = ({ cityDates }) => {

    const { date } = useParams();
    const navigate = useNavigate();
    const cityForThisDate = cityDates?.[date];
    const [activities, setActivities] = useState([]);
        const [newActivity, setNewActivity] = useState({
        time: '',
        description: ''
    });

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleAddActivity = () => {
        if (newActivity.time && newActivity.description) {
            setActivities([...activities, newActivity]);
            setNewActivity({ time: '', description: '' });
        }
    };

    return (
        <div
        className="itinerary-page"
        style={{ backgroundImage: `url(${backgroundImage})` 
        }}
        >
            <h1>Plan Your Day</h1>
            <div className="itinerary-container">
                <div className="date-header">
                    <h2>{formattedDate}</h2>
                    {cityForThisDate ? (
                        <h3>City: {cityForThisDate.name}</h3>
                    ) : (
                        <h3>No city selected for this date</h3>
                    )}
                </div>

                <div className="add-activity">
                    <input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({
                            ...newActivity,
                            time: e.target.value
                        })}
                        className="time-input"
                    />
                    <input
                        type="text"
                        placeholder="What's your plan?"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({
                            ...newActivity,
                            description: e.target.value
                        })}
                        className="description-input"
                    />
                    <button 
                        onClick={handleAddActivity}
                        className="add-button"
                    >
                        Add to Schedule
                    </button>
                </div>

                <div className="activities-list">
                    <h3>Activities</h3>
                    {activities.map((activity, index) => (
                        <div key={index} className="activity-item">
                            <span className="activity-time">
                                {activity.time}
                            </span>
                            <span className="activity-description">
                                {activity.description}
                            </span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => navigate('/')}
                    className="back-button"
                >
                    Back to Calendar
                </button>
            </div>
        </div>
    );
};

export default ItineraryPage;