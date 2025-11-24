// src/pages/admin/AdminLeaveRequests.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch leave requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/leave-requests");
        setRequests(data);
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setErrorMsg(err.response?.data?.message || "Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Update leave request status
  const handleUpdate = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setMessage({ text: "", type: "" });

    // Optimistic update
    const originalRequests = [...requests];
    setRequests(requests.map(r => r._id === id ? { ...r, status } : r));

    try {
      await axiosInstance.put(`/admin/leave-requests/${id}`, { status });
      setMessage({
        text: `Leave request has been ${status}`,
        type: status === "approved" ? "success" : "error",
      });
    } catch (err) {
      console.error("Error updating leave request:", err);
      setRequests(originalRequests); // revert on failure
      setMessage({ text: "Failed to update leave request", type: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading leave requests...</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Leave Requests</h2>

      {errorMsg && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errorMsg}</p>}

      {message.text && (
        <p
          className={`mb-4 p-2 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">From</th>
                <th className="py-2 px-4 text-left">To</th>
                <th className="py-2 px-4 text-left">Reason</th>
                <th className="py-2 px-4 text-left">Attachments</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-2 px-4">
                    {r.employee
                      ? `${r.employee.firstName || ""} ${r.employee.lastName || ""}`.trim()
                      : "-"}
                  </td>
                  <td className="py-2 px-4">{r.from ? new Date(r.from).toLocaleDateString() : "-"}</td>
                  <td className="py-2 px-4">{r.to ? new Date(r.to).toLocaleDateString() : "-"}</td>
                  <td className="py-2 px-4">{r.reason || "-"}</td>
                  <td className="py-2 px-4">
                    {r.attachments && r.attachments.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {r.attachments.map((f, idx) => (
                          <li key={idx}>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {f.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No attachments"
                    )}
                  </td>
                  <td className="py-2 px-4 capitalize">{r.status}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    {r.status === "pending" ? (
                      <>
                        <button
                          disabled={actionLoading[r._id]}
                          onClick={() => handleUpdate(r._id, "approved")}
                          className={`px-3 py-1 rounded text-white ${
                            actionLoading[r._id] ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionLoading[r._id]}
                          onClick={() => handleUpdate(r._id, "rejected")}
                          className={`px-3 py-1 rounded text-white ${
                            actionLoading[r._id] ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded ${
                          r.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
