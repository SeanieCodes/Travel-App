import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import './NavButtons.css';

const NavButtons = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <div className="nav-buttons">
            <button 
                className="trips-button"
                onClick={() => navigate('/trips')}
            >
                My Trips
            </button>
            
            <button 
                className="calendar-button"
                onClick={() => navigate('/calendar')}
            >
                Calendar
            </button>
            
            <button 
                className="signout-button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default NavButtons;