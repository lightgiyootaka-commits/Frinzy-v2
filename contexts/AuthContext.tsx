
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_CURRENT_USER } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // In a real app, this would involve an API call to Firebase Auth
    setUser(MOCK_CURRENT_USER);
  };

  const logout = () => {
    // In a real app, this would sign the user out from Firebase
    setUser(null);
  };
  
  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser(prevUser => ({...prevUser!, ...updatedData}));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
