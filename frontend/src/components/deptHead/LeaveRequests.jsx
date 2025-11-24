import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    axios.get('/api/leave-requests/department') // fetch leave requests for dept head's department
      .then(res => setRequests(res.data))
      .catch(err => setError('Failed to load leave requests'))
      .finally(() => setLoading(false));
  }, []);

  const approveRequest = async id => {
    setApprovingId(id);
    try {
      await axios.post(`/api/leave-requests/${id}/approve`);
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      setError('Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) return <p>Loading leave requests...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  if (requests.length === 0) return <p>No leave requests at this time.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">From</th>
            <th className="border px-4 py-2">To</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{req.employeeName}</td>
              <td className="border px-4 py-2">{new Date(req.fromDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{new Date(req.toDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{req.reason}</td>
              <td className="border px-4 py-2">{req.status}</td>
              <td className="border px-4 py-2">
                {req.status === 'Pending' && (
                  <button
                    onClick={() => approveRequest(req._id)}
                    disabled={approvingId === req._id}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    {approvingId === req._id ? 'Approving...' : 'Approve'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
