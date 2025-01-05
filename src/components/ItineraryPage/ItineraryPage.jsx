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
    const [editingIndex, setEditingIndex] = useState(null);
    const [editActivity, setEditActivity] = useState({
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
            const updatedActivities = [...activities, newActivity]
                .sort((a, b) => a.time.localeCompare(b.time));
            setActivities(updatedActivities);
            setNewActivity({ time: '', description: '' });
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditActivity(activities[index]);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditActivity({ time: '', description: '' });
    };

    const saveEdit = (index) => {
        if (editActivity.time && editActivity.description) {
            const updatedActivities = [...activities];
            updatedActivities[index] = editActivity;
            setActivities(updatedActivities.sort((a, b) => 
                a.time.localeCompare(b.time)
            ));
            setEditingIndex(null);
            setEditActivity({ time: '', description: '' });
        }
    };

    const deleteActivity = (index) => {
        const updatedActivities = activities.filter((_, i) => i !== index);
        setActivities(updatedActivities);
    };

    return (
        <div 
            className="itinerary-page"
            style={{ backgroundImage: `url(${backgroundImage})` }}
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
                            {editingIndex === index ? (
                                <>
                                    <input
                                        type="time"
                                        value={editActivity.time}
                                        onChange={(e) => setEditActivity({
                                            ...editActivity,
                                            time: e.target.value
                                        })}
                                        className="time-input"
                                    />
                                    <input
                                        type="text"
                                        value={editActivity.description}
                                        onChange={(e) => setEditActivity({
                                            ...editActivity,
                                            description: e.target.value
                                        })}
                                        className="description-input"
                                    />
                                    <button 
                                        onClick={() => saveEdit(index)}
                                        className="save-button"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={cancelEditing}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="activity-time">
                                        {activity.time}
                                    </span>
                                    <span className="activity-description">
                                        {activity.description}
                                    </span>
                                    <div className="activity-actions">
                                        <button 
                                            onClick={() => startEditing(index)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteActivity(index)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
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