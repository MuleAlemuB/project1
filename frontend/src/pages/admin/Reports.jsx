// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Reports = () => {
  const [stats, setStats] = useState({ employees: 0, vacancies: 0, leaves: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats'); // token is automatically included
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Admin Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-200 dark:bg-blue-700 text-gray-800 dark:text-white rounded shadow-lg flex items-center justify-center font-semibold text-lg">
          Employees: {stats.employees}
        </div>
        <div className="p-6 bg-green-200 dark:bg-green-700 text-gray-800 dark:text-white rounded shadow-lg flex items-center justify-center font-semibold text-lg">
          Vacancies: {stats.vacancies}
        </div>
        <div className="p-6 bg-red-200 dark:bg-red-700 text-gray-800 dark:text-white rounded shadow-lg flex items-center justify-center font-semibold text-lg">
          Leave Requests: {stats.leaves}
        </div>
      </div>
    </div>
  );
};

export default Reports;
