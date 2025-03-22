import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/teacher/Dashboard';
import Students from './pages/teacher/Students';
import StudentDetails from './pages/teacher/StudentDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminClasses from './pages/admin/AdminClasses';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Teacher Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'departmentHead']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/students" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'departmentHead']}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student-details" 
          element={
            <ProtectedRoute allowedRoles={['teacher', 'departmentHead']}>
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/teachers" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTeachers />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/departments" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDepartments />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/courses" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/classes" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClasses />
            </ProtectedRoute>
          }
        />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
