import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("adminToken"); // or "token" depending on your auth
      try {
        const res = await axios.get("http://localhost:5000/api/admin/leave-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch leave requests", err);
        setError("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/leave-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error("Failed to update leave request", err);
      alert("Failed to update request");
    }
  };

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading leave requests...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Leave Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">From</th>
                <th className="border px-4 py-2 text-left">To</th>
                <th className="border px-4 py-2 text-left">Reason</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-100 transition">
                  <td className="border px-4 py-2">{r.employee?.firstName} {r.employee?.lastName}</td>
                  <td className="border px-4 py-2">{new Date(r.from).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(r.to).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{r.reason}</td>
                  <td className={`border px-4 py-2 font-semibold ${
                    r.status === "approved" ? "text-green-600" :
                    r.status === "rejected" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {r.status}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {r.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleUpdate(r._id, "approved")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdate(r._id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">-</span>
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

export default LeaveRequests;
