// src/pages/deptHead/DeptHeadLeaveRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaInfoCircle,
  FaList,
} from "react-icons/fa";

const DeptHeadLeaveRequests = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();

  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("employee"); // "employee" or "myLeave"
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [showAll, setShowAll] = useState(false);

  // Fetch leave requests
  const fetchRequests = async () => {
    try {
      const [inboxRes, myRes] = await Promise.all([
        axios.get("/leaves/inbox"),
        axios.get("/leaves/my"),
      ]);
      setEmployeeLeaves(inboxRes.data || []);
      setMyLeaves(myRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchRequests();
  }, [user, authLoading]);

  // Approve / Reject
  const handleDecision = async (id, status) => {
    try {
      await axios.put(`/leaves/requests/${id}/status`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete leave request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`/leaves/requests/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to delete leave request");
    }
  };

  // Apply new leave
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("reason", reason);
    attachments.forEach((f) => formData.append("attachments", f));

    try {
      const res = await axios.post("/leaves/requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "Leave request submitted successfully");
      setShowApplyForm(false);
      setStartDate("");
      setEndDate("");
      setReason("");
      setAttachments([]);
      fetchRequests();
      setActiveTab("myLeave"); // Switch to my leave tab after applying
    } catch (err) {
      console.error(err);
      alert("Failed to submit leave request");
    }
  };

  if (authLoading || loading) return <div>Loading...</div>;
  if (!user) return <div>Not authorized</div>;

  // Filter employee leaves by pending or all
  const filteredEmployeeLeaves = showAll
    ? employeeLeaves
    : employeeLeaves.filter((r) => r.status === "pending");

  // Toggle Show All / Pending Only
  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
    setDetailsOpen({}); // collapse details when toggling
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">
        {language === "am" ? "የቅድመ ፈቃድ አስተዳደር" : "Leave Management"}
      </h1>

      {/* Top buttons */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("employee");
            setShowApplyForm(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
            activeTab === "employee"
              ? "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <FaEye /> {language === "am" ? "ሰራተኞች ጥያቄዎች" : "Employee Requests"}
        </button>

        <button
          onClick={() => {
            setActiveTab("myLeave");
            setShowApplyForm(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
            activeTab === "myLeave"
              ? "bg-green-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <FaPlus /> {language === "am" ? "የእኔ ፈቃድ ጥያቄዎች" : "My Leave Requests"}
        </button>

        {activeTab === "employee" && (
          <button
            onClick={handleToggleShowAll}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
              showAll
                ? "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <FaList />{" "}
            {showAll
              ? language === "am"
                ? "ቅድመ ፈቃድ ብቻ ይሳዩ"
                : "Show Pending Only"
              : language === "am"
              ? "ሁሉንም ይሳዩ"
              : "Show All"}
          </button>
        )}
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <form onSubmit={handleApplySubmit} className="mb-6 p-4 rounded bg-gray-800 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded text-gray-800"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded text-gray-800"
            />
            <textarea
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="p-2 rounded text-gray-800"
            />
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files))}
              className="p-2 rounded text-gray-800"
            />
          </div>
          <button type="submit" className="mt-3 bg-green-600 px-4 py-2 rounded text-white">
            Submit
          </button>
        </form>
      )}

      {/* Employee Requests Table */}
      {activeTab === "employee" && (
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600 mb-6">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployeeLeaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No leave requests
                </td>
              </tr>
            ) : (
              filteredEmployeeLeaves.map((r) => (
                <React.Fragment key={r._id}>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <td className="px-3 py-2">{r.requesterName}</td>
                    <td className="px-3 py-2">{new Date(r.startDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{new Date(r.endDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{r.reason}</td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        onClick={() =>
                          setDetailsOpen((prev) => ({ ...prev, [r._id]: !prev[r._id] }))
                        }
                        className="bg-blue-500 p-2 rounded text-white flex items-center gap-1"
                      >
                        <FaInfoCircle /> {language === "am" ? "ዝርዝር" : "Details"}
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-gray-500 p-2 rounded text-white"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>

                  {/* Details Row */}
                  {detailsOpen[r._id] && (
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <td colSpan="6" className="p-4">
                        <div className="space-y-2">
                          <p>
                            <span className="font-semibold">Employee:</span> {r.requesterName}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span> {r.requesterEmail}
                          </p>
                          <p>
                            <span className="font-semibold">Department:</span> {r.department}
                          </p>
                          <p>
                            <span className="font-semibold">Start Date:</span>{" "}
                            {new Date(r.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-semibold">End Date:</span>{" "}
                            {new Date(r.endDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-semibold">Reason:</span> {r.reason}
                          </p>
                          <p>
                            <span className="font-semibold">Status:</span> {r.status}
                          </p>

                          {r.attachments && r.attachments.length > 0 && (
                            <div>
                              <span className="font-semibold">Attachments:</span>
                              <ul className="list-disc list-inside">
                                {r.attachments.map((file, i) => (
                                  <li key={i}>
                                    <a
                                      href={`/uploads/${file}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      {file}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {r.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleDecision(r._id, "approved")}
                                className="bg-green-500 p-2 rounded text-white flex items-center gap-1"
                              >
                                <FaCheck /> {language === "am" ? "ይፀድቁ" : "Approve"}
                              </button>
                              <button
                                onClick={() => handleDecision(r._id, "rejected")}
                                className="bg-red-500 p-2 rounded text-white flex items-center gap-1"
                              >
                                <FaTimes /> {language === "am" ? "ይክሰሱ" : "Reject"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* My Leave Requests Table */}
      {activeTab === "myLeave" && (
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No leave requests
                </td>
              </tr>
            ) : (
              myLeaves.map((r) => (
                <tr key={r._id} className="border-b border-gray-300 dark:border-gray-600">
                  <td className="px-3 py-2">{new Date(r.startDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(r.endDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{r.reason}</td>
                  <td className="px-3 py-2 capitalize">{r.status}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="bg-gray-500 p-2 rounded text-white"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeptHeadLeaveRequests;
