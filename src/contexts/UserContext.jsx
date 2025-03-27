import { createContext, useState, useEffect } from 'react';
import { checkAuth } from '../services/authService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const authenticatedUser = checkAuth();
      if (authenticatedUser) {
        setUser(authenticatedUser);
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};