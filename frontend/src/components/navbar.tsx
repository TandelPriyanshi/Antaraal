import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div>
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 z-20 h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#c78d7a]" />
          <h1 className="text-xl font-bold text-gray-800">Antaraal</h1>
        </div>
        {/* Navigation Links - Hide on Dashboard and Journal */}
        {isHome && (
          <nav className="flex items-center space-x-8 text-gray-700 font-medium">
            <a href="#features" className="hover:text-[#8b4a3c] transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#8b4a3c] transition">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#8b4a3c] transition">
              Benefits
            </a>
          </nav>
        )}


        {/* Right Side */}
        <div className="flex items-center space-x-6 text-gray-700 font-medium">
          {isAuthenticated ? (
            
            <Link
              to={isDashboard ? "/" : "/dashboard"}
              className="bg-[#8b4a3c] text-white p-2 rounded-md hover:bg-[#733d31] transition flex items-center justify-center"
              title={isDashboard ? "Go Home" : "Go to Dashboard"}
            >
              {isDashboard ? (
                // Home Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h2a2 2 0 002-2v-7m-6 0h6"
                  />
                </svg>
              ) : (
                // Dashboard Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              )}
            </Link>
          ) : (
            <>
              <Link to="/signin" className="hover:text-[#8b4a3c] transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#8b4a3c] text-white px-4 py-2 rounded-md hover:bg-[#733d31] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
