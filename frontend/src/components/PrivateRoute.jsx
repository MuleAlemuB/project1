// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ role }) => {
  const { user, loading, token, verifySession } = useAuth();
  const location = useLocation();
  const [sessionValid, setSessionValid] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Check if this is a new tab without sessionStorage flag
      if (!sessionStorage.getItem("authenticated")) {
        setCheckingSession(false);
        return;
      }

      // Verify with server
      if (token) {
        const isValid = await verifySession();
        setSessionValid(isValid);
      }
      
      setCheckingSession(false);
    };

    checkSession();
  }, [token, verifySession]);

  if (loading || checkingSession) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Check sessionStorage flag first (prevents new tab access)
  if (!sessionStorage.getItem("authenticated")) {
    // Store attempted URL for redirect after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || !sessionValid) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;