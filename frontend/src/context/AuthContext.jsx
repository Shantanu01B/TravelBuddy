import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('travelbuddy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      refreshProfile();
    }
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await API.get('/auth/profile');
      if (res.data.success) {
        const updated = { ...user, ...res.data.data };
        setUser(updated);
        localStorage.setItem('travelbuddy_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('travelbuddy_user', JSON.stringify(userData));
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const data = res.data.data;
        setUser(data);
        localStorage.setItem('travelbuddy_user', JSON.stringify(data));
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      if (res.data.success) {
        const updated = { ...user, ...res.data.data };
        setUser(updated);
        localStorage.setItem('travelbuddy_user', JSON.stringify(updated));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelbuddy_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
