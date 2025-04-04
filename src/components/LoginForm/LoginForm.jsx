import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleToken } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import backgroundImage from '../../assets/bunny.png';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setError('Google authentication failed. Please try again.');
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      const userData = await handleGoogleToken(credentialResponse.credential);
      setUser(userData);
      navigate('/');
    } catch (error) {
      setError('Google authentication failed. Please try again.');
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div 
      className="login-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="title-container">
        <h1>alcove</h1>
      </div>
      
      <div className="loginContainer">
        <h2>Welcome to Alcove</h2>
        <p className="login-description">Your smart travel companion</p>
        
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width={300}
          />
        </div>
        
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </div>
  );
};

export default LoginForm;