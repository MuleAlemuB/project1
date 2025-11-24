import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for multi-role tokens and users
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentRole, setCurrentRole] = useState(localStorage.getItem("currentRole") || null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token
  useEffect(() => {
    const initUser = async () => {
      if (!token || !currentRole) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        setUser(null);
        setToken(null);
        setCurrentRole(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("currentRole");
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [token, currentRole]);

  // Login function supporting multiple roles
  const loginUser = async (email, password, role) => {
    try {
      const res = await axios.post("/auth/login", { email, password, role });

      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      setCurrentRole(role);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("currentRole", role);
      localStorage.setItem("name", userData.name);

      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      throw new Error(message);
    }
  };

  // Logout function for current role only
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setCurrentRole(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currentRole");
    localStorage.removeItem("name");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        currentRole,
        setCurrentRole,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
