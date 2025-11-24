import React, { useState } from 'react';

const LeaveApplication = () => {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit leave application API call
    alert("Leave request submitted!");
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Leave Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={form.startDate} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input 
            type="date" 
            name="endDate" 
            value={form.endDate} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Reason</label>
          <textarea 
            name="reason" 
            value={form.reason} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
            rows="4" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveApplication;
