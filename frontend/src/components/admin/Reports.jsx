import React from 'react';

const Reports = () => {
  // TODO: Fetch report data from backend or generate summaries

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">HR Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-bold text-lg mb-2">Total Employees</h3>
          <p className="text-3xl">150</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-bold text-lg mb-2">Active Vacancies</h3>
          <p className="text-3xl">12</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-bold text-lg mb-2">Pending Leave Requests</h3>
          <p className="text-3xl">7</p>
        </div>
      </div>

      {/* Add charts or more detailed reports as you develop */}
    </div>
  );
};

export default Reports;
