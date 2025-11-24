// src/pages/ApplyVacancy.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplyVacancy = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    resume: null,
    coverLetter: "",
  });
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(""); // ✅ New state for errors

  // Fetch vacancies on mount
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vacancies");
        setVacancies(res.data);
      } catch (err) {
        console.error("Error fetching vacancies:", err);
        setError("Failed to fetch vacancies. Please try again later.");
      }
    };
    fetchVacancies();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    if (e.target.name === "resume") {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle vacancy selection
  const handleVacancySelect = (e) => {
    const vacancyId = e.target.value;
    const vacancy = vacancies.find((v) => v._id === vacancyId);
    setSelectedVacancy(vacancy);
    setFormData({ ...formData, department: vacancy?.department, position: vacancy?.position });
    setError(""); // Clear any previous error
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedVacancy) {
      setError("Please select a vacancy from the dropdown");
      return;
    }

    const data = new FormData();
    data.append("name", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("resume", formData.resume);
    data.append("vacancyId", selectedVacancy._id);
    data.append("coverLetter", formData.coverLetter);

    try {
      await axios.post(`http://localhost:5000/api/applications/apply/${selectedVacancy._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Application submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        resume: null,
        coverLetter: "",
      });
      setSelectedVacancy(null);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Apply for Vacancy</h1>

      {/* Display success or error messages */}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Select Vacancy</label>
          <select
            name="vacancy"
            value={selectedVacancy?._id || ""}
            onChange={handleVacancySelect}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a vacancy</option>
            {vacancies.map((v) => (
              <option key={v._id} value={v._id}>
                {v.department} - {v.position}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div className="col-span-2 flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Submit
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                position: "",
                department: "",
                resume: null,
                coverLetter: "",
              })
            }
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyVacancy;
