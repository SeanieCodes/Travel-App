import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import backgroundImage from '../../assets/bunny.png';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await signIn(formData);
      
      if (response && response.token) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            username: response.username,
            _id: response._id
          })
        );
        localStorage.setItem('token', response.token);
        
        setUser({
          username: response.username,
          _id: response._id
        });
        
        navigate('/');
      }
    } catch (error) {
      setError('Invalid username or password. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
        <h2>Welcome</h2>
        
        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formGroup">
            <label htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="errorMessage">{error}</div>}

          <button 
            type="submit" 
            className="loginButton"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className="signupPrompt">
            Don't have an account? 
            <button 
              type="button" 
              className="signupLink"
              onClick={() => navigate('/signup')}
            >
              Sign up here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;