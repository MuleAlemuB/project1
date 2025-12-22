// src/pages/admin/WorkExperienceManagement.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WorkExperienceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/work-experience");
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch work experience requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Reject request directly
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await axiosInstance.put(`/work-experience/${id}/reject`, { reason });
      toast.success("Request rejected successfully");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Work Experience Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No requests found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="border px-2 py-1">Employee</th>
              <th className="border px-2 py-1">Department</th>
              <th className="border px-2 py-1">Reason</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border px-2 py-1">
                  {req.employee?.firstname} {req.employee?.lastname}
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {req.employee?.email}
                  </span>
                </td>
                <td className="border px-2 py-1">{req.department}</td>
                <td className="border px-2 py-1">{req.reason}</td>
                <td className="border px-2 py-1">{req.status}</td>
                <td className="border px-2 py-1 space-x-2">
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => navigate(`/admin/work-experience/${req._id}`)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                      >
                        Approve / View
                      </button>
                    </>
                  )}

                  {req.status === "Approved" && (
                    <a
                      href={req.generatedLetterLink || req.letterFile}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      Download Letter
                    </a>
                  )}

                  {req.status === "Rejected" && (
                    <span className="text-red-500 text-xs">{req.adminDecisionReason}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkExperienceManagement;
