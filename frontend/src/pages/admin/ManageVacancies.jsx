import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useSettings } from "../contexts/SettingsContext";

const ManageVacancies = ({ isAdmin = false }) => {
  const { darkMode, language, setLanguage } = useSettings();

  const [vacancies, setVacancies] = useState([]);
  const [modalType, setModalType] = useState(""); // "view" or "edit"
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    position: "",
    employmentType: "",
    qualification: "",
    experience: "",
    salary: "",
    postDate: "",
    deadline: "",
    description: "",
  });

  // Load language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);
  }, [setLanguage]);

  // Persist language change
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const res = await api.get("/admin/vacancies");
      setVacancies(res.data);
    } catch (err) {
      console.error(
        language === "am"
          ? "ስለስራ ቦታዎች መረጃ ማግኘት አልተሳካም፡፡"
          : "Failed to fetch vacancies:",
        err.response?.data?.message || err.message
      );
    }
  };

  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.department ||
        !formData.position ||
        !formData.employmentType ||
        !formData.postDate ||
        !formData.deadline
      ) {
        return alert(
          language === "am"
            ? "እባክዎ ሁሉንም ያስፈልጋሉ መሞላት አለበት።"
            : "Please fill in all required fields."
        );
      }

      const res = await api.post("/admin/vacancies", formData);
      setVacancies([...vacancies, res.data]);
      setFormData({
        title: "",
        department: "",
        position: "",
        employmentType: "",
        qualification: "",
        experience: "",
        salary: "",
        postDate: "",
        deadline: "",
        description: "",
      });
    } catch (err) {
      alert(
        language === "am"
          ? "ስራ ቦታ መፍጠር አልተሳካም፡፡"
          : err.response?.data?.message || "Error creating vacancy"
      );
    }
  };

  const openModal = (type, vacancy) => {
    setModalType(type);
    setSelectedVacancy(vacancy);
    setFormData({
      title: vacancy.title || "",
      department: vacancy.department || "",
      position: vacancy.position || "",
      employmentType: vacancy.employmentType || "",
      qualification: vacancy.qualification || "",
      experience: vacancy.experience || "",
      salary: vacancy.salary || "",
      postDate: vacancy.postDate ? vacancy.postDate.split("T")[0] : "",
      deadline: vacancy.deadline ? vacancy.deadline.split("T")[0] : "",
      description: vacancy.description || "",
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.title ||
        !formData.department ||
        !formData.position ||
        !formData.employmentType ||
        !formData.postDate ||
        !formData.deadline
      ) {
        return alert(
          language === "am"
            ? "እባክዎ ሁሉንም ያስፈልጋሉ መሞላት አለበት።"
            : "Please fill in all required fields."
        );
      }

      const res = await api.put(`/admin/vacancies/${selectedVacancy._id}`, formData);
      setVacancies(vacancies.map((v) => (v._id === res.data._id ? res.data : v)));
      setModalType("");
    } catch (err) {
      alert(
        language === "am"
          ? "ስራ ቦታ ማሻሻያ አልተሳካም፡፡"
          : err.response?.data?.message || "Error updating vacancy"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        language === "am"
          ? "እርግጠኛ ነህ ይህን ስራ ቦታ ማጥፋት ይፈልጋሉ?"
          : "Are you sure you want to delete this vacancy?"
      )
    )
      return;
    try {
      await api.delete(`/admin/vacancies/${id}`);
      setVacancies(vacancies.filter((v) => v._id !== id));
    } catch (err) {
      alert(
        language === "am"
          ? "ስራ ቦታ ማጥፋት አልተሳካም፡፡"
          : err.response?.data?.message || "Error deleting vacancy"
      );
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} p-6 min-h-screen`}>
      <h1 className="text-3xl font-bold mb-6">
        {language === "am" ? "የስራ ቦታዎች" : "Vacancies"}
      </h1>

      {isAdmin && (
        <form
          onSubmit={handleCreate}
          className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border"} grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 rounded shadow-md`}
        >
          <input
            type="text"
            name="title"
            placeholder={language === "am" ? "የስራ ርዕስ" : "Job Title"}
            value={formData.title}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="department"
            placeholder={language === "am" ? "ክፍል" : "Department"}
            value={formData.department}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="position"
            placeholder={language === "am" ? "ቦታ" : "Position"}
            value={formData.position}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="employmentType"
            placeholder={language === "am" ? "የሥራ አይነት" : "Employment Type"}
            value={formData.employmentType}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="qualification"
            placeholder={language === "am" ? "ትምህርት" : "Qualification"}
            value={formData.qualification}
            onChange={handleChange}
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="experience"
            placeholder={language === "am" ? "ልምድ" : "Experience"}
            value={formData.experience}
            onChange={handleChange}
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="text"
            name="salary"
            placeholder={language === "am" ? "ደመወዝ" : "Salary"}
            value={formData.salary}
            onChange={handleChange}
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="date"
            name="postDate"
            value={formData.postDate}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <textarea
            name="description"
            placeholder={language === "am" ? "የስራ መግለጫ" : "Job Description"}
            value={formData.description}
            onChange={handleChange}
            className={`border p-2 rounded focus:ring-2 focus:ring-purple-500 col-span-1 md:col-span-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-gradient-to-r from-green-500 to-green-700 text-white p-3 rounded shadow hover:scale-105 transform transition duration-200"
          >
            {language === "am" ? "ስራ ቦታ ያቀርቡ" : "Post Vacancy"}
          </button>
        </form>
      )}

      {/* Vacancies Table */}
      <div className={`overflow-x-auto rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}>
            <tr>
              <th className="border px-4 py-2">{language === "am" ? "ርዕስ" : "Title"}</th>
              <th className="border px-4 py-2">{language === "am" ? "ክፍል" : "Department"}</th>
              <th className="border px-4 py-2">{language === "am" ? "ቦታ" : "Position"}</th>
              <th className="border px-4 py-2">{language === "am" ? "የሥራ አይነት" : "Employment Type"}</th>
              <th className="border px-4 py-2">{language === "am" ? "የመለያየት ቀን" : "Post Date"}</th>
              <th className="border px-4 py-2">{language === "am" ? "የመጨረሻ ቀን" : "Deadline"}</th>
              <th className="border px-4 py-2">{language === "am" ? "ሁኔታ" : "Status"}</th>
              {isAdmin && <th className="border px-4 py-2">{language === "am" ? "እርምጃዎች" : "Actions"}</th>}
            </tr>
          </thead>
          <tbody>
            {vacancies.length > 0 ? (
              vacancies.map((v) => {
                const expired = isExpired(v.deadline);
                return (
                  <tr key={v._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border px-4 py-2">{v.title}</td>
                    <td className="border px-4 py-2">{v.department}</td>
                    <td className="border px-4 py-2">{v.position}</td>
                    <td className="border px-4 py-2">{v.employmentType}</td>
                    <td className="border px-4 py-2">{v.postDate ? new Date(v.postDate).toLocaleDateString() : "-"}</td>
                    <td className="border px-4 py-2">{v.deadline ? new Date(v.deadline).toLocaleDateString() : "-"}</td>
                    <td className={`border px-4 py-2 font-bold ${expired ? "text-red-600" : "text-green-600"}`}>
                      {expired ? (language === "am" ? "ያልተጠናቀቀ" : "Expired") : (language === "am" ? "ክፍት" : "Open")}
                    </td>
                    {isAdmin && (
                      <td className="border px-4 py-2 flex gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => openModal("view", v)} className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"><FaEye /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => openModal("edit", v)} className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1"><FaEdit /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(v._id)} className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"><FaTrash /></motion.button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center p-4 text-gray-500 dark:text-gray-300">
                  {language === "am" ? "ምንም ስራ ቦታዎች አልተገኙም" : "No vacancies found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVacancies;
