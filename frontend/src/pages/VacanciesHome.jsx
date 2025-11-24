import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useSettings } from "../contexts/SettingsContext";
import {
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

const Notification = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg transition-transform transform ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      } animate-slide-in`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const VacanciesHome = () => {
  const { darkMode, language } = useSettings();

  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [newVacancyCount, setNewVacancyCount] = useState(0);
  const [newApplications, setNewApplications] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const res = await axios.get("/vacancies");
      setVacancies(res.data);

      const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
      const now = new Date();
      const newCount = res.data.filter(
        (v) =>
          now - new Date(v.postDate) < 24 * 60 * 60 * 1000 &&
          !viewed.includes(v._id)
      ).length;
      setNewVacancyCount(newCount);

      const allAppsRes = await axios.get("/applications");
      const allApps = allAppsRes.data;
      const apps = {};
      res.data.forEach((v) => {
        const newAppsCount = allApps.filter(
          (a) =>
            a.vacancy?._id === v._id &&
            now - new Date(a.appliedAt) < 24 * 60 * 60 * 1000
        ).length;
        apps[v._id] = newAppsCount;
      });
      setNewApplications(apps);
    } catch (err) {
      console.error(err);
      showNotification(language === "am" ? "እባክዎን ችግር አጋጠሙ" : "Failed to fetch vacancies", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); // auto dismiss after 4s
  };

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      setApplication({ ...application, resume: e.target.files[0] });
    } else {
      setApplication({ ...application, [e.target.name]: e.target.value });
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    const formDataData = new FormData();
    formDataData.append("name", application.name);
    formDataData.append("email", application.email);
    formDataData.append("phone", application.phone);
    formDataData.append("resume", application.resume);
    formDataData.append("vacancyId", selectedVacancy._id);

    try {
      await axios.post(`/applications/apply/${selectedVacancy._id}`, formDataData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification(
        language === "am"
          ? "ማመልከቻዎ በተሳካ ሁኔታ ተልኳል!"
          : "Application submitted successfully!",
        "success"
      );

      const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
      localStorage.setItem(
        "viewedVacancies",
        JSON.stringify([...viewed, selectedVacancy._id])
      );
      setSelectedVacancy(null);
      setApplication({ name: "", email: "", phone: "", resume: null });
      fetchVacancies();
    } catch (err) {
      console.error(err);
      showNotification(
        language === "am" ? "ማመልከቻዎን ማቅረብ አልተሳካም" : "Failed to submit application",
        "error"
      );
    }
  };

  const handleOpenModal = (v) => {
    setSelectedVacancy(v);
    const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
    if (!viewed.includes(v._id)) {
      localStorage.setItem("viewedVacancies", JSON.stringify([...viewed, v._id]));
    }
  };

  return (
    <div
      className={`max-w-6xl mx-auto p-6 min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-gray-200"
          : "bg-gradient-to-b from-indigo-50 to-indigo-100 text-gray-900"
      }`}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700 dark:text-indigo-300">
        {language === "am" ? "የሥራ ክፍሎች" : "Available Vacancies"}
        {newVacancyCount > 0 && (
          <span className="ml-3 inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
            {newVacancyCount} {language === "am" ? "አዲስ" : "New"}
          </span>
        )}
      </h2>

      {/* Vacancies list */}
      {vacancies.length > 0 ? (
        vacancies.map((v) => {
          const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
          const isNew =
            !viewed.includes(v._id) &&
            new Date() - new Date(v.postDate) < 24 * 60 * 60 * 1000;

          return (
            <div
              key={v._id}
              className={`${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              } shadow-lg rounded-xl p-6 mb-5 hover:shadow-2xl transition transform hover:scale-105 border-l-8 border-indigo-500 relative`}
            >
              {isNew && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {language === "am" ? "አዲስ" : "New"}
                </span>
              )}
              {newApplications[v._id] > 0 && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                  <FaBell /> {newApplications[v._id]}{" "}
                  {language === "am" ? "አዲስ መልእክቶች" : "New App"}
                </span>
              )}

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
                  {v.title}
                </h3>
                <button
                  onClick={() => handleOpenModal(v)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow hover:shadow-lg"
                >
                  {language === "am" ? "ይመልከቱ" : "Apply"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p>
                  <FaBuilding className="inline mr-2 text-indigo-500" />{" "}
                  <b>{language === "am" ? "ዲፓርትመንት፡" : "Department:"}</b> {v.department}
                </p>
                <p>
                  <FaBriefcase className="inline mr-2 text-purple-500" />{" "}
                  <b>{language === "am" ? "የሥራ ቦታ፡" : "Position:"}</b> {v.position}
                </p>
                <p>
                  <FaClock className="inline mr-2 text-yellow-500" />{" "}
                  <b>{language === "am" ? "የሥራ አይነት፡" : "Employment Type:"}</b> {v.employmentType}
                </p>
                <p>
                  <FaGraduationCap className="inline mr-2 text-green-500" />{" "}
                  <b>{language === "am" ? "ትምህርት ደረጃ፡" : "Qualification:"}</b> {v.qualification || "-"}
                </p>
                <p>
                  <FaBriefcase className="inline mr-2 text-red-500" />{" "}
                  <b>{language === "am" ? "ልምድ፡" : "Experience:"}</b> {v.experience || "-"}
                </p>
                <p>
                  <FaDollarSign className="inline mr-2 text-teal-500" />{" "}
                  <b>{language === "am" ? "ደመወዝ፡" : "Salary:"}</b> {v.salary || "Negotiable"}
                </p>
                <p>
                  <FaCalendarAlt className="inline mr-2 text-indigo-400" />{" "}
                  <b>{language === "am" ? "የተፈጠረበት ቀን፡" : "Post Date:"}</b>{" "}
                  {new Date(v.postDate).toDateString()}
                </p>
                <p>
                  <FaCalendarAlt className="inline mr-2 text-red-400" />{" "}
                  <b>{language === "am" ? "መዝጊያ ቀን፡" : "Deadline:"}</b>{" "}
                  {new Date(v.deadline).toDateString()}
                </p>
                <p>
                  <FaFileAlt className="inline mr-2 text-gray-500" />{" "}
                  <b>{language === "am" ? "መግለጫ፡" : "Description:"}</b> {v.description || "-"}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">
          {language === "am" ? "ምንም ክፍት የሥራ ቦታዎች የሉም።" : "No vacancies available"}
        </p>
      )}

      {/* Application Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleApply}
            className={`${darkMode ? "bg-gray-800 text-gray-100" : "bg-white"} p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4`}
          >
            <h3 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-300">
              {language === "am" ? "ይመልከቱ፡" : "Apply for:"} {selectedVacancy.title}
            </h3>
            <input
              type="text"
              name="name"
              placeholder={language === "am" ? "ስም" : "Your Name"}
              value={application.name}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={language === "am" ? "ኢሜይል" : "Your Email"}
              value={application.email}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={language === "am" ? "ስልክ ቁጥር" : "Phone Number"}
              value={application.phone}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx,.zip"
              onChange={handleChange}
              className="w-full border border-indigo-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow hover:shadow-lg"
              >
                {language === "am" ? "ያስገቡ" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedVacancy(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow hover:shadow-lg"
              >
                {language === "am" ? "ይቅር" : "Cancel"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VacanciesHome;
