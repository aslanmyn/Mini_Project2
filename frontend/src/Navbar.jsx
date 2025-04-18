import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-all"
          >
            HeadHanter
          </Link>

          {/* Links */}
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium text-md">
            <li>
              <Link
                  to="/vacancies"
                  className="hover:text-blue-600 transition-colors"
              >
                Vacancies
              </Link>
            </li>
            <li>
              <Link
                  to="/about"
                  className="hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
                <>
                  <Link
                      to="/login"
                      className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                      to="/register"
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Register
                  </Link>
                </>
            ) : (
                <>
                  <Link to="/profile">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold shadow hover:bg-blue-700 transition cursor-pointer">
                      U
                    </div>
                  </Link>
                  <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-500 transition"
                  >
                    Logout
                  </button>
                </>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
