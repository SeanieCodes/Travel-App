import { useState, useEffect } from 'react';
import { getLandmarks } from '../../APIs/googleMapsAPI';
import './LandmarksCard.css';

const LandmarksCard = ({ city }) => {
    const [landmarks, setLandmarks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!city?.name) return;

        async function loadLandmarks() {
            try {
                setLoading(true);
                const landmarksData = await getLandmarks(city);
                setLandmarks(landmarksData);
            } catch (error) {
                console.error('Failed to load landmarks:', error);
            } finally {
                setLoading(false);
            }
        }

        loadLandmarks();
    }, [city]);

    const renderRatingStars = (rating) => {
        if (typeof rating !== 'number') return '★★★★★';
        
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        let stars = '★'.repeat(fullStars);
        if (halfStar) stars += '½';
        
        return stars;
    };

    if (loading) {
        return <div className="landmarks-card">Loading attractions and landmarks...</div>;
    }

    if (!landmarks || landmarks.error) {
        return <div className="landmarks-card">Could not load attractions data</div>;
    }

    return (
        <div className="landmarks-card">
            <div className="landmarks-header">
                <h2 className="landmarks-title">Top Attractions</h2>
                <span className="cultural-score">
                    Cultural Score: {landmarks.culturalScore}
                </span>
            </div>

            {landmarks.attractions.length > 0 ? (
                <div className="landmarks-grid">
                    {landmarks.attractions.map((landmark, index) => (
                        <div key={index} className="landmark-card">
                            <div className="landmark-details">
                                <h3 className="landmark-name">{landmark.name}</h3>
                                <div className="landmark-rating">
                                    <span className="rating-stars">
                                        {renderRatingStars(landmark.rating)}
                                    </span>
                                    <span className="rating-value">
                                        {typeof landmark.rating === 'number' 
                                            ? `${landmark.rating.toFixed(1)} (${landmark.totalRatings} reviews)` 
                                            : landmark.rating}
                                    </span>
                                </div>
                                {landmark.types && landmark.types.length > 0 && (
                                    <div className="landmark-type">
                                        {landmark.types[0].replace(/_/g, ' ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-landmarks">
                    No attractions found for this location. Try searching for a different city.
                </div>
            )}
        </div>
    );
};

export default LandmarksCard;