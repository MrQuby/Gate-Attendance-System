import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/TeacherSidebar';  

const StudentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No student data available</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold">Student Details</h2>
          </div>
        </header>

        {/* Student Details Content */}
        <main className="p-8">
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-4xl text-gray-400"></i>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{student.firstName} {student.lastName}</h1>
                <p className="text-gray-600">{student.idNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{student.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Course</h3>
                <p className="text-gray-900">{student.course}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Year & Level</h3>
                <p className="text-gray-900">{student.yearLevel}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Attendance</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {/* We can add attendance records here */}
                  <p className="text-gray-500 text-center py-4">No recent attendance records</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDetails;
