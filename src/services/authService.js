// Define the base API URL from environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    // Store auth data
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const handleGoogleToken = async (credential) => {
  try {
    const response = await fetch(`${API_URL}/auth/google/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      throw new Error('Google authentication failed');
    }

    const data = await response.json();
    
    // Store user data and token
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    
    return data.user;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

export const checkAuth = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (user && token) {
    return JSON.parse(user);
  }
  
  return null;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};