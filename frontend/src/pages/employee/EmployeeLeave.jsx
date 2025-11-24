// src/pages/employee/EmployeeLeave.jsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const EmployeeLeave = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate, reason } = formData;
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill in all fields!");
      return;
    }

    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    data.append("reason", reason);

    attachments.forEach((file) => {
      data.append("attachments", file);
    });

    try {
      setLoading(true);
      const res = await axiosInstance.post("/employee-leave/request", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      // Reset form
      setFormData({ startDate: "", endDate: "", reason: "" });
      setAttachments([]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">Submit Leave Request</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Start Date:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          End Date:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="flex flex-col">
          Reason:
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            placeholder="Enter reason for leave"
            required
          />
        </label>

        <label className="flex flex-col">
          Attachments (optional):
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 w-full"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeLeave;
