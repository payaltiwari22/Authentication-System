import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'https://auth-api-backend-t7hi.onrender.com',
  });

  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setUser(data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
      // Valid token might have expired, clear it
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    setToken(data.access_token);
  };

  const googleLogin = async (googleToken) => {
    const { data } = await api.post('/google-login', { token: googleToken });
    setToken(data.access_token);
  };

  const register = async (userData) => {
    await api.post('/register', userData);
  };

  const forgotPassword = async (email) => {
    await api.post('/forgot-password', { email });
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, googleLogin, register, forgotPassword, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
