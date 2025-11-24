// src/pages/employee/EmployeeNotifications.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications for logged-in employee
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/my"); // employee-specific notifications
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  // Mark a notification as seen
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Initial fetch + polling every 5 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // fetch new notifications
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <FaBell /> Notifications
      </h1>

      {notifications.length === 0 && <p className="text-gray-600 dark:text-gray-300">No notifications yet.</p>}

      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-4 rounded shadow flex flex-col gap-1 ${
              n.seen ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700 border-l-4 border-blue-500"
            }`}
          >
            {/* Display message */}
            <p className="font-medium text-gray-800 dark:text-gray-200">{n.message}</p>

            {/* Show leave request status icon if applicable */}
            {n.leaveRequestStatus && (
              <div className="flex items-center gap-2 mt-1">
                {n.leaveRequestStatus === "approved" && (
                  <span className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-1" /> Leave Approved
                  </span>
                )}
                {n.leaveRequestStatus === "rejected" && (
                  <span className="flex items-center text-red-600">
                    <FaTimesCircle className="mr-1" /> Leave Rejected
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>

            {/* Mark as read button */}
            {!n.seen && (
              <button
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline self-start"
                onClick={() => markAsRead(n._id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeNotifications;
