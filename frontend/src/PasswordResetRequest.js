import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/users/api/auth/password/reset/', {
        email,
      });
      setMessage('✅ Password reset link has been sent to your email.');
    } catch (err) {
      setError('❌ Failed to send password reset link. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Your Password</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handlePasswordResetRequest} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Reset Link
          </button>
          {message && (
            <p className="text-sm text-green-600 text-center font-medium">{message}</p>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
