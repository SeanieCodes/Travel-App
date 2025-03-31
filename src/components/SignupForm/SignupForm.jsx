import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import backgroundImage from '../../assets/bunny.png';
import './SignupForm.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await signUp({
        username: formData.username,
        password: formData.password
      });

      if (response) {
        // Successfully registered, redirect to login
        navigate('/login');
      }
    } catch (error) {
      setError('Username may already be taken or an error occurred. Please try again later.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="signup-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="title-container">
        <h1>alcove</h1>
      </div>
      
      <div className="signupContainer">
        <h2>Create Your Account</h2>
        
        <form onSubmit={handleSubmit} className="signupForm">
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
              placeholder="Choose your username"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Choose your password"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && <div className="errorMessage">{error}</div>}

          <button 
            type="submit" 
            className="signupButton"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="loginPrompt">
            Already have an account? 
            <button 
              type="button" 
              className="loginLink"
              onClick={() => navigate('/login')}
            >
              Log in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;