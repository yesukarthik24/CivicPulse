import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicpulse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Auth session restore failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('civicpulse_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password, role = 'citizen') => {
    const res = await authAPI.register({ name, email, password, role });
    if (res.data.success) {
      localStorage.setItem('civicpulse_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('civicpulse_token');
    setToken(null);
    setUser(null);
  };

  // Quick Demo Helper to switch role between Admin and Citizen seamlessly
  const switchRole = async (targetRole) => {
    const email = targetRole === 'admin' ? 'admin@civicpulse.org' : 'citizen@civicpulse.org';
    const password = targetRole === 'admin' ? 'admin123' : 'citizen123';
    try {
      await login(email, password);
    } catch (e) {
      // Fallback local state if backend call fails
      setUser(prev => prev ? { ...prev, role: targetRole } : { name: `Demo ${targetRole}`, email, role: targetRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
