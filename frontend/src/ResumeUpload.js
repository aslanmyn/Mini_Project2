import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccessMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in first.');
        return;
      }

      const response = await axios.post('http://localhost:8000/resume/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('File uploaded and parsed successfully.');
      setParsedData(response.data.parsed_data);

      // Save the resume ID using a consistent key
      localStorage.setItem('resume_id', response.data.resume_id);
      localStorage.removeItem('resumeId'); // Cleanup old key if exists

      setTimeout(() => {
        navigate('/match');
      }, 2000);
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Upload Your Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Upload Resume
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
        </form>

        {parsedData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Parsed Data:</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
