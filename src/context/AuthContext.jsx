import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { VITE_APP_API_URL } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [qr,setQr] = useState(null)
  const [adminNotifications,setAdminNotifications] = useState(0)

  // Configure axios to send cookies with requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
    
    // Add response interceptor to handle 401 errors globally
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("401 error detected, logging out user");
          clearAuthState();
        }
        return Promise.reject(error);
      }
    );
    
    // Check for stored admin data first
    const storedAdmin = localStorage.getItem('admin_user');
    const isStoredAdmin = localStorage.getItem('is_admin');
    
    if (storedAdmin && isStoredAdmin === 'true') {
      try {
        const adminData = JSON.parse(storedAdmin);
        setUser(adminData);
        setIsAdmin(true);
        setNotificationCount(0);
        console.log("Restored admin session from localStorage");
      } catch (error) {
        console.error("Error parsing stored admin data:", error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('is_admin');
      }
    }
    
    checkAuthStatus();
    
    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
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
      // Don't clear auth state immediately on error - let the specific auth check handle it
      // This prevents unnecessary logouts on network issues
    } finally {
      setLoading(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      const userResponse = await axios.get(
        `${VITE_APP_API_URL}/api/auth/profile`
      );
      const { user: userData, notifications,adminQR } = userResponse.data;

      setUser(userData);
      setIsAdmin(false);
      console.log("userData")
      setQr(adminQR)
      setNotificationCount(notifications || 0);
    } catch (error) {
      // If user auth fails with 401, clear auth state
      if (error.response?.status === 401) {
        console.log("User auth failed with 401, clearing auth state");
        clearAuthState();
        return;
      }
      
      // For other errors, try admin auth as fallback
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
      setAdminNotifications(adminData.notifications); // Admin doesn't have user notifications
      
      // Store admin data in localStorage for persistence
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      localStorage.setItem('is_admin', 'true');
    } catch (error) {
      console.error("Admin auth check failed:", error);
      
      // Check if we have stored admin data as fallback
      const storedAdmin = localStorage.getItem('admin_user');
      const isStoredAdmin = localStorage.getItem('is_admin');
      
      if (storedAdmin && isStoredAdmin === 'true') {
        try {
          const adminData = JSON.parse(storedAdmin);
          setUser(adminData);
          setIsAdmin(true);
          setAdminNotifications(0);
          console.log("Using stored admin data as fallback");
          return;
        } catch (parseError) {
          console.error("Error parsing stored admin data:", parseError);
        }
      }
      
      // Only clear auth state if no stored data is available
      clearAuthState();
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setIsAdmin(false);
    setNotificationCount(0);
    
    // Clear stored admin data
    localStorage.removeItem('admin_user');
    localStorage.removeItem('is_admin');
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
      setAdminNotifications(0);

      // Store admin data in localStorage for persistence
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      localStorage.setItem('is_admin', 'true');

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
      setAdminNotifications(0);
      
      // Clear stored admin data
      localStorage.removeItem('admin_user');
      localStorage.removeItem('is_admin');
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
    adminNotifications,
    isAuthenticated: !!user,
    qr,
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
