import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Welcome to your Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Attendance Days</h2>
          <p className="text-2xl mt-2">120</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Leave Requests</h2>
          <p className="text-2xl mt-2">2 Pending</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Notifications</h2>
          <p className="text-2xl mt-2">5 New</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
