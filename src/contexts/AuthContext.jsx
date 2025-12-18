import { createContext, useContext } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const value = {
    user: null,
    signIn: () => Promise.reject(new Error('Not implemented')),
    signUp: () => Promise.reject(new Error('Not implemented')),
    signOut: () => Promise.reject(new Error('Not implemented')),
    loading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};