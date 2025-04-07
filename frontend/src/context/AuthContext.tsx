
"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthState, setLoading, logout as logoutAction } from '../store/authSlice';
import api from '../utils/api';

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  last_update: string;
  create_on: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/me');
          dispatch(setAuthState({ user: data, isAuthenticated: true }));
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          dispatch(setAuthState({ user: null, isAuthenticated: false }));
        }
      } else {
        dispatch(setAuthState({ user: null, isAuthenticated: false }));
      }
      dispatch(setLoading(false));
    };
    checkAuth();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/token', { email, password });
      localStorage.setItem('token', data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      const userResponse = await api.get('/auth/me');
      dispatch(setAuthState({ user: userResponse.data, isAuthenticated: true }));
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { user_name: username, user_email: email, password });
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};