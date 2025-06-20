import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import CitySearch from '../CitySearch/CitySearch';
import backgroundImage from '../../assets/bunny.png';
import './ItineraryPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const ItineraryPage = ({ cityDates, activities, onAddActivity, onUpdateActivity, onDeleteActivity }) => {
  const { date } = useParams();
  const navigate = useNavigate();
  const cityForThisDate = cityDates?.[date];
  const dateActivities = activities[date] || [];
  const formattedDate = formatDateForDisplay(date);

  const [newActivity, setNewActivity] = useState({ time: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editActivity, setEditActivity] = useState({ time: '', description: '' });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddActivity = () => {
    if (newActivity.time && newActivity.description) {
      onAddActivity(date, newActivity);
      setNewActivity({ time: '', description: '' });
    }
  };

  const startEditing = idx => {
    setEditingIndex(idx);
    setEditActivity(dateActivities[idx]);
  };
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditActivity({ time: '', description: '' });
  };
  const saveEdit = idx => {
    if (editActivity.time && editActivity.description) {
      onUpdateActivity(date, idx, editActivity);
      cancelEditing();
    }
  };
  const handleDelete = idx => onDeleteActivity(date, idx);
  const clearAllActivities = () => dateActivities.forEach(() => onDeleteActivity(date, 0));

  const handleCityClick = () => {
    if (!cityForThisDate) return;
    const [name, country] = cityForThisDate.name.split(',').map(s => s.trim());
    navigate('/city-card', { state: { city: { id: cityForThisDate.id, name, country } } });
  };
  const handleCitySelect = city => navigate('/city-card', { state: { city } });

  const fetchSuggestions = async () => {
    if (!cityForThisDate) return;
    setLoading(true);
    const prompt = `
You are a travel assistant.
INPUT: city="${cityForThisDate.name}", date="${date}".
TASK: Return EXACTLY a JSON array of 5 place names (noun phrases), e.g. ["Place A","Place B","Place C","Place D","Place E"].
No extra text.
`;
    try {
      const res = await fetch(`${API_BASE}/ai/itinerary-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ city: cityForThisDate.name, dates: [date], promptOverride: prompt })
      });
      if (!res.ok) {
        console.error('AI suggestion error:', await res.text());
        return;
      }
      const { suggestion } = await res.json();
      const parsed = JSON.parse(suggestion);
      setPlaces(parsed);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    places.forEach(place => onAddActivity(date, { time: '', description: place }));
  };

  return (
    <div className="itinerary-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>Plan Your Day</h1>

      <div className="itinerary-search-container">
        <CitySearch onCitySelect={handleCitySelect} />
      </div>

      <div className="itinerary-container">
        <div className="date-header">
          <h2>{formattedDate}</h2>
          {cityForThisDate ? (
            <h3>
              City: <span className="city-link" onClick={handleCityClick}>{cityForThisDate.name}</span>
            </h3>
          ) : (
            <h3>No city selected for this date</h3>
          )}
        </div>

        {cityForThisDate && (
          <div className="ai-suggestions" style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="add-button" onClick={fetchSuggestions} disabled={loading}>
              {loading ? 'Loading…' : 'AI Suggestions'}
            </button>

            {places.length > 0 && (
              <div className="suggestion-box" style={{ marginTop: '1.5rem' }}>
                {places.map((place, idx) => (
                  <div key={idx} className="suggestion-board activity-item">{place}</div>
                ))}
                <div className="suggestion-actions">
                  <button className="add-button" onClick={applySuggestions}>Add All to Itinerary</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="add-activity">
          <input
            type="time"
            value={newActivity.time}
            onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
            className="time-input"
          />
          <input
            type="text"
            placeholder="What's your plan?"
            value={newActivity.description}
            onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
            className="description-input"
          />
          <button className="add-button" onClick={handleAddActivity}>Add to Schedule</button>
        </div>

        <div className="activities-list">
          <div className="activities-header">
            <h3>Activities</h3>
            {dateActivities.length > 0 && (
              <button className="delete-button clear-all" onClick={clearAllActivities}>Clear All</button>
            )}
          </div>

          {dateActivities.map((activity, idx) => (
            <div key={idx} className="activity-item">
              {editingIndex === idx ? (
                <>
                  <input
                    type="time"
                    value={editActivity.time}
                    onChange={e => setEditActivity({ ...editActivity, time: e.target.value })}
                    className="time-input"
                  />
                  <input
                    type="text"
                    value={editActivity.description}
                    onChange={e => setEditActivity({ ...editActivity, description: e.target.value })}
                    className="description-input"
                  />
                  <button className="save-button" onClick={() => saveEdit(idx)}>Save</button>
                  <button className="cancel-button" onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-description">{activity.description}</span>
                  <div className="activity-actions">
                    <button className="edit-button" onClick={() => startEditing(idx)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(idx)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;