// src/pages/admin/AdminNotifications.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaBell,
  FaTrash,
  FaCheck,
  FaInfoCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext"; // <-- import context

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------- helpers ----------
const fileUrl = (path) =>
  path ? `${API_BASE}/${path.replace(/\\/g, "/")}` : "#";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "-";

const calculateDays = (start, end) => {
  if (!start || !end) return "-";
  return (
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 3600 * 24)) + 1
  );
};

// ---------- Translations ----------
const translations = {
  en: {
    adminNotifications: "Admin Notifications",
    loading: "Loading notifications...",
    type: "Type",
    status: "Status",
    applicantInformation: "Applicant Information",
    name: "Name",
    email: "Email",
    phone: "Phone",
    appliedAt: "Applied At",
    downloadCV: "Download CV",
    leaveRequest: "Leave Request",
    employee: "Employee",
    start: "Start",
    end: "End",
    duration: "Duration",
    reason: "Reason",
    attachment: "Attachment",
    requisitionDetails: "Requisition Details",
    position: "Position",
    department: "Department",
    education: "Education",
    quantity: "Quantity",
    term: "Term",
    sex: "Sex",
    experience: "Experience",
    date: "Date",
    view: "View",
    seen: "Seen",
    delete: "Delete",
    accept: "Accept",
    reject: "Reject",
  },
  am: {
    adminNotifications: "አስተዳደር ማሳወቂያዎች",
    loading: "ማሳወቂያዎች እየጫኑ ነው...",
    type: "አይነት",
    status: "ሁኔታ",
    applicantInformation: "የማመልከቻ መረጃ",
    name: "ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    appliedAt: "በመተግበሪያ ቀን",
    downloadCV: "CV አውርድ",
    leaveRequest: "የተከለው ጉዳይ መረጃ",
    employee: "ሰራተኛ",
    start: "መጀመሪያ",
    end: "መጨረሻ",
    duration: "ቆይታ",
    reason: "ምክንያት",
    attachment: "አቀማመጥ",
    requisitionDetails: "የማስፈላጊ መረጃ",
    position: "ስራ ቦታ",
    department: "ክፍል",
    education: "ትምህርት",
    quantity: "ብዛት",
    term: "የሥራ ጊዜ",
    sex: "ፆታ",
    experience: "ልምድ",
    date: "ቀን",
    view: "እይ",
    seen: "ተመለከተ",
    delete: "አስወግድ",
    accept: "አረጋግጥ",
    reject: "አልተፈቀደም",
  },
};

const AdminNotifications = () => {
  const { language } = useSettings(); // get language from context
  const t = translations[language]; // current translation

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [requisitionDetails, setRequisitionDetails] = useState({});

  // ---------- Load notifications ----------
  useEffect(() => {
    const seenState = JSON.parse(localStorage.getItem("notifSeen") || "{}");
    const detailsState = JSON.parse(
      localStorage.getItem("notifDetails") || "{}"
    );
    setDetailsOpen(detailsState);

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications/my");
        const merged = res.data.map((n) => ({
          ...n,
          seen: seenState[n._id] ?? n.seen,
        }));
        setNotifications(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ---------- Persist seen ----------
  useEffect(() => {
    const s = {};
    notifications.forEach((n) => (s[n._id] = n.seen));
    localStorage.setItem("notifSeen", JSON.stringify(s));
  }, [notifications]);

  // ---------- Persist details ----------
  useEffect(() => {
    localStorage.setItem("notifDetails", JSON.stringify(detailsOpen));
  }, [detailsOpen]);

  const markAsSeen = async (id) => {
    await axiosInstance.put(`/notifications/${id}/seen`);
    setNotifications((p) =>
      p.map((n) => (n._id === id ? { ...n, seen: true } : n))
    );
  };

  const deleteNotification = async (id) => {
    await axiosInstance.delete(`/notifications/${id}`);
    setNotifications((p) => p.filter((n) => n._id !== id));
  };

  const handleLeaveDecision = async (notif, status) => {
    await axiosInstance.put(
      `/leaves/requests/${notif.leaveRequestId._id}/status`,
      { status }
    );
    setNotifications((p) =>
      p.map((n) => (n._id === notif._id ? { ...n, status } : n))
    );
  };

  const handleRequisitionDecision = async (notif, status) => {
    await axiosInstance.put(
      `/requisitions/${notif.reference}/status`,
      { status }
    );
    setNotifications((p) =>
      p.map((n) => (n._id === notif._id ? { ...n, status } : n))
    );
  };

  const handleDecision = (notif, status) => {
    if (notif.type === "Leave") handleLeaveDecision(notif, status);
    if (notif.type === "Requisition") handleRequisitionDecision(notif, status);
  };

  // ---------- Load requisition when opened ----------
  const toggleDetails = async (notif) => {
    setDetailsOpen((p) => ({ ...p, [notif._id]: !p[notif._id] }));

    if (
      notif.type === "Requisition" &&
      notif.reference &&
      !requisitionDetails[notif._id]
    ) {
      const res = await axiosInstance.get(`/requisitions/${notif.reference}`);
      setRequisitionDetails((p) => ({
        ...p,
        [notif._id]: res.data,
      }));
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-indigo-700 dark:text-indigo-300">
        {t.loading}
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black min-h-screen rounded-3xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
        <FaBell /> {t.adminNotifications}
      </h2>

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <motion.li
            key={notif._id}
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-2xl shadow border-l-4 ${
              notif.seen
                ? "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600"
                : "bg-indigo-100 dark:bg-indigo-900 border-indigo-500"
            }`}
          >
            {/* ---------- SUMMARY ---------- */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {notif.message}
              </p>
              <div className="flex gap-2">
                <button onClick={() => toggleDetails(notif)} className="btn blue">
                  <FaInfoCircle /> {t.view}
                </button>
                {!notif.seen && (
                  <button onClick={() => markAsSeen(notif._id)} className="btn green">
                    <FaCheck /> {t.seen}
                  </button>
                )}
                <button onClick={() => deleteNotification(notif._id)} className="btn red">
                  <FaTrash /> {t.delete}
                </button>
              </div>
            </div>

            {/* ---------- DETAILS ---------- */}
            {detailsOpen[notif._id] && (
              <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4 space-y-3 text-gray-900 dark:text-gray-100">
                <p>
                  <b>{t.type}:</b> {notif.type}
                </p>

                {notif.type !== "Vacancy Application" && (
                  <p>
                    <b>{t.status}:</b> {notif.status}
                  </p>
                )}

                {/* ===== JOB APPLICATION ===== */}
                {notif.type === "Vacancy Application" && (
                  <>
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {t.applicantInformation}
                    </h4>
                    <p>
                      {t.name}: {notif.applicant?.name ?? "-"}
                    </p>
                    <p>
                      {t.email}: {notif.applicant?.email ?? "-"}
                    </p>
                    <p>
                      {t.phone}: {notif.applicant?.phone ?? "-"}
                    </p>
                    <p>
                      {t.appliedAt}: {formatDate(notif.createdAt)}
                    </p>

                    {(notif.applicant?.resume ||
                      notif.applicant?.cv ||
                      notif.application?.cv ||
                      notif.resume) && (
                      <a
                        href={fileUrl(
                          notif.applicant?.resume ||
                            notif.applicant?.cv ||
                            notif.application?.cv ||
                            notif.resume
                        )}
                        download
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                      >
                        <FaDownload /> {t.downloadCV}
                      </a>
                    )}
                  </>
                )}

                {/* ===== LEAVE REQUEST ===== */}
                {notif.type === "Leave" && notif.leaveRequestId && (
                  <>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">
                      {t.leaveRequest}
                    </h4>
                    <p>
                      {t.employee}: {notif.leaveRequestId.employeeName}
                    </p>
                    <p>
                      {t.start}: {formatDate(notif.leaveRequestId.startDate)}
                    </p>
                    <p>
                      {t.end}: {formatDate(notif.leaveRequestId.endDate)}
                    </p>
                    <p>
                      {t.duration}:{" "}
                      {calculateDays(
                        notif.leaveRequestId.startDate,
                        notif.leaveRequestId.endDate
                      )}{" "}
                      {t.duration}
                    </p>
                    <p>
                      {t.reason}: {notif.leaveRequestId.reason}
                    </p>

                    {notif.leaveRequestId.attachments?.map((f, i) => (
                      <a
                        key={i}
                        href={fileUrl(f)}
                        download
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                      >
                        <FaDownload /> {t.attachment} {i + 1}
                      </a>
                    ))}
                  </>
                )}

                {/* ===== REQUISITION ===== */}
                {notif.type === "Requisition" &&
                  requisitionDetails[notif._id] && (
                    <>
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400">
                        {t.requisitionDetails}
                      </h4>

                      <p>
                        {t.position}: {requisitionDetails[notif._id].position}
                      </p>
                      <p>
                        {t.department}: {requisitionDetails[notif._id].department}
                      </p>
                      <p>
                        {t.education}: {requisitionDetails[notif._id].educationalLevel}
                      </p>
                      <p>
                        {t.quantity}: {requisitionDetails[notif._id].quantity}
                      </p>
                      <p>
                        {t.term}: {requisitionDetails[notif._id].termOfEmployment}
                      </p>
                      <p>
                        {t.sex}: {requisitionDetails[notif._id].sex}
                      </p>
                      <p>
                        {t.experience}: {requisitionDetails[notif._id].experience}
                      </p>
                      <p>
                        {t.date}: {formatDate(requisitionDetails[notif._id].date)}
                      </p>

                      {requisitionDetails[notif._id].attachments?.map((f, i) => (
                        <a
                          key={i}
                          href={fileUrl(f)}
                          download
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                        >
                          <FaDownload /> {t.attachment} {i + 1}
                        </a>
                      ))}
                    </>
                  )}

                {/* ===== ACTIONS ===== */}
                {(notif.type === "Leave" || notif.type === "Requisition") &&
                  notif.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleDecision(notif, "approved")}
                        className="btn green"
                      >
                        <FaThumbsUp /> {t.accept}
                      </button>
                      <button
                        onClick={() => handleDecision(notif, "rejected")}
                        className="btn red"
                      >
                        <FaThumbsDown /> {t.reject}
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
