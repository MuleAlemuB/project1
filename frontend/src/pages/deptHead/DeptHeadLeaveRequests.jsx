// src/pages/deptHead/DeptHeadLeaveRequests.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axios from "../../utils/axiosInstance";
import { FaDownload, FaCheck, FaTimes, FaEye, FaPlus } from "react-icons/fa";

const DeptHeadLeaveRequests = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Fetch leave requests
  const fetchRequests = async () => {
    try {
      // Employee requests for this DeptHead's department
      const res = await axios.get("/leaves/depthead"); 
      setRequests(res.data);

      // DeptHead's own requests
      const myRes = await axios.get("/leaves/requests"); 
      setMyRequests(myRes.data);
    } catch (err) {
      console.error("Fetch requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchRequests();
  }, [user, authLoading]);

  // Approve or reject employee request
  const handleDecision = async (id, status) => {
    if (!window.confirm(`${language === "am" ? `${status === "approved" ? "ማረጋገጫ" : "እንቁላል"} ይፈልጋሉ?` : `Are you sure you want to ${status}?`}`)) return;
    try {
      const res = await axios.put(`/leaves/depthead/${id}/status`, { status });
      alert(res.data.message);
      fetchRequests();
    } catch (err) {
      console.error("Decision error:", err);
      alert(language === "am" ? "ማሻሻያ አልተሳካም።" : "Failed to update leave request");
    }
  };

  // Apply for leave (DeptHead)
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert(language === "am" ? "ሁሉንም መስፈርቶች ማስገባት አለብዎት።" : "All fields are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("reason", reason);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post("/leaves/requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      setShowApplyForm(false);
      setStartDate("");
      setEndDate("");
      setReason("");
      setAttachments([]);
      fetchRequests();
    } catch (err) {
      console.error("Apply leave error:", err);
      alert(language === "am" ? "የቅድመ ፈቃድ ማስገባት አልተሳካም።" : "Failed to submit leave request");
    }
  };

  if (authLoading || loading)
    return <div className={`p-6 text-center ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{language === "am" ? "በመጫን ላይ..." : "Loading..."}</div>;

  if (!user) return <div className="p-6 text-center text-red-500">{language === "am" ? "መታወቂያ አልተሳካም" : "Not authorized"}</div>;

  const textClass = darkMode ? "text-gray-200" : "text-gray-800";
  const tableBg = darkMode ? "bg-gray-800" : "bg-white";
  const tableHeaderBg = darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700";

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${textClass}`}>
          {language === "am" ? "የተጠቃሚዎች የቅድመ ፈቃድ ጥያቄዎች" : "Employee Leave Requests"}
        </h1>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            onClick={() => setShowApplyForm(!showApplyForm)}
          >
            <FaPlus /> {language === "am" ? "የእኔን ፈቃድ መላክ" : "Apply for Leave"}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            onClick={() => setShowMyRequests(!showMyRequests)}
          >
            <FaEye /> {language === "am" ? "የእኔ የቅድመ ፈቃድ ጥያቄዎች" : "My Leave Requests"}
          </button>
        </div>
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <form onSubmit={handleApplySubmit} className={`mb-6 p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>{language === "am" ? "የእኔን ፈቃድ መላክ" : "Apply for Leave"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-semibold ${textClass}`}>{language === "am" ? "መጀመሪያ ቀን" : "Start Date"}</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`block font-semibold ${textClass}`}>{language === "am" ? "መጨረሻ ቀን" : "End Date"}</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block font-semibold ${textClass}`}>{language === "am" ? "ምክንያት" : "Reason"}</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3" className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block font-semibold ${textClass}`}>{language === "am" ? "አባሪ ፋይሎች" : "Attachments"}</label>
              <input type="file" multiple onChange={(e) => setAttachments(Array.from(e.target.files))} className="mt-1" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">{language === "am" ? "አስገባ" : "Submit"}</button>
            <button type="button" className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition" onClick={() => setShowApplyForm(false)}>{language === "am" ? "አውጣ" : "Cancel"}</button>
          </div>
        </form>
      )}

      {/* My Requests Table (DeptHead) */}
      {showMyRequests && (
        <div className={`overflow-x-auto shadow rounded-xl border mb-6 ${darkMode ? "border-gray-700" : "border-gray-200"} ${tableBg}`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={tableHeaderBg}>
              <tr>
                <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "መጀመሪያ ቀን" : "Start Date"}</th>
                <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "መጨረሻ ቀን" : "End Date"}</th>
                <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "ምክንያት" : "Reason"}</th>
                <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "ሁኔታ" : "Status"}</th>
                <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "እርምጃ" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
              {myRequests.length > 0 ? (
                myRequests.map((r) => (
                  <tr key={r._id} className={`hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition cursor-pointer`}>
                    <td className={`px-6 py-4 ${textClass}`}>{new Date(r.startDate).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 ${textClass}`}>{new Date(r.endDate).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 ${textClass}`}>{r.reason}</td>
                    <td className={`px-6 py-4 ${textClass}`}>{r.status}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition" onClick={() => setSelectedRequest(r)}>
                        <FaEye /> {language === "am" ? "ዝርዝር" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{language === "am" ? "ምንም የቅድመ ፈቃድ ጥያቄዎች የሉም" : "No leave requests submitted"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Requests Table (DeptHead) */}
      <div className={`overflow-x-auto shadow rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} ${tableBg}`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={tableHeaderBg}>
            <tr>
              <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "ሰራተኛ" : "Employee"}</th>
              <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "መጀመሪያ ቀን" : "Start Date"}</th>
              <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "መጨረሻ ቀን" : "End Date"}</th>
              <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "ሁኔታ" : "Status"}</th>
              <th className="px-6 py-3 text-left text-lg font-medium">{language === "am" ? "እርምጃ" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
            {requests.length > 0 ? (
              requests.map((r) => (
                <tr key={r._id} className={`hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition cursor-pointer`}>
                  <td className={`px-6 py-4 font-medium ${textClass}`}>{r.employeeName}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{new Date(r.startDate).toLocaleDateString()}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{new Date(r.endDate).toLocaleDateString()}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{r.status}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition" onClick={() => setSelectedRequest(r)}>
                      <FaEye /> {language === "am" ? "ዝርዝር" : "View"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition" onClick={() => handleDecision(r._id, "approved")}>
                      <FaCheck /> {language === "am" ? "ማረጋገጫ" : "Approve"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition" onClick={() => handleDecision(r._id, "rejected")}>
                      <FaTimes /> {language === "am" ? "እንቁላል" : "Reject"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {language === "am" ? "ምንም የቅድመ ፈቃድ ጥያቄዎች የሉም" : "No leave requests"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Selected Request */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto`}>
            <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>{language === "am" ? "የቅድመ ፈቃድ ዝርዝር" : "Leave Request Details"}</h2>
            <p><strong>{language === "am" ? "ሰራተኛ:" : "Employee:"}</strong> {selectedRequest.employeeName}</p>
            <p><strong>{language === "am" ? "መጀመሪያ ቀን:" : "Start Date:"}</strong> {new Date(selectedRequest.startDate).toLocaleDateString()}</p>
            <p><strong>{language === "am" ? "መጨረሻ ቀን:" : "End Date:"}</strong> {new Date(selectedRequest.endDate).toLocaleDateString()}</p>
            <p><strong>{language === "am" ? "ምክንያት:" : "Reason:"}</strong> {selectedRequest.reason}</p>
            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div>
                <strong>{language === "am" ? "አባሪ ፋይሎች:" : "Attachments:"}</strong>
                <ul className="list-disc ml-6">
                  {selectedRequest.attachments.map((file, idx) => (
                    <li key={idx}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                        <FaDownload /> {file.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex gap-3 justify-end">
              <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded" onClick={() => setSelectedRequest(null)}>
                {language === "am" ? "ዝጋ" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadLeaveRequests;
