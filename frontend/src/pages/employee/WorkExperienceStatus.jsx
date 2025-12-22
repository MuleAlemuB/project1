import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const WorkExperienceStatus = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const { data } = await axiosInstance.get("/api/work-experience");
    const filtered = data.filter((r) => r.employee._id === user._id);
    setRequests(filtered);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">My Work Experience Requests</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Reason</th>
            <th>Status</th>
            <th>Letter</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.reason}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "Approved" ? (
                  <>
                    {req.letterFile && (
                      <a
                        href={`http://localhost:5000/${req.letterFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download Letter
                      </a>
                    )}

                    {req.generatedLetterLink && (
                      <a
                        href={req.generatedLetterLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 underline ml-2"
                      >
                        Open Generated Letter
                      </a>
                    )}
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkExperienceStatus;
