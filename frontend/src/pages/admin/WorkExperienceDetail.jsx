// src/pages/admin/WorkExperienceDetail.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WorkExperienceDetail = () => {
  const { id } = useParams();
  const [reqData, setReqData] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  const fetchRequest = async () => {
    try {
      const { data } = await axiosInstance.get(`/work-experience`);
      const r = data.find((i) => i._id === id);
      setReqData(r);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch request data");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const rejectRequest = async () => {
    if (!reason) return toast.error("Enter rejection reason");
    try {
      await axiosInstance.put(`/work-experience/${id}/reject`, { reason });
      toast.success("Request rejected");
      navigate("/admin/work-experience");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  const approveUpload = async () => {
    if (!file) return toast.error("Select a file to upload");
    try {
      const formData = new FormData();
      formData.append("letterFile", file);
      await axiosInstance.put(`/work-experience/${id}/approve/upload`, formData);
      toast.success("Request approved with uploaded letter");
      navigate("/admin/work-experience");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    }
  };

  const approveGenerate = async () => {
    if (!link) return toast.error("Enter the generated letter link");
    try {
      await axiosInstance.put(`/work-experience/${id}/approve/generate`, { link });
      toast.success("Request approved with generated link");
      navigate("/admin/work-experience");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    }
  };

  if (!reqData) return <p>Loading request...</p>;

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Request Detail</h2>

      <div className="space-y-2">
        <p><b>Name:</b> {reqData.employee.firstname} {reqData.employee.lastname}</p>
        <p><b>Email:</b> {reqData.employee.email}</p>
        <p><b>Department:</b> {reqData.department}</p>
        <p><b>Reason:</b> {reqData.reason}</p>
        {reqData.requestAttachment && (
          <a
            href={`http://localhost:5000/${reqData.requestAttachment}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Download Submitted File
          </a>
        )}
      </div>

      {reqData.status === "Pending" && (
        <div className="mt-6 space-y-4">
          <div>
            <textarea
              placeholder="Reason for rejection"
              className="border p-2 w-full"
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              onClick={rejectRequest}
              className="bg-red-600 text-white px-4 py-2 mt-2 rounded"
            >
              Reject
            </button>
          </div>

          <div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={approveUpload}
              className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
            >
              Approve & Upload Letter
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Generated letter link"
              className="border p-2 w-full"
              onChange={(e) => setLink(e.target.value)}
            />
            <button
              onClick={approveGenerate}
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
            >
              Approve & Use Generated Link
            </button>
          </div>
        </div>
      )}

      {reqData.status === "Approved" && (
        <div className="mt-4">
          <a
            href={reqData.letterFile || reqData.generatedLetterLink}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download Letter
          </a>
        </div>
      )}

      {reqData.status === "Rejected" && (
        <p className="text-red-500 mt-4">Rejected Reason: {reqData.adminDecisionReason}</p>
      )}
    </div>
  );
};

export default WorkExperienceDetail;
