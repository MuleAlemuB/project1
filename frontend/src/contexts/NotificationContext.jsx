import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token"); // get token directly (safe fallback)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [systemMessage, setSystemMessage] = useState(null); // 👈 new system message state

  /** Fetch all notifications for logged-in user */
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axiosInstance.get("/notifications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || [];
      setNotifications(data);

      const unseen = data.filter((n) => !n.seen).length;
      setUnreadCount(unseen);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [token]);

  /** Mark a notification as seen */
  const markAsSeen = async (id) => {
    if (!token) return;

    try {
      await axiosInstance.put(`/notifications/${id}/seen`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as seen:", error);
    }
  };

  /** Show temporary dashboard system message */
  const showMessage = (msg, duration = 3000) => {
    setSystemMessage(msg);
    setTimeout(() => setSystemMessage(null), duration);
  };

  /** Fetch periodically */
  useEffect(() => {
    if (!user || !token) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, user, token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsSeen,
        showMessage, // 👈 use this to replace window.alert()
        systemMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
