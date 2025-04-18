import React, { useEffect, useState } from 'react';

const VacancyCard = ({ vacancy, userRole }) => {
  const skillsArray = vacancy.required_skills
      ? vacancy.required_skills.split(',').map((skill) => skill.trim())
      : [];

  const handleMatch = () => {
    localStorage.setItem('vacancyId', vacancy.id);
    window.location.href = '/match-resume';
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mb-6">
        <h3 className="text-xl font-bold text-gray-800">{vacancy.title}</h3>
        <p className="text-gray-600 my-2">{vacancy.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{vacancy.job_type}</span>
          <span className="text-gray-500 text-sm">{vacancy.location || 'Location not specified'}</span>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700">Required Skills:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {skillsArray.map((skill, index) => (
                <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700">Experience Required:</h4>
          <p className="text-gray-600">{vacancy.experience_required} years</p>
        </div>
        {(vacancy.salary_min || vacancy.salary_max) && (
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-700">Salary:</h4>
              <p className="text-gray-600">
                {vacancy.salary_min ? `$${vacancy.salary_min}` : 'Negotiable'} -{' '}
                {vacancy.salary_max ? `$${vacancy.salary_max}` : 'Negotiable'}
              </p>
            </div>
        )}

        {userRole === 'job_seeker' && (
            <div className="mt-4 text-right">
              <button
                  onClick={handleMatch}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Match Me!
              </button>
            </div>
        )}
      </div>
  );
};

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch('http://127.0.0.1:8000/users/api/profile/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        if (!profileRes.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileRes.json();
        setUserRole(profileData.role);

        const vacanciesRes = await fetch('http://127.0.0.1:8000/vacancies/vacancies/');
        if (!vacanciesRes.ok) throw new Error('Failed to fetch vacancies');
        const vacanciesData = await vacanciesRes.json();
        setVacancies(vacanciesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold mt-20">Loading vacancies...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500 mt-20">{error}</div>;
  }

  return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-white to-blue-50 fade-in">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">💼 Open Vacancies</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {vacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} userRole={userRole} />
            ))}
          </div>
        </div>
      </div>
  );
};

export default Vacancies;
