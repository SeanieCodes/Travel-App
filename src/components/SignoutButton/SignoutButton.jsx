import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { logout } from '../../services/authService';
import './SignoutButton.css';

const SignoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSignOut = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <button className="signoutButton" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignoutButton;