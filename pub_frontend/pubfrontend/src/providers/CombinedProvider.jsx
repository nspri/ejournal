// CombinedProvider.js
import React from 'react';
import { AuthProvider } from './AuthContext';
//import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './Usercontext';
//import { CartPr ovider } from './cartcontext';

const CombinedProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  );
};

export default CombinedProvider;