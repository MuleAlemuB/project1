// src/pages/admin/WorkExperienceDetail.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WorkExperienceDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequest = async () => {
    try {
      const { data } = await axiosInstance.get(`/work-experience/${id}`);
      if (data.success) {
        setRequest(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch request details");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const rejectRequest = async () => {
    if (!rejectReason) return toast.error("Enter rejection reason");
    
    try {
      setLoading(true);
      await axiosInstance.put(`/work-experience/${id}/status`, {
        status: "rejected",
        adminReason: rejectReason
      });
      toast.success("Request rejected successfully");
      navigate("/admin/work-experience");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(`/work-experience/${id}/status`, {
        status: "approved",
        adminReason: ""
      });
      toast.success("Request approved successfully");
      fetchRequest(); // Refresh to show new status
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  const uploadLetter = async () => {
    if (!file) return toast.error("Select a PDF file to upload");
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", file);
      
      await axiosInstance.post(`/work-experience/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Letter uploaded successfully");
      fetchRequest(); // Refresh to show new status and download link
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload letter");
    } finally {
      setLoading(false);
    }
  };

  const generateLetter = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(`/work-experience/${id}/generate`);
      toast.success(data.data?.message || "Letter generated successfully");
      fetchRequest(); // Refresh to show new status and download link
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate letter");
    } finally {
      setLoading(false);
    }
  };

  if (!request) return <p className="p-5">Loading request details...</p>;

  // Get employee name from requester or fullName field
  const employeeName = request.requester?.name || request.fullName || "N/A";
  const employeeEmail = request.requester?.email || "N/A";
  const employeeId = request.requester?.employeeId || request.requester?.empId || "N/A";

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Work Experience Request Details</h2>
        <button
          onClick={() => navigate("/admin/work-experience")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Employee Information */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Employee Information</h3>
          <div className="space-y-3">
            <p><span className="font-medium">Name:</span> {employeeName}</p>
            <p><span className="font-medium">Email:</span> {employeeEmail}</p>
            <p><span className="font-medium">Employee ID:</span> {employeeId}</p>
            <p><span className="font-medium">Department:</span> {request.department || "N/A"}</p>
            <p><span className="font-medium">Requested Role:</span> {request.requesterRole || "Employee"}</p>
          </div>
        </div>

        {/* Request Information */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Request Information</h3>
          <div className="space-y-3">
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                request.status === "approved" ? "bg-green-100 text-green-800" :
                request.status === "rejected" ? "bg-red-100 text-red-800" :
                request.status === "completed" ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
              </span>
            </p>
            <p><span className="font-medium">Request Date:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleDateString()}</p>
            {request.reviewedBy && (
              <p><span className="font-medium">Reviewed By:</span> {request.reviewedBy?.name || "N/A"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reason for Request */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Reason for Request</h3>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{request.reason}</p>
        </div>
      </div>

      {/* Admin Remarks */}
      {request.adminReason && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Admin Remarks</h3>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-300 whitespace-pre-wrap">{request.adminReason}</p>
          </div>
        </div>
      )}

      {/* Letter Download (if available) */}
      {request.letterPdf?.url && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Generated Letter</h3>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-300">Letter available for download</p>
                {request.letterGeneratedDate && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    Generated on: {new Date(request.letterGeneratedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <a
                href={`http://localhost:5000${request.letterPdf.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons based on status */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        {request.status === "pending" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={approveRequest}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Approving..." : "Approve Request"}
              </button>
              
              <div className="flex-1">
                <textarea
                  placeholder="Reason for rejection (required)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  rows="3"
                />
                <button
                  onClick={rejectRequest}
                  disabled={loading || !rejectReason.trim()}
                  className="mt-2 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Rejecting..." : "Reject Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        {request.status === "approved" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload PDF Letter
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                  />
                  <button
                    onClick={uploadLetter}
                    disabled={loading || !file}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-generate Letter
                </label>
                <button
                  onClick={generateLetter}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating..." : "Generate Letter Automatically"}
                </button>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  System will generate a professional work experience letter
                </p>
              </div>
            </div>
          </div>
        )}

        {request.status === "rejected" && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              This request has been rejected. Reason: {request.adminReason || "No reason provided"}
            </p>
          </div>
        )}

        {request.status === "completed" && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-600 dark:text-green-400">
              This request has been completed. The letter is ready for download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceDetail;