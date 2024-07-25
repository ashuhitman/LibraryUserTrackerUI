// authContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user token on component mount
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/me"); // Replace with your endpoint
        setUser(response.data);
      } catch (error) {
        console.error("Authentication error", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setUser(response.data.user);
      // Store token if applicable
      localStorage.setItem("authToken", response.data.token);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
