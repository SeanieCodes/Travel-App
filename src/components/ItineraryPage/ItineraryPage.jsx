import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import './ItineraryPage.css';

const ItineraryPage = ({ 
    cityDates, 
    activities, 
    onAddActivity, 
    onUpdateActivity, 
    onDeleteActivity 
}) => {
    const { date } = useParams();
    const navigate = useNavigate();
    const cityForThisDate = cityDates?.[date];
    
    const [newActivity, setNewActivity] = useState({
        time: '',
        description: ''
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editActivity, setEditActivity] = useState({
        time: '',
        description: ''
    });

    const dateActivities = activities[date] || [];
    const formattedDate = formatDateForDisplay(date);

    const handleAddActivity = () => {
        if (newActivity.time && newActivity.description) {
            onAddActivity(date, newActivity);
            setNewActivity({ time: '', description: '' });
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditActivity(dateActivities[index]);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditActivity({ time: '', description: '' });
    };

    const saveEdit = (index) => {
        if (editActivity.time && editActivity.description) {
            onUpdateActivity(date, index, editActivity);
            setEditingIndex(null);
            setEditActivity({ time: '', description: '' });
        }
    };

    const handleDelete = (index) => {
        onDeleteActivity(date, index);
    };

    return (
        <div className="itinerary-page">
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
                    {dateActivities.map((activity, index) => (
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
                                            onClick={() => handleDelete(index)}
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