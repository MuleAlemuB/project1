import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaFileDownload, FaCalendarAlt } from "react-icons/fa";
import { useSettings } from "../../contexts/SettingsContext";

const AdminVacancies = () => {
  const { language, darkMode } = useSettings(); // use darkMode

  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const texts = {
    en: {
      dashboard: "Vacancy Dashboard",
      addVacancy: "Add Vacancy",
      create: "Create",
      update: "Update",
      cancel: "Cancel",
      department: "Department",
      position: "Position",
      employmentType: "Employment Type",
      qualification: "Qualification",
      experience: "Experience",
      salary: "Salary",
      description: "Description",
      post: "Post",
      deadline: "Deadline",
      applied: "Applied",
      applications: "Applications",
      name: "Name",
      email: "Email",
      phone: "Phone",
      resume: "Resume",
      appliedAt: "Applied At",
      seen: "Seen",
      action: "Action",
      delete: "Delete",
      noApplications: "No applications yet.",
    },
    am: {
      dashboard: "የስራ አደረጃጀት ማዕከል",
      addVacancy: "ስራ አቀራረት አክል",
      create: "ፍጠር",
      update: "አሻሽል",
      cancel: "ሰርዝ",
      department: "የመምሪያ ክፍል",
      position: "የስራ መደብ",
      employmentType: "የስራ አይነት",
      qualification: "ትምህርት ዝርዝር",
      experience: "ልምድ",
      salary: "ደመወዝ",
      description: "መግለጫ",
      post: "ቀን አስቀምጥ",
      deadline: "የመጨረሻ ቀን",
      applied: "ተመዝግቧል",
      applications: "መተግበሪያዎች",
      name: "ስም",
      email: "ኢሜል",
      phone: "ስልክ",
      resume: "የራስ መግለጫ",
      appliedAt: "ቀን ተመዝግቧል",
      seen: "ታይቷል",
      action: "እርምጃ",
      delete: "ሰርዝ",
      noApplications: "አሁን እስካሁን መተግበሪያ የለም",
    },
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const res = await axiosInstance.get("/vacancies");
      const vacanciesData = res.data;

      const apps = await axiosInstance.get("/applications");
      const appsByVacancy = apps.data.reduce((acc, app) => {
        const id = app.vacancy?._id;
        if (id) acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const updatedVacancies = vacanciesData.map((v) => ({
        ...v,
        appCount: appsByVacancy[v._id] || 0,
      }));

      setVacancies(updatedVacancies);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOpen = () => {
    setFormData({
      title: "",
      department: "",
      position: "",
      employmentType: "",
      qualification: "",
      experience: "",
      salary: "",
      postDate: new Date().toISOString().slice(0, 10),
      deadline: "",
      description: "",
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/vacancies", formData);
      setVacancies([...vacancies, res.data]);
      setIsCreateOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = (vacancy) => {
    setSelectedVacancy(vacancy);
    setFormData({
      ...vacancy,
      postDate: vacancy.postDate?.slice(0, 10),
      deadline: vacancy.deadline?.slice(0, 10),
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/vacancies/${selectedVacancy._id}`, formData);
      setVacancies(vacancies.map((v) => (v._id === res.data._id ? res.data : v)));
      setIsEditOpen(false);
      setSelectedVacancy(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm(t.delete + " " + t.dashboard + "?")) return;
    try {
      await axiosInstance.delete(`/vacancies/${id}`);
      setVacancies(vacancies.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = async (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsViewOpen(true);
    try {
      const res = await axiosInstance.get("/applications");
      const filtered = res.data.filter((app) => app.vacancy?._id === vacancy._id);
      setApplications(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm(t.delete + " " + t.applications + "?")) return;
    try {
      await axiosInstance.delete(`/applications/${id}`);
      const res = await axiosInstance.get("/applications");
      setApplications(res.data.filter((app) => app.vacancy?._id === selectedVacancy._id));
      fetchVacancies();
    } catch (err) {
      console.error("Failed to delete application:", err.response?.data || err.message);
    }
  };

  const handleDownload = (filename) => {
    if (!filename) return;
    window.open(`http://localhost:5000/uploads/${filename}`, "_blank");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Tailwind classes for dark mode
  const bgClass = darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900";
  const cardClass = darkMode ? "bg-gray-800 text-gray-100 shadow-lg" : "bg-gradient-to-r from-blue-200 via-blue-100 to-white shadow-md";

  return (
    <div className={`p-6 min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-wide mb-4 md:mb-0">{t.dashboard}</h2>
        <button
          onClick={handleCreateOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <FaPlus /> {t.addVacancy}
        </button>
      </div>

      {/* Vacancy List */}
      <div className="space-y-6">
        {vacancies.map((v) => (
          <div key={v._id} className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-lg ${cardClass} hover:shadow-xl transition transform hover:-translate-y-1`}>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p>
                {v.position} ({v.employmentType})
              </p>
              <p className="mt-1 flex items-center gap-2">
                <FaCalendarAlt /> {t.post}: {new Date(v.postDate).toLocaleDateString()} | {t.deadline}: {new Date(v.deadline).toLocaleDateString()}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                <FaUsers /> {v.appCount} {t.applied}
              </span>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button onClick={() => handleView(v)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full transition transform hover:scale-105 flex items-center gap-1"><FaEye /></button>
              <button onClick={() => handleEditOpen(v)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-full transition transform hover:scale-105 flex items-center gap-1"><FaEdit /></button>
              <button onClick={() => handleDeleteVacancy(v._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full transition transform hover:scale-105 flex items-center gap-1"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isViewOpen && selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full md:w-4/5 lg:w-3/5 p-8 relative text-gray-900 dark:text-gray-100`}>
            <button onClick={() => setIsViewOpen(false)} className="absolute top-4 right-4 text-red-600 text-3xl font-bold hover:scale-110">×</button>
            <h3 className="text-3xl font-bold mb-4">{selectedVacancy.title}</h3>
            <p className="mb-2"><strong>{t.department}:</strong> {selectedVacancy.department}</p>
            <p className="mb-2"><strong>{t.position}:</strong> {selectedVacancy.position}</p>
            <p className="mb-2"><strong>{t.employmentType}:</strong> {selectedVacancy.employmentType}</p>
            <p className="mb-2"><strong>{t.qualification}:</strong> {selectedVacancy.qualification || "-"}</p>
            <p className="mb-2"><strong>{t.experience}:</strong> {selectedVacancy.experience}</p>
            <p className="mb-2"><strong>{t.salary}:</strong> {selectedVacancy.salary}</p>
            <p className="mb-2"><strong>{t.description}:</strong> {selectedVacancy.description}</p>

            <h4 className="text-2xl font-bold mt-6 mb-2 flex items-center gap-2"><FaUsers /> {t.applications} ({applications.length})</h4>
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-blue-100 text-blue-900 font-semibold">
                    <tr>
                      <th className="p-2 border">{t.name}</th>
                      <th className="p-2 border">{t.email}</th>
                      <th className="p-2 border">{t.phone}</th>
                      <th className="p-2 border">{t.resume}</th>
                      <th className="p-2 border">{t.appliedAt}</th>
                      <th className="p-2 border">{t.seen}</th>
                      <th className="p-2 border">{t.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-blue-50 transition">
                        <td className="p-2 border">{app.name}</td>
                        <td className="p-2 border">{app.email}</td>
                        <td className="p-2 border">{app.phone}</td>
                        <td className="p-2 border">
                          {app.resume ? (
                            <button onClick={() => handleDownload(app.resume)} className="text-blue-600 hover:underline flex items-center gap-1"><FaFileDownload /> {t.resume}</button>
                          ) : "N/A"}
                        </td>
                        <td className="p-2 border">{new Date(app.appliedAt || app.createdAt).toLocaleString()}</td>
                        <td className="p-2 border">{app.seen ? "Yes" : "No"}</td>
                        <td className="p-2 border">
                          <button onClick={() => handleDeleteApplication(app._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition">{t.delete}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">{t.noApplications}</p>
            )}
          </div>
        </div>
      )}

      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full md:w-4/5 lg:w-3/5 p-8 relative text-gray-900 dark:text-gray-100`}>
            <button onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="absolute top-4 right-4 text-red-600 text-3xl font-bold hover:scale-110">×</button>
            <h3 className="text-3xl font-bold mb-4">{isCreateOpen ? t.addVacancy : t.update}</h3>
            <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
              </div>
              {["department", "position", "employmentType", "qualification", "experience", "salary", "postDate", "deadline", "description"].map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="mb-1 font-semibold">{t[key] || key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input type={key.includes("Date") ? "date" : "text"} name={key} value={formData[key]} onChange={handleChange} className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
              ))}
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">{isCreateOpen ? t.create : t.update}</button>
                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition">{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVacancies;
