import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).toUpperCase();

  useEffect(() => {
    // Create queries for students and teachers
    const studentsQuery = query(collection(db, 'students'));
    const teachersQuery = query(collection(db, 'users'), where('role', '==', 'teacher'));

    // Set up real-time listeners
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      setTotalStudents(snapshot.size);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching students:', error);
      setIsLoading(false);
    });

    const unsubscribeTeachers = onSnapshot(teachersQuery, (snapshot) => {
      setTotalTeachers(snapshot.size);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching teachers:', error);
      setIsLoading(false);
    });

    // Cleanup function to unsubscribe from listeners
    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold">Welcome back, ADMIN</h2>
            <div className="text-right">
              <div className="text-gray-600 font-semibold">{formattedDate}</div>
              <div className="text-gray-500">{formattedTime}</div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Students Card */}
            <div className="bg-blue-600 text-white rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-blue-500 rounded"></div>
                    </div>
                  ) : (
                    formatNumber(totalStudents)
                  )}
                </div>
                <i className="fas fa-user-graduate text-xl"></i>
              </div>
              <div className="text-sm">Total Students</div>
            </div>

            {/* Total Teachers Card */}
            <div className="bg-teal-500 text-white rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-teal-400 rounded"></div>
                    </div>
                  ) : (
                    formatNumber(totalTeachers)
                  )}
                </div>
                <i className="fas fa-chalkboard-teacher text-xl"></i>
              </div>
              <div className="text-sm">Total Teachers</div>
            </div>

            {/* Attendance Percentage Card */}
            <div className="bg-emerald-500 text-white rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-emerald-400 rounded"></div>
                    </div>
                  ) : (
                    '0%'
                  )}
                </div>
                <i className="fas fa-chart-pie text-xl"></i>
              </div>
              <div className="text-sm">Attendance Percentage</div>
            </div>

            {/* Checked In Today Card */}
            <div className="bg-red-500 text-white rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-red-400 rounded"></div>
                    </div>
                  ) : (
                    '0'
                  )}
                </div>
                <i className="fas fa-clock text-xl"></i>
              </div>
              <div className="text-sm">Checked In Today</div>
            </div>

            {/* Checked Out Today Card */}
            <div className="bg-orange-500 text-white rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-orange-400 rounded"></div>
                    </div>
                  ) : (
                    '0'
                  )}
                </div>
                <i className="fas fa-clock text-xl"></i>
              </div>
              <div className="text-sm">Checked Out Today</div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <p className="text-gray-500 text-center">No recent activity</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
