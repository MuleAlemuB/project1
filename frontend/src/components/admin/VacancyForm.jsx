import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

const VacancyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    positionType: '',
    educationLevel: '',
    experience: '',
    salary: '',
    location: '',
    description: '',
    lastDate: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('http://localhost:5000/api/admin/vacancies', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Vacancy posted successfully!');
      setFormData({
        title: '',
        department: '',
        positionType: '',
        educationLevel: '',
        experience: '',
        salary: '',
        location: '',
        description: '',
        lastDate: '',
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error posting vacancy');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl border-t-8 border-blue-500">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Post a Vacancy
        </h2>

        {message && (
          <p className="mb-6 text-center text-green-600 font-semibold">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <select
            name="positionType"
            value={formData.positionType}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select Position Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
          <input
            type="text"
            name="educationLevel"
            placeholder="Education Level"
            value={formData.educationLevel}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="experience"
            placeholder="Required Experience"
            value={formData.experience}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          ></textarea>
          <input
            type="date"
            name="lastDate"
            value={formData.lastDate}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            Post Vacancy <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VacancyForm;
