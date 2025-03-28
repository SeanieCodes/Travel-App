import { useState, useEffect } from 'react';
import { getTransportationInfo } from '../../APIs/googleMapsAPI';
import './TransportationCard.css';

const TransportationCard = ({ city }) => {
    const [transportInfo, setTransportInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!city?.name) return;

        async function loadTransportInfo() {
            try {
                setLoading(true);
                const info = await getTransportationInfo(city);
                setTransportInfo(info);
            } catch (error) {
                console.error('Failed to load transportation info:', error);
            } finally {
                setLoading(false);
            }
        }

        loadTransportInfo();
    }, [city]);

    if (loading) {
        return <div className="transportation-card">Loading transportation information...</div>;
    }

    if (!transportInfo || transportInfo.error) {
        return <div className="transportation-card">Could not load transportation data</div>;
    }

    return (
        <div className="transportation-card">
            <div className="transportation-header">
                <h2 className="transportation-title">Transportation Options</h2>
                <span className="public-transit-badge">
                    {transportInfo.hasPublicTransit ? 'Public Transit Available' : 'Limited Public Transit'}
                </span>
            </div>

            <div className="transit-hubs">
                <h3>Major Transit Hubs</h3>
                {transportInfo.transitHubs.length > 0 ? (
                    <ul className="hub-list">
                        {transportInfo.transitHubs.map((hub, index) => (
                            <li key={index} className="hub-item">
                                <span className="hub-name">{hub.name}</span>
                                <span className="hub-address">{hub.address}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No major transit hubs found for this location.</p>
                )}
            </div>
        </div>
    );
};

export default TransportationCard;