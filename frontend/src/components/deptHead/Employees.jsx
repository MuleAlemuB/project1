import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming your backend has an endpoint to get employees by department head's dept
    axios.get('/api/employees/my-department') 
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Department Employees</h1>
      {employees.length === 0 ? (
        <p>No employees found in your department.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="border px-4 py-2">Photo</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  <img
                    src={emp.photo || '/default-avatar.png'}
                    alt={emp.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border px-4 py-2">{emp.firstName} {emp.lastName}</td>
                <td className="border px-4 py-2">{emp.position || 'N/A'}</td>
                <td className="border px-4 py-2">{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;
