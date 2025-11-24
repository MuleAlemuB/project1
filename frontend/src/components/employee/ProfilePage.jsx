import React, { useState } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: 'Abebe',
    lastName: 'Alemu',
    email: 'Abebe@example.com',
    phone: '+251912345678',
  });

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  const handleSave = () => {
    // TODO: Update profile API call
    alert("Profile saved!");
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input 
            name="firstName" 
            value={profile.firstName} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input 
            name="lastName" 
            value={profile.lastName} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input 
            name="email" 
            value={profile.email} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
            type="email"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input 
            name="phone" 
            value={profile.phone} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2" 
          />
        </div>
        <button 
          onClick={handleSave} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
