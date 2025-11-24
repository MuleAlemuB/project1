// src/pages/deptHead/DeptHeadNotifications.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";
import { FaTrash, FaCheck, FaInfoCircle } from "react-icons/fa";

const DeptHeadNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});

  // Fetch notifications function
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user) fetchNotifications();
  }, [user, authLoading]);

  // Polling every 5 seconds for new notifications (including employee leave requests)
  useEffect(() => {
    if (!authLoading && user) {
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [user, authLoading]);

  const handleMarkSeen = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Error marking as seen:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (authLoading || loading)
    return (
      <div className={`p-6 text-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        {language === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );

  if (!user)
    return (
      <div className="p-6 text-center text-red-500">
        {language === "am" ? "መታወቂያ አልተሳካም" : "Not authorized"}
      </div>
    );

  const textClass = darkMode ? "text-gray-200" : "text-gray-800";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <h1 className={`text-3xl font-bold mb-6 ${textClass}`}>
        {language === "am" ? "ማሳወቂያዎች" : "Notifications"}
      </h1>

      {notifications.length === 0 ? (
        <p className={`${textClass}`}>{language === "am" ? "ምንም ማሳወቂያ የለም" : "No notifications"}</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl shadow flex flex-col gap-2 ${cardBg} ${
                n.seen ? "opacity-70 border-l-4 border-gray-400" : "border-l-4 border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className={`font-semibold ${textClass}`}>{n.title || n.type}</p>
                    <p className={`${textClass}`}>{n.message}</p>
                    <p className="text-sm text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!n.seen && (
                    <button
                      onClick={() => handleMarkSeen(n._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
                    >
                      <FaCheck /> {language === "am" ? "እትም አድርግ" : "Mark Seen"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1"
                  >
                    <FaTrash /> {language === "am" ? "አጥፋ" : "Delete"}
                  </button>
                  <button
                    onClick={() => setDetailsOpen((prev) => ({ ...prev, [n._id]: !prev[n._id] }))}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-1 mt-1"
                  >
                    <FaInfoCircle /> {language === "am" ? "ዝርዝር ተመልከት" : "View Details"}
                  </button>
                </div>
              </div>

              {/* Details Section */}
              {detailsOpen[n._id] && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 space-y-1">
                  {n.type && <p><span className="font-medium">Type:</span> {n.type}</p>}
                  {n.reference && <p><span className="font-medium">Requisition ID:</span> {n.reference}</p>}
                  {n.leaveRequestId && <p><span className="font-medium">LeaveRequest ID:</span> {n.leaveRequestId}</p>}
                  {n.employee && (
                    <>
                      <p><span className="font-medium">Employee:</span> {n.employee.name}</p>
                      <p><span className="font-medium">Email:</span> {n.employee.email}</p>
                    </>
                  )}
                  {n.applicant && (
                    <>
                      <p><span className="font-medium">Applicant:</span> {n.applicant.name}</p>
                      <p><span className="font-medium">Email:</span> {n.applicant.email}</p>
                      <p><span className="font-medium">Phone:</span> {n.applicant.phone}</p>
                    </>
                  )}
                  {n.vacancy && (
                    <>
                      <p><span className="font-medium">Vacancy:</span> {n.vacancy.title}</p>
                      <p><span className="font-medium">Department:</span> {n.vacancy.department}</p>
                    </>
                  )}
                  {n.department && <p><span className="font-medium">Department:</span> {n.department}</p>}
                  {n.status && <p><span className="font-medium">Status:</span> {n.status}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeptHeadNotifications;
