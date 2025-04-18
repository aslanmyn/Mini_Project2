import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VacancyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    experience_required: '',
    location: '',
    job_type: 'full_time',
    salary_min: '',
    salary_max: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/vacancies/vacancies/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching vacancy:', err);
        setError('Failed to load vacancy details.');
      }
    };

    if (id) fetchVacancy();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:8000/vacancies/vacancies/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/profile');
    } catch (err) {
      console.error('Error updating vacancy:', err);
      setError('Failed to update vacancy.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden fade-in">
        <div className="bg-indigo-600 text-white px-6 py-4">
          <h1 className="text-3xl font-bold">✏️ Edit Job Vacancy</h1>
          <p className="text-indigo-100">Make changes to your job listing</p>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
              <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Job Title*</label>
              <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Job Description*</label>
              <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={5}
                  required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Required Skills*</label>
              <input
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Experience (years)*</label>
              <input
                  type="number"
                  name="experience_required"
                  value={formData.experience_required}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  min={0}
                  required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Job Type</label>
              <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Salary Min ($)</label>
              <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Salary Max ($)</label>
              <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-gray-200 px-5 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
            >
              {loading ? 'Updating...' : 'Update Vacancy'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default VacancyEdit;
