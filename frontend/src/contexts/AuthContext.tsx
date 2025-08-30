import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api';

type User = {
  id: number;
  email: string;
  username: string;
  pic_url?: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (username: string, email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData.user);
          } catch (error) {
            console.error('Failed to load user', error);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error in loadUser', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, redirectTo = '/') => {
    try {
      setLoading(true);
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      window.location.href = redirectTo;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, redirectTo = '/signin') => {
    try {
      setLoading(true);
      const { user, token } = await authService.register(username, email, password);
      localStorage.setItem('token', token);
      setUser(user);
      window.location.href = redirectTo;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/signin';
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
