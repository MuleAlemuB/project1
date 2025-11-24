import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('/api/users/me')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <img
          src={profile.photo || '/default-avatar.png'}
          alt={profile.name}
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        {/* Add more fields if needed */}
      </div>
    </div>
  );
};

export default ProfilePage;
