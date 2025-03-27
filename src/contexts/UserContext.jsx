import { createContext, useState, useEffect } from 'react';
import { checkAuth, logout as authLogout } from '../services/authService';

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

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};