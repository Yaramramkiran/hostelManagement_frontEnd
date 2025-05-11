import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000/api";

  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
        setError("Authentication failed. Please login again.");
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const res = await axios.post("/auth/register", userData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        setLoading(false);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setAuthLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    setAuthLoading(true);
    try {
      const res = await axios.post("/auth/login", userData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        setLoading(false);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setAuthLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
