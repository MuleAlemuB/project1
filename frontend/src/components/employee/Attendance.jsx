import React from 'react';

const Attendance = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Attendance Record</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Example rows, replace with dynamic data */}
          <tr>
            <td className="border p-2">2025-08-01</td>
            <td className="border p-2 text-green-600">Present</td>
          </tr>
          <tr>
            <td className="border p-2">2025-08-02</td>
            <td className="border p-2 text-red-600">Absent</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
