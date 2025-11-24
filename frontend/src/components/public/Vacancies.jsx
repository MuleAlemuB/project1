import React, { useEffect, useState } from 'react';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    // TODO: fetch vacancies from backend API
    setVacancies([
      { id: 1, title: 'Software Engineer', department: 'Computer Science', description: 'Develop and maintain software.' },
      { id: 2, title: 'HR Officer', department: 'Human Resources', description: 'Manage recruitment and employee relations.' },
    ]);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Available Vacancies</h2>
      {vacancies.length === 0 ? (
        <p>No vacancies available currently.</p>
      ) : (
        <ul>
          {vacancies.map(vacancy => (
            <li key={vacancy.id} className="border rounded p-4 mb-4 shadow-sm">
              <h3 className="text-xl font-bold">{vacancy.title}</h3>
              <p className="italic">{vacancy.department}</p>
              <p className="mb-2">{vacancy.description}</p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => alert(`Apply for vacancy: ${vacancy.title}`)}
              >
                Apply Now
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Vacancies;
