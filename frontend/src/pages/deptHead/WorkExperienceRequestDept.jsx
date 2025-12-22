import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const WorkExperienceRequest = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  // Fetch previous requests
  const fetchRequests = async () => {
    try {
      const { data } = await axiosInstance.get("/work-experience");
      const filtered = data.filter((r) => r.employee._id === user._id);
      setRequests(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Submit new request
  const submitRequest = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error("Enter reason");

    setLoading(true);
    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("department", user.department);
    formData.append("roleSubmitted", "DepartmentHead");
    if (file) formData.append("requestAttachment", file);

    try {
      await axiosInstance.post("/work-experience", formData);
      toast.success("Request submitted!");
      setReason("");
      setFile(null);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit request");
    }
    setLoading(false);
  };

  // Delete pending request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axiosInstance.delete(`/work-experience/${id}`);
      toast.success("Request deleted");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-4">Work Experience Request</h1>

      {/* Submit Form */}
      <form onSubmit={submitRequest} className="space-y-4 mb-6">
        <input
          type="text"
          value={user.firstname + " " + user.lastname}
          disabled
          className="border p-2 w-full"
        />

        <input
          type="text"
          value={user.department}
          disabled
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Reason"
          className="border p-2 w-full"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.docx"
          className="border p-2 w-full"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {/* Previous Requests */}
      <h2 className="text-lg font-semibold mb-2">My Previous Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No previous requests.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Reason</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Letter</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{req.reason}</td>
                <td className="border px-2 py-1">{req.status}</td>
                <td className="border px-2 py-1">
                  {req.status === "Approved" ? (
                    <>
                      {req.letterFile && (
                        <a
                          href={`http://localhost:5000/${req.letterFile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download Letter
                        </a>
                      )}
                      {req.generatedLetterLink && (
                        <a
                          href={req.generatedLetterLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 underline ml-2"
                        >
                          Open Generated Letter
                        </a>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border px-2 py-1">
                  {req.status === "Pending" && (
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
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

export default WorkExperienceRequest;
