import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import LogoutModal from '../modals/LogoutModal';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-[#2C3E50] text-white">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <img src="/graduation-cap.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold">SCC-ITECH SOCIETY</h1>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg ${
              currentPath === '/admin/dashboard' ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-th-large w-6 text-center"></i>
            <span className="ml-4">Dashboard</span>
          </Link>

          <Link
            to="/admin/students"
            className={`flex items-center px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/students') ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-user-graduate w-6 text-center"></i>
            <span className="ml-4">Students</span>
          </Link>

          <Link
            to="/admin/teachers"
            className={`flex items-center px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/teachers') ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-chalkboard-teacher w-6 text-center"></i>
            <span className="ml-4">Teachers</span>
          </Link>

          <Link
            to="/admin/courses"
            className={`flex items-center px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/courses') ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-book w-6 text-center"></i>
            <span className="ml-4">Courses</span>
          </Link>

          <Link
            to="/admin/user-logs"
            className={`flex items-center px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/user-logs') ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-history w-6 text-center"></i>
            <span className="ml-4">User Logs</span>
          </Link>

          <button
            className="flex items-center px-4 py-3 hover:bg-blue-600 rounded-lg w-full text-left"
            onClick={() => setShowLogoutModal(true)}
          >
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            <span className="ml-4">Logout</span>
          </button>
        </nav>
      </div>

      {/* User Info at Bottom */}
      <div className="absolute bottom-0 w-64 p-4 bg-[#243342]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-400">admin@scc.edu.com</p>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AdminSidebar;
