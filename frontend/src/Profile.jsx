import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userVacancies, setUserVacancies] = useState([]);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndVacancies = async () => {
      try {
        const userRes = await axios.get('http://localhost:8000/users/api/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(userRes.data);

        const vacanciesRes = await axios.get('http://localhost:8000/vacancies/vacancies/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = userRes.data.id;
        const filteredVacancies = vacanciesRes.data.filter(
            (vacancy) => vacancy.recruiter === userId
        );
        setUserVacancies(filteredVacancies);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    if (token) fetchProfileAndVacancies();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/vacancies/vacancies/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserVacancies((prev) => prev.filter((vacancy) => vacancy.id !== id));
    } catch (err) {
      console.error('Error deleting vacancy:', err);
    }
  };

  return (
      <div className="max-w-5xl mx-auto px-6 py-10 fade-in">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">👤 Your Profile</h1>

        {userInfo && (
            <div className="card mb-10">
              <p><strong>Username:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Role:</strong> {userInfo.role}</p>
            </div>
        )}

        {(userInfo?.role === 'recruiter' || userInfo?.role === 'admin') && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">📄 Your Vacancies</h2>
                <button
                    onClick={() => navigate('/vacancies/create')}
                    className="btn bg-blue-600 hover:bg-blue-700"
                >
                  + New Vacancy
                </button>
              </div>

              {userVacancies.length === 0 ? (
                  <p className="text-gray-500">You haven’t posted any vacancies yet.</p>
              ) : (
                  <ul className="space-y-6">
                    {userVacancies.map((vacancy) => (
                        <li key={vacancy.id} className="card shadow border border-gray-200">
                          <h3 className="text-xl font-bold mb-1 text-gray-800">{vacancy.title}</h3>
                          <p className="text-gray-600 mb-2">{vacancy.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📍 Location: {vacancy.location}</p>
                            <p>💼 Type: {vacancy.job_type}</p>
                            <p>💰 Salary: ${vacancy.salary_min} – ${vacancy.salary_max}</p>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => navigate(`/vacancies/edit/${vacancy.id}`)}
                                className="btn bg-yellow-400 hover:bg-yellow-500 text-white"
                            >
                              Edit
                            </button>
                            <button
                                onClick={() => handleDelete(vacancy.id)}
                                className="btn bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                    ))}
                  </ul>
              )}
            </div>
        )}
      </div>
  );
};

export default Profile;
