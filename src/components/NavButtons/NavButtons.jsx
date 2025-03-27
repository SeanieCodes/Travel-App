import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { logout } from '../../services/authService';
import './NavButtons.css';

const NavButtons = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const handleTripsClick = () => {
    navigate('/trips');
  };

  const handleCalendarClick = () => {
    navigate('/');
  };

  return (
    <div className="nav-buttons">
      <button 
        onClick={handleCalendarClick}
        className="calendar-button"
      >
        Calendar
      </button>
      <button 
        onClick={handleTripsClick}
        className="trips-button"
      >
        My Trips
      </button>
      <button 
        onClick={handleSignout}
        className="signout-button"
      >
        Sign Out
      </button>
    </div>
  );
};

export default NavButtons;