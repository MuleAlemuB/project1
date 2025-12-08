// src/pages/employee/EmployeeLeave.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import { useSettings } from "../../contexts/SettingsContext";

const EmployeeLeave = () => {
  const { darkMode, language } = useSettings();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [myLeaves, setMyLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  // Fetch all leave requests for the logged-in employee
  const fetchMyLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const res = await axiosInstance.get("/employee-leave/my-requests");
      setMyLeaves(res.data);
    } catch (error) {
      console.error(error);
      toast.error(language === "am" ? "የእረፍት ጥያቄዎችን ማውረድ አልተሳካም።" : "Failed to fetch your leave requests");
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [language]);

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
      toast.error(language === "am" ? "እባክዎ ሁሉንም መስኮች ይሙሉ!" : "Please fill in all fields!");
      return;
    }

    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    data.append("reason", reason);
    attachments.forEach((file) => data.append("attachments", file));

    try {
      setLoading(true);
      const res = await axiosInstance.post("/employee-leave/request", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      setFormData({ startDate: "", endDate: "", reason: "" });
      setAttachments([]);
      fetchMyLeaves();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          (language === "am" ? "የእረፍት ጥያቄ ማስገባት አልተሳካም።" : "Failed to submit leave request")
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a leave request
  const handleDelete = async (id) => {
    if (!window.confirm(language === "am" ? "ይህን የእረፍት ጥያቄ መሰረዝ እንደምትፈልጉ ይረጋገጡ?" : "Are you sure you want to delete this leave request?")) 
      return;

    try {
      await axiosInstance.delete(`/employee-leave/${id}`);
      toast.success(language === "am" ? "የእረፍት ጥያቄ ተሰርዟል" : "Leave request deleted");
      fetchMyLeaves();
    } catch (error) {
      console.error(error);
      toast.error(language === "am" ? "የእረፍት ጥያቄ ማሰረዝ አልተሳካም።" : "Failed to delete leave request");
    }
  };

  const mainBg = darkMode
    ? "bg-gray-900"
    : "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50";
  const cardBg = darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-900";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className={`${mainBg} flex-1 p-6 transition-all duration-500`}>
        {/* Leave Request Form */}
        <div className="max-w-4xl mx-auto mt-6 space-y-10">
          <div className={`${cardBg} p-6 rounded-2xl shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">
              {language === "am" ? "የእረፍት ጥያቄ ላክ" : "Submit Leave Request"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col">
                {language === "am" ? "መነሻ ቀን" : "Start Date"}:
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`mt-1 w-full px-3 py-2 rounded border ${inputBg}`}
                  required
                />
              </label>

              <label className="flex flex-col">
                {language === "am" ? "መጨረሻ ቀን" : "End Date"}:
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`mt-1 w-full px-3 py-2 rounded border ${inputBg}`}
                  required
                />
              </label>

              <label className="flex flex-col">
                {language === "am" ? "ምክንያት" : "Reason"}:
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={`mt-1 w-full px-3 py-2 rounded border ${inputBg}`}
                  placeholder={language === "am" ? "ለምን እንደምትቀርቡ ያስገቡ" : "Enter reason for leave"}
                  required
                />
              </label>

              <label className="flex flex-col">
                {language === "am" ? "አባሪዎች (አማራጭ)" : "Attachments (optional)"}:
                <input type="file" multiple onChange={handleFileChange} className="mt-1 w-full" />
              </label>

              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-4 rounded text-white transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading
                  ? language === "am"
                    ? "በመላክ ላይ..."
                    : "Submitting..."
                  : language === "am"
                  ? "ጥያቄ ላክ"
                  : "Submit Leave Request"}
              </button>
            </form>
          </div>

          {/* My Leave Requests Table */}
          <div className={`${cardBg} p-6 rounded-2xl shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">
              {language === "am" ? "የእረፍት ጥያቄዎቼ" : "My Leave Requests"}
            </h2>

            {loadingLeaves ? (
              <p>{language === "am" ? "የእረፍት ጥያቄዎች በመጫን ላይ..." : "Loading your leave requests..."}</p>
            ) : myLeaves.length === 0 ? (
              <p>{language === "am" ? "ምንም ጥያቄ አልተገኘም።" : "No leave requests found."}</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border px-4 py-2">{language === "am" ? "መነሻ ቀን" : "Start Date"}</th>
                    <th className="border px-4 py-2">{language === "am" ? "መጨረሻ ቀን" : "End Date"}</th>
                    <th className="border px-4 py-2">{language === "am" ? "ምክንያት" : "Reason"}</th>
                    <th className="border px-4 py-2">{language === "am" ? "ሁኔታ" : "Status"}</th>
                    <th className="border px-4 py-2">{language === "am" ? "እርምጃ" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="border px-4 py-2">{leave.startDate.split("T")[0]}</td>
                      <td className="border px-4 py-2">{leave.endDate.split("T")[0]}</td>
                      <td className="border px-4 py-2">{leave.reason}</td>
                      <td className="border px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            leave.status === "Approved"
                              ? "bg-green-500"
                              : leave.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {language === "am"
                            ? leave.status === "Approved"
                              ? "ተፈቅዷል"
                              : leave.status === "Rejected"
                              ? "ተቀባል"
                              : "በሂደት ላይ"
                            : leave.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDelete(leave._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          {language === "am" ? "ሰርዝ" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLeave;
