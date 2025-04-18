import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobMatch = () => {
  const [matches, setMatches] = useState([]);
  const [vacancyId, setVacancyId] = useState(localStorage.getItem('vacancyId') || '');
  const [resumeId, setResumeId] = useState(localStorage.getItem('resume_id') || '');
  const [error, setError] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [formattingIssues, setFormattingIssues] = useState([]);

  const handleMatch = async () => {
    if (!vacancyId || !resumeId) {
      setError('Please select a vacancy and upload a resume first.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in first.');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/resume/match/', {
        resume_id: parseInt(resumeId),
        vacancy_id: parseInt(vacancyId),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMatchScore(response.data.match_score);
      setKeywordSuggestions(response.data.suggested_keywords);
      setFormattingIssues(response.data.formatting_issues);
      setError('');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Something went wrong.');
      } else {
        setError('Could not fetch job matches.');
      }
      console.error('Match error:', error);
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Please log in first.');
          return;
        }

        const response = await axios.get('http://localhost:8000/vacancies/vacancies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMatches(response.data);
      } catch (error) {
        setError('Could not fetch vacancies.');
        console.error('Vacancy fetch error:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleResumeUpload = async (e) => {
    const formData = new FormData();
    formData.append('resume', e.target.files[0]);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in first.');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/resume/upload/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newResumeId = response.data.resume_id;
      setResumeId(newResumeId);
      localStorage.setItem('resume_id', newResumeId);
      localStorage.removeItem('resumeId');

      setError('');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to upload resume.');
      } else {
        setError('Failed to upload resume.');
      }
      console.error('Resume upload error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Job Matches</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Upload Resume</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleResumeUpload}
            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vacancy" className="block text-sm font-medium text-gray-700">Select Vacancy</label>
          <select
            id="vacancy"
            name="vacancy"
            value={vacancyId}
            onChange={(e) => {
              setVacancyId(e.target.value);
              localStorage.setItem('vacancyId', e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a vacancy</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>{match.title}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleMatch}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Match Me
        </button>

        {matchScore !== null && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Match Score</h3>
            <p className="text-lg text-blue-600">{matchScore}%</p>
          </div>
        )}

        {keywordSuggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Suggested Keywords</h3>
            <ul className="list-disc pl-5">
              {keywordSuggestions.map((keyword, index) => (
                <li key={index} className="text-sm text-gray-700">{keyword}</li>
              ))}
            </ul>
          </div>
        )}

        {formattingIssues.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Formatting Issues</h3>
            <ul className="list-disc pl-5">
              {formattingIssues.map((issue, index) => (
                <li key={index} className="text-sm text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatch;
