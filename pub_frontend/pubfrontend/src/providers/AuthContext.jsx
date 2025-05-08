import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage, if available, otherwise set to false
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    return storedLoggedInStatus === 'true'; // Convert stored string back to boolean
  });

  // Save login status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  // Functions to log in and log out
  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // Clear login status from localStorage on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
