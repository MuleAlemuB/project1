import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [absences, setAbsences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/employees/my-department')
      .then(res => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (empId, value) => {
    setAbsences(prev => ({ ...prev, [empId]: Number(value) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/attendance', { absences });
      setMessage('Attendance saved successfully.');
    } catch (error) {
      setMessage('Error saving attendance.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
      <form onSubmit={handleSubmit}>
        <table className="min-w-full bg-white shadow rounded mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Absence Days</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{emp.firstName} {emp.lastName}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={absences[emp._id] || ''}
                    onChange={e => handleChange(emp._id, e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Attendance;
