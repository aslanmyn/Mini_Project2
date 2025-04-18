import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg'; // или подставь любую иконку/иллюстрацию

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');

    const handleMatchClick = () => {
        navigate('/vacancies');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f0f4ff] to-white px-6 py-20">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 text-center fade-in">
                <img
                    src={logo}
                    alt="HeadHanter Logo"
                    className="w-20 h-20 mx-auto mb-6 animate-pulse"
                />

                <h1 className="text-5xl font-extrabold text-[#0f172a] mb-4">
                    Welcome to <span className="text-blue-600">HeadHanter</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Your AI-powered assistant to match resumes with job descriptions, detect skill gaps, and boost your hiring potential.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                    {!isLoggedIn ? (
                        <Link to="/login" className="btn bg-blue-600 hover:bg-blue-700">
                            Login to Get Started
                        </Link>
                    ) : (
                        <button onClick={handleMatchClick} className="btn bg-green-600 hover:bg-green-700">
                            Match Me!
                        </button>
                    )}
                    <Link to="/about" className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
                        Learn More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
