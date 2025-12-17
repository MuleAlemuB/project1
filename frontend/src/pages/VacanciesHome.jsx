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

const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl transition-transform transform ${
      type === "success"
        ? "bg-green-600 text-white"
        : "bg-red-600 text-white"
    } animate-slide-in`}
  >
    <div className="flex justify-between items-center">
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  </div>
);

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
      showNotification(
        language === "am" ? "እባክዎን ችግር አጋጠሙ" : "Failed to fetch vacancies",
        "error"
      );
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
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

    const formData = new FormData();
    formData.append("name", application.name);
    formData.append("email", application.email);
    formData.append("phone", application.phone);
    formData.append("resume", application.resume);
    formData.append("vacancyId", selectedVacancy._id);

    try {
      await axios.post(`/applications/apply/${selectedVacancy._id}`, formData, {
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
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">
          {language === "am" ? "የሥራ ክፍሎች" : "Available Vacancies"}
        </h1>
        {newVacancyCount > 0 && (
          <span className="inline-block mt-3 bg-red-600 text-white text-sm px-4 py-1 rounded-full animate-pulse font-semibold">
            {newVacancyCount} {language === "am" ? "አዲስ" : "New"}
          </span>
        )}
      </div>

      {/* Vacancies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vacancies.length > 0 ? (
          vacancies.map((v) => {
            const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
            const isNew =
              !viewed.includes(v._id) &&
              new Date() - new Date(v.postDate) < 24 * 60 * 60 * 1000;

            return (
              <div
                key={v._id}
                className={`relative rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* New Badge */}
                {isNew && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {language === "am" ? "አዲስ" : "New"}
                  </span>
                )}

                {/* New Application Badge */}
                {newApplications[v._id] > 0 && (
                  <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <FaBell /> {newApplications[v._id]}{" "}
                    {language === "am" ? "አዲስ መልእክቶች" : "New App"}
                  </span>
                )}

                {/* Vacancy Content */}
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                      {v.title}
                    </h2>
                    <div className="grid gap-2 text-sm">
                      <p>
                        <FaBuilding className="inline mr-2 text-indigo-500" />
                        <b>{language === "am" ? "ዲፓርትመንት:" : "Department:"}</b>{" "}
                        {v.department}
                      </p>
                      <p>
                        <FaBriefcase className="inline mr-2 text-purple-500" />
                        <b>{language === "am" ? "የሥራ ቦታ:" : "Position:"}</b>{" "}
                        {v.position}
                      </p>
                      <p>
                        <FaClock className="inline mr-2 text-yellow-500" />
                        <b>{language === "am" ? "የሥራ አይነት:" : "Employment Type:"}</b>{" "}
                        {v.employmentType}
                      </p>
                      <p>
                        <FaGraduationCap className="inline mr-2 text-green-500" />
                        <b>{language === "am" ? "ትምህርት ደረጃ:" : "Qualification:"}</b>{" "}
                        {v.qualification || "-"}
                      </p>
                      <p>
                        <FaBriefcase className="inline mr-2 text-red-500" />
                        <b>{language === "am" ? "ልምድ:" : "Experience:"}</b> {v.experience || "-"}
                      </p>
                      <p>
                        <FaDollarSign className="inline mr-2 text-teal-500" />
                        <b>{language === "am" ? "ደመወዝ:" : "Salary:"}</b> {v.salary || "Negotiable"}
                      </p>
                      <p>
                        <FaCalendarAlt className="inline mr-2 text-indigo-400" />
                        <b>{language === "am" ? "የተፈጠረበት ቀን:" : "Post Date:"}</b>{" "}
                        {new Date(v.postDate).toDateString()}
                      </p>
                      <p>
                        <FaCalendarAlt className="inline mr-2 text-red-400" />
                        <b>{language === "am" ? "መዝጊያ ቀን:" : "Deadline:"}</b>{" "}
                        {new Date(v.deadline).toDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(v)}
                    className="mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform"
                  >
                    {language === "am" ? "ይመልከቱ" : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-2">
            {language === "am" ? "ምንም ክፍት የሥራ ቦታዎች የሉም።" : "No vacancies available"}
          </p>
        )}
      </div>

      {/* Application Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleApply}
            className={`p-6 rounded-xl shadow-2xl w-full max-w-md space-y-5 transition-all duration-300 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
            }`}
          >
            <h3 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-300">
              {language === "am" ? "ይመልከቱ:" : "Apply for:"} {selectedVacancy.title}
            </h3>
            <input
              type="text"
              name="name"
              placeholder={language === "am" ? "ስም" : "Your Name"}
              value={application.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={language === "am" ? "ኢሜይል" : "Your Email"}
              value={application.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={language === "am" ? "ስልክ ቁጥር" : "Phone Number"}
              value={application.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx,.zip"
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-shadow shadow-lg"
              >
                {language === "am" ? "ያስገቡ" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedVacancy(null)}
                className="flex-1 bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-shadow shadow-lg"
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
