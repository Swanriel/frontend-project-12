import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); // ← ДОБАВЬТЕ
    if (token && username) {
      setUser({ token, username }); // ← ДОБАВЬТЕ username
    }
    setLoading(false);
  }, []);

  const login = (token, username) => { // ← ДОБАВЬТЕ username параметр
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); // ← ДОБАВЬТЕ
    setUser({ token, username }); // ← ДОБАВЬТЕ
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // ← ДОБАВЬТЕ
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};