// AuthContext
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { VITE_APP_API_URL } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios to send cookies with requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);


  useEffect(() => {
    // Check if user is logged in by making a request to the server
    // The server will check the cookies and return user data if valid
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${VITE_APP_API_URL}/api/auth/login`, {
        email,
        password
      });

      const { user: userData } = response.data;
      
      // Update state - token is now stored in HTTP-only cookie
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${VITE_APP_API_URL}/api/auth/register`, userData);
      
      const { user: newUser } = response.data;
      
      // Update state - token is now stored in HTTP-only cookie
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAllSessions();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      setUser(null);
      setIsAdmin(false);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      // Update the user profile on the backend
      const response = await axios.put(`${VITE_APP_API_URL}/api/auth/profile`, updatedData);

      // Get the updated user data from the response
      const updatedUser = response.data.user || { ...user, ...updatedData };
      
      // Update local state
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      // Check current path to determine authentication priority
      const currentPath = window.location.pathname;
      const isAdminRoute = currentPath.startsWith('/admin');
      
      if (isAdminRoute) {
        // For admin routes, check admin auth first
        try {
          const adminResponse = await axios.get(`${VITE_APP_API_URL}/api/admin/profile`);
          const adminData = adminResponse.data.user;
          setUser(adminData);
          setIsAdmin(true);
          
        } catch {
          // If admin auth fails, try user auth
          try {
            const userResponse = await axios.get(`${VITE_APP_API_URL}/api/auth/profile`);
            const userData = userResponse.data.user;
            setUser(userData);
            setIsAdmin(false);
            
          } catch {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } else {
        // For user routes, check user auth first
        try {
          const userResponse = await axios.get(`${VITE_APP_API_URL}/api/auth/profile`);
          const userData = userResponse.data.user;
          setUser(userData);
          setIsAdmin(false);
          
        } catch {
          // If user auth fails, try admin auth
          try {
            const adminResponse = await axios.get(`${VITE_APP_API_URL}/api/admin/profile`);
            const adminData = adminResponse.data.user;
            setUser(adminData);
            setIsAdmin(true);

          } catch {
            setUser(null);
            setIsAdmin(false);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      
      const response = await axios.post(`${VITE_APP_API_URL}/api/admin/login`, {
        email,
        password
      });

      const { user: adminUser } = response.data;
      
      // Update state - admin token is now stored in HTTP-only cookie
      setIsAdmin(true);
      
      return adminUser;
    } catch (error) {
      console.error('Admin login error:', error);
        console.error('Network error:', error.code);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error: Cannot connect to server. Please ensure backend is running.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Admin login endpoint not found. Please check server configuration.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Admin login failed. Please try again.');
    }
  };

  const clearAllSessions = async () => {
    try {
      // Clear both user and admin cookies
      await Promise.allSettled([
        axios.post(`${VITE_APP_API_URL}/api/auth/logout`),
        axios.post(`${VITE_APP_API_URL}/api/admin/logout`)
      ]);
    } catch (error) {
      console.error('Clear sessions error:', error);
    }
  };

  const adminLogout = async () => {
    try {
      await clearAllSessions();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setIsAdmin(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAdmin,
    loading,
    login,
    signup,
    logout,
    adminLogout,
    updateUserProfile,
    checkAuthStatus,
    adminLogin,
    clearAllSessions,
    isAuthenticated: !!user || isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
