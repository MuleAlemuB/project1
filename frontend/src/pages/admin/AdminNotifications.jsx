// src/pages/admin/AdminNotifications.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaBell, FaTrash, FaCheck, FaInfoCircle, FaThumbsUp, FaThumbsDown, FaFile } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});

  // Load persisted states from localStorage
  useEffect(() => {
    const seenState = JSON.parse(localStorage.getItem("notifSeen") || "{}");
    const detailsState = JSON.parse(localStorage.getItem("notifDetails") || "{}");
    setDetailsOpen(detailsState);

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications/my");
        // Merge persisted 'seen' state
        const merged = res.data.map((n) => ({
          ...n,
          seen: seenState[n._id] !== undefined ? seenState[n._id] : n.seen,
        }));
        setNotifications(merged);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Persist seen state whenever notifications change
  useEffect(() => {
    const seenState = {};
    notifications.forEach((n) => {
      seenState[n._id] = n.seen;
    });
    localStorage.setItem("notifSeen", JSON.stringify(seenState));
  }, [notifications]);

  // Persist detailsOpen state whenever it changes
  useEffect(() => {
    localStorage.setItem("notifDetails", JSON.stringify(detailsOpen));
  }, [detailsOpen]);

  // Mark notification as seen
  const markAsSeen = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as seen:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Handle leave request decision
  const handleLeaveDecision = async (notif, status) => {
    if (!notif.leaveRequestId) {
      console.error("LeaveRequest ID missing");
      return;
    }
    try {
      await axiosInstance.put(`/leaves/requests/${notif.leaveRequestId}/status`, { status });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, status } : n))
      );
    } catch (err) {
      console.error(`Failed to ${status} leave:`, err);
    }
  };

  // Handle requisition request decision
  const handleRequisitionDecision = async (notif, status) => {
    if (!notif.reference) {
      console.error("Requisition ID missing");
      return;
    }
    try {
      await axiosInstance.put(`/requisitions/${notif.reference}/status`, { status });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, status } : n))
      );
    } catch (err) {
      console.error(`Failed to ${status} requisition:`, err);
    }
  };

  const handleDecision = (notif, status) => {
    if (notif.type === "Leave") {
      handleLeaveDecision(notif, status);
    } else if (notif.type === "Requisition") {
      handleRequisitionDecision(notif, status);
    }
  };

  if (loading) return <p className="p-6 text-center text-indigo-700 font-semibold">Loading notifications...</p>;
  if (!notifications.length) return <p className="p-6 text-center text-gray-500 font-semibold">No notifications yet</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen rounded-3xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        <FaBell /> Admin Notifications
      </h2>

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <motion.li
            key={notif._id}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-5 rounded-2xl shadow-lg flex flex-col border-l-4 ${notif.seen ? "bg-gray-100 border-gray-400" : "bg-indigo-100 border-indigo-500"}`}
          >
            {/* Summary */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800 text-lg">{notif.message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDetailsOpen((prev) => {
                    const newState = { ...prev, [notif._id]: !prev[notif._id] };
                    localStorage.setItem("notifDetails", JSON.stringify(newState));
                    return newState;
                  })}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  <FaInfoCircle /> View
                </button>
                {!notif.seen && (
                  <button
                    onClick={() => markAsSeen(notif._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
                  >
                    <FaCheck /> Mark Seen
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>

            {/* Details */}
            {detailsOpen[notif._id] && (
              <div className="mt-4 p-4 bg-white rounded-xl shadow-inner space-y-2 border border-gray-200">
                <p><span className="font-medium">Type:</span> {notif.type}</p>
                {notif.type === "Leave" && notif.leaveRequestId && (
                  <p><span className="font-medium">LeaveRequest ID:</span> {notif.leaveRequestId}</p>
                )}
                {notif.type === "Requisition" && notif.reference && (
                  <p><span className="font-medium">Requisition ID:</span> {notif.reference}</p>
                )}
                {notif.employee && (
                  <>
                    <p><span className="font-medium">Employee:</span> {notif.employee.name}</p>
                    <p><span className="font-medium">Email:</span> {notif.employee.email}</p>
                  </>
                )}
                {notif.applicant && (
                  <>
                    <p><span className="font-medium">Applicant:</span> {notif.applicant.name}</p>
                    <p><span className="font-medium">Email:</span> {notif.applicant.email}</p>
                    <p><span className="font-medium">Phone:</span> {notif.applicant.phone}</p>
                  </>
                )}
                {notif.vacancy && (
                  <>
                    <p><span className="font-medium">Vacancy:</span> {notif.vacancy.title}</p>
                    <p><span className="font-medium">Department:</span> {notif.vacancy.department}</p>
                  </>
                )}
                {notif.department && <p><span className="font-medium">Department:</span> {notif.department}</p>}
                {notif.status && <p><span className="font-medium">Status:</span> {notif.status}</p>}

                {(notif.status === "pending" && (notif.type === "Leave" || notif.type === "Requisition")) && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleDecision(notif, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-1"
                    >
                      <FaThumbsUp /> Accept
                    </button>
                    <button
                      onClick={() => handleDecision(notif, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-1"
                    >
                      <FaThumbsDown /> Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;
