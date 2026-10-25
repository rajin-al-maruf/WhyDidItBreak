import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

import { loginUser, registerUser, getCurrentUser} from './authApi';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('whydiditbreak_token')))
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('whydiditbreak_token');

    if (!token) return;

    let active = true;

    const restoreSession = async () => {
        try {
        const data = await getCurrentUser();

        if (active) {
            setUser(data.user);
        }
        } catch (error) {
        if (!active) return;

        const status = error.response?.status;

        if (status === 401 || status === 404) {
            localStorage.removeItem('whydiditbreak_token');
            setUser(null);
        } else {
            setSessionError('Unable to verify your session. Please try refreshing.');
        }
        } finally {
        if (active) {
            setLoading(false);
        }
        }
    };

    restoreSession();

    return () => {
        active = false;
    };
    }, []);

  const register = async (credentials) => {
    try {
      return await registerUser(credentials);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      if (!data.token || !data.user) {
        return {
          success: false,
          message: 'Unexpected login response.',
        };
      }

      localStorage.setItem('whydiditbreak_token', data.token);
      setUser(data.user);
      setSessionError('');
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('whydiditbreak_token');
    setUser(null);
    setSessionError('');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout,loading, sessionError}}>
      {children}
    </AuthContext.Provider>
  );
};