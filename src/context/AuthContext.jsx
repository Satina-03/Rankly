import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from sessionStorage on page refresh
    try {
      const stored = sessionStorage.getItem('rankly_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('rankly_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('rankly_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('rankly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
