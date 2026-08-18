import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app refresh
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiRequest('/auth/profile');
          // Handle various backend response wrappers (e.g. response.user or direct object)
          setUser(response?.user || response);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Flexible extraction depending on whether the token is at the root or nested inside data
      const token = data?.token || data?.accessToken;
      const userData = data?.user || data;

      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (userData) {
        setUser(userData);
      }

      return data;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const token = data?.token || data?.accessToken;
      const userData = data?.user || data;

      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (userData) {
        setUser(userData);
      }

      return data;
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API warning:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.reload();
    }
  };
  const deleteAccount = async () => {
  try {
    const response = await apiRequest("/auth/account", {
      method: "DELETE",
    });

    // Remove local authentication
    localStorage.removeItem("token");

    // Clear user state
    setUser(null);

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    throw error;
  }
};
  return (
    <AuthContext.Provider
  value={{
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    deleteAccount
  }}
>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);