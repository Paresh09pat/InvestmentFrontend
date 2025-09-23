import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { VITE_APP_API_URL } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Configure axios to send cookies with requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentPath = window.location.pathname;
      const isAdminRoute = currentPath.startsWith("/admin");

      if (isAdminRoute) {
        await checkAdminAuth();
      } else {
        await checkUserAuth();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      const userResponse = await axios.get(
        `${VITE_APP_API_URL}/api/auth/profile`
      );
      const { user: userData, notifications } = userResponse.data;

      setUser(userData);
      setIsAdmin(false);
      setNotificationCount(notifications || 0);
    } catch {
      // If user auth fails, try admin auth
      await checkAdminAuth();
    }
  };

  const checkAdminAuth = async () => {
    try {
      const adminResponse = await axios.get(
        `${VITE_APP_API_URL}/api/admin/profile`
      );
      const adminData = adminResponse.data.user;

      setUser(adminData);
      setIsAdmin(true);
      setNotificationCount(0); // Admin doesn't have user notifications
    } catch {
      clearAuthState();
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setIsAdmin(false);
    setNotificationCount(0);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${VITE_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user: userData } = response.data;
      setUser(userData);
      setIsAdmin(false);

      // Refresh notification count after login
      await checkUserAuth();

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${VITE_APP_API_URL}/api/auth/register`,
        userData
      );
      const { user: newUser } = response.data;

      setUser(newUser);
      setIsAdmin(false);
      setNotificationCount(0);

      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${VITE_APP_API_URL}/api/admin/login`, {
        email,
        password,
      });

      const { user: adminUser } = response.data;
      setUser(adminUser);
      setIsAdmin(true);
      setNotificationCount(0);

      return adminUser;
    } catch (error) {
      console.error("Admin login error:", error);

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Network error: Cannot connect to server. Please ensure backend is running."
        );
      }

      if (error.response?.status === 404) {
        throw new Error(
          "Admin login endpoint not found. Please check server configuration."
        );
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Admin login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await clearAllSessions();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthState();
    }
  };

  const adminLogout = async () => {
    try {
      await clearAllSessions();
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setIsAdmin(false);
      setUser(null);
      setNotificationCount(0);
    }
  };

  const clearAllSessions = async () => {
    try {
      await Promise.allSettled([
        axios.post(`${VITE_APP_API_URL}/api/auth/logout`),
        axios.post(`${VITE_APP_API_URL}/api/admin/logout`),
      ]);
    } catch (error) {
      console.error("Clear sessions error:", error);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put(
        `${VITE_APP_API_URL}/api/auth/profile`,
        updatedData
      );
      const updatedUser = response.data.user || { ...user, ...updatedData };

      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    notificationCount,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    adminLogin,
    adminLogout,
    updateUserProfile,
    checkAuthStatus,
    clearAllSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
