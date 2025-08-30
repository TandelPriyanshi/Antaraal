import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-journal-cream via-background to-journal-sage p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Journal Entries Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Journal Entries</h2>
            <p className="text-gray-600 mb-6">Start writing your thoughts and reflections.</p>
            <Link
              to="/journal/new"
              className="inline-block px-4 py-2 bg-[#5A3A32] text-white rounded-md hover:bg-[#4a3029] transition-colors"
            >
              New Entry
            </Link>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Entries:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity yet</p>
            <p className="text-sm mt-2">Start writing to see your activity here</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
