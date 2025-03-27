const API_URL = 'http://localhost:5001/api';

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

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
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