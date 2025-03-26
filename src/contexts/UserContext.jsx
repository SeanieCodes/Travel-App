import { createContext, useState, useEffect } from 'react';
import { checkAuth } from '../services/authService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticatedUser = checkAuth();
    if (authenticatedUser) {
      setUser(authenticatedUser);
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};