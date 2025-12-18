import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (username, password) => {
    setLoading(true);
    try {
      // Simple authentication - in a real app, this would be an API call
      if (username === 'Andro88' && password === 'Ermetello88') {
        const user = { id: 1, username: 'Andro88', name: 'Alessandro Amoroso' };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Credenziali non valide');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is already logged in
  const checkAuth = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const value = {
    user,
    signIn,
    signOut,
    loading,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};