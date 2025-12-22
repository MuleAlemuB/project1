import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const WorkExperienceRequest = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("department", user.department);
    formData.append("roleSubmitted", "Employee");
    if (file) formData.append("requestAttachment", file);

    try {
      await axiosInstance.post("/api/work-experience", formData);
      alert("Request submitted!");
      setReason("");
      setFile(null);
    } catch (error) {
      alert("Failed to submit");
    }

    setLoading(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold">Work Experience Request</h1>

      <form onSubmit={submitRequest} className="space-y-4 mt-4">
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
    </div>
  );
};

export default WorkExperienceRequest;
