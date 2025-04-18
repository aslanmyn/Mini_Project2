import React, { useState } from 'react';
import axios from 'axios';

const ResumeMatch = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleMatch = async () => {
    if (!file) return setError('Please upload your resume first.');
    const resumeForm = new FormData();
    resumeForm.append('resume', file);

    const token = localStorage.getItem('access_token');
    const vacancyId = localStorage.getItem('vacancyId');

    try {
      setLoading(true);
      const uploadRes = await axios.post('http://127.0.0.1:8000/resume/upload/', resumeForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const resumeId = uploadRes.data.resume_id;

      const matchRes = await axios.post(
          'http://127.0.0.1:8000/resume/match/',
          { resume_id: resumeId, vacancy_id: vacancyId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      setFeedback(matchRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to match resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#f4f6f8] to-white">
        <div className="w-full max-w-3xl card fade-in">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🎯 Match Your Resume</h2>

          <div className="mb-6">
            <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
            />
          </div>

          <button
              onClick={handleMatch}
              disabled={loading}
              className="btn w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Matching...' : 'Upload & Match'}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {feedback && (
              <div className="mt-8 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h3 className="text-xl font-semibold text-blue-800">✅ Match Score</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{feedback.rating}/10</p>
                </div>

                <Section title="Skill Gaps" data={feedback.skill_gaps} />
                <Section title="Formatting Suggestions" data={feedback.formatting_suggestions} />
                <Section title="Keyword Optimization" data={feedback.keyword_optimization} />
                <Section title="Recommendations" data={feedback.recommendations} />

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 italic">
                    Based on AI-powered analysis of your uploaded resume.
                  </p>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

// Reusable section component
const Section = ({ title, data }) => {
  if (!data || data.length === 0) return null;
  return (
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
          {data.map((item, i) => (
              <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
  );
};

export default ResumeMatch;
