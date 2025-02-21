import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/teacher/Dashboard';
import Students from './pages/teacher/Students';
import StudentDetails from './pages/teacher/StudentDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Teacher Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/student-details" element={<StudentDetails />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
