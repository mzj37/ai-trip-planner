import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-lg font-bold text-gray-900">WanderAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/plan" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
              Plan Trip
            </Link>
            {user && (
              <Link to="/my-trips" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
                My Trips
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/plan" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 py-2 text-sm font-medium">
              Plan Trip
            </Link>
            {user && (
              <Link to="/my-trips" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 py-2 text-sm font-medium">
                My Trips
              </Link>
            )}
            {user ? (
              <>
                <span className="text-gray-500 py-2 text-sm">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-left text-red-500 py-2 text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;