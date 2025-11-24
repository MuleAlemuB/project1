import React, { useEffect, useState } from 'react';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch leave requests from backend API
    // Example:
    // fetch('/api/leaves')
    //   .then(res => res.json())
    //   .then(data => {
    //     setRequests(data);
    //     setLoading(false);
    //   });
    setTimeout(() => {
      // Mock data
      setRequests([
        { id: 1, employeeName: 'John Doe', from: '2025-08-10', to: '2025-08-15', reason: 'Vacation', status: 'Pending' },
        { id: 2, employeeName: 'Jane Smith', from: '2025-08-12', to: '2025-08-14', reason: 'Medical', status: 'Approved' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id) => {
    // TODO: Call API to approve leave request
    alert(`Approved leave request ${id}`);
  };

  const handleReject = (id) => {
    // TODO: Call API to reject leave request
    alert(`Rejected leave request ${id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading leave requests...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
      {requests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
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
              <tr key={req.id} className="text-center">
                <td className="border px-4 py-2">{req.employeeName}</td>
                <td className="border px-4 py-2">{req.from}</td>
                <td className="border px-4 py-2">{req.to}</td>
                <td className="border px-4 py-2">{req.reason}</td>
                <td className="border px-4 py-2">{req.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApprove(req.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                      <button onClick={() => handleReject(req.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                    </>
                  )}
                  {req.status !== 'Pending' && <span className="italic">{req.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveRequests;
