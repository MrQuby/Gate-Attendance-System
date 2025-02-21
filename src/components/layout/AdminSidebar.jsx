import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              currentPath === '/admin/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/students"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/students') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-user-graduate"></i>
            <span>Student</span>
          </Link>

          <Link
            to="/admin/teachers"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/teachers') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Teachers</span>
          </Link>

          <Link
            to="/admin/courses"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/courses') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-book"></i>
            <span>Courses</span>
          </Link>

          <Link
            to="/admin/user-logs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              currentPath.startsWith('/admin/user-logs') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-history"></i>
            <span>User Logs</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-lg w-full text-left"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
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
    </div>
  );
};

export default AdminSidebar;
