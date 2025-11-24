// src/pages/deptHead/DeptHeadRequisition.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axios from "../../utils/axiosInstance";
import { FaDownload, FaEye, FaPlus, FaTrash } from "react-icons/fa";

const DeptHeadRequisition = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Form fields
  const [date, setDate] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [education, setEducation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [term, setTerm] = useState("");
  const [sex, setSex] = useState("");
  const [experience, setExperience] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Fetch requisitions
  const fetchRequisitions = async () => {
    try {
      const res = await axios.get("/requisitions/depthead");
      setRequisitions(res.data);
    } catch (err) {
      console.error("Fetch requisitions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchRequisitions();
  }, [user, authLoading]);

  // Apply form submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!date || !position || !department || !education || !quantity || !term) {
      alert(language === "am" ? "ሁሉንም መስፈርቶች ያስገቡ።" : "All required fields must be filled");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("position", position);
      formData.append("department", department);
      formData.append("education", education);
      formData.append("quantity", quantity);
      formData.append("term", term);
      formData.append("sex", sex);
      formData.append("experience", experience);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post("/requisitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      setShowApplyForm(false);
      resetForm();
      fetchRequisitions();
    } catch (err) {
      console.error("Apply requisition error:", err);
      alert(language === "am" ? "ማመዝገብ አልተሳካም።" : "Failed to submit requisition");
    }
  };

  const resetForm = () => {
    setDate("");
    setPosition("");
    setDepartment("");
    setEducation("");
    setQuantity(1);
    setTerm("");
    setSex("");
    setExperience("");
    setAttachments([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === "am" ? "እርግጠኛ ነዎት ይህን ጥያቄ ማጥፋት እፈልጋለሁ?" : "Are you sure you want to delete this requisition?")) return;

    try {
      await axios.delete(`/requisitions/${id}`);
      alert(language === "am" ? "ጥያቄ ተሳክቷል" : "Requisition deleted successfully");
      fetchRequisitions();
    } catch (err) {
      console.error("Delete requisition error:", err);
      alert(language === "am" ? "ማጥፋት አልተሳካም።" : "Failed to delete requisition");
    }
  };

  if (authLoading || loading) {
    return (
      <div className={`p-6 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        {language === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );
  }

  if (!user) return <div className="p-6 text-center text-red-500">Not authorized</div>;

  const textClass = darkMode ? "text-gray-200" : "text-gray-800";
  const tableBg = darkMode ? "bg-gray-800" : "bg-white";
  const tableHeaderBg = darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700";

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${textClass}`}>
          {language === "am" ? "የጥያቄ ዝርዝሮች" : "Department Requisitions"}
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={() => setShowApplyForm(!showApplyForm)}
        >
          <FaPlus />
          {language === "am" ? "አዲስ ጥያቄ" : "New Requisition"}
        </button>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <form
          onSubmit={handleApplySubmit}
          className={`mb-6 p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>
            {language === "am" ? "አዲስ ጥያቄ" : "New Requisition"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`font-semibold ${textClass}`}>Position</label>
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Department</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Education</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Term</label>
              <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
                <option value="">{language === "am" ? "ምረጥ" : "Select"}</option>
                <option value="Male">{language === "am" ? "ወንድ" : "Male"}</option>
                <option value="Female">{language === "am" ? "ሴት" : "Female"}</option>
              </select>
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Experience</label>
              <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div>
              <label className={`font-semibold ${textClass}`}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`font-semibold ${textClass}`}>Attachments</label>
              <input type="file" multiple onChange={(e) => setAttachments(Array.from(e.target.files))} className="mt-1" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Submit</button>
            <button type="button" className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded" onClick={() => { setShowApplyForm(false); resetForm(); }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className={`overflow-x-auto shadow rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} ${tableBg}`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={tableHeaderBg}>
            <tr>
              <th className="px-6 py-3 text-left text-lg font-medium">Position</th>
              <th className="px-6 py-3 text-left text-lg font-medium">Status</th>
              <th className="px-6 py-3 text-left text-lg font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
            {requisitions.length > 0 ? (
              requisitions.map((r) => (
                <tr key={r._id} className={`transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                  <td className={`px-6 py-4 font-medium ${textClass}`}>{r.position}</td>
                  <td className={`px-6 py-4 font-medium ${textClass}`}>{r.status || "Pending"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={() => setSelectedReq(r)}>
                      <FaEye /> {language === "am" ? "ዝርዝር" : "Details"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded" onClick={() => handleDelete(r._id)}>
                      <FaTrash /> {language === "am" ? "ማጥፋት" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={`text-center py-4 ${textClass}`}>{language === "am" ? "ምንም ጥያቄ አልተገኘም" : "No requisitions found"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReq && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-lg w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>{language === "am" ? "የጥያቄ ዝርዝር" : "Requisition Details"}</h2>
            <div className={`space-y-3 ${textClass}`}>
              <p><strong>Date:</strong> {new Date(selectedReq.date).toLocaleDateString()}</p>
              <p><strong>Position:</strong> {selectedReq.position}</p>
              <p><strong>Department:</strong> {selectedReq.department}</p>
              <p><strong>Education:</strong> {selectedReq.educationalLevel}</p>
              <p><strong>Quantity:</strong> {selectedReq.quantity}</p>
              <p><strong>Term:</strong> {selectedReq.termOfEmployment}</p>
              <p><strong>Sex:</strong> {selectedReq.sex}</p>
              <p><strong>Experience:</strong> {selectedReq.experience}</p>
              <p><strong>Status:</strong> {selectedReq.status || "Pending"}</p>
              <div>
                <strong>Attachments:</strong>
                <div className="flex flex-col gap-1 mt-1">
                  {selectedReq.attachments?.length > 0 ? (
                    selectedReq.attachments.map((file, idx) => (
                      <a key={idx} href={`http://localhost:5000/${file}`} download className="flex items-center gap-2 text-blue-600 hover:underline">
                        <FaDownload /> {file.split("/").pop()}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-500">{language === "am" ? "ምንም አባሪ" : "No attachments"}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded" onClick={() => setSelectedReq(null)}>
                {language === "am" ? "መዝጊያ" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadRequisition;
