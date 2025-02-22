import React, { useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminTeachers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  
  // Sample data - replace with actual data from your backend
  const teachers = [
    {
      teacherId: 'SCC-1112',
      firstName: 'Alvin',
      lastName: 'Lagoras',
      email: 'alvinlag24@gmail.com',
    },
    {
      teacherId: 'SCC-1113',
      firstName: 'Alvin',
      lastName: 'Lagoras',
      email: 'test1@gmail.com',
    },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      teacher.teacherId.toLowerCase().includes(searchTerm) ||
      teacher.firstName.toLowerCase().includes(searchTerm) ||
      teacher.lastName.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTeachers(teachers.map(teacher => teacher.teacherId));
    } else {
      setSelectedTeachers([]);
    }
  };

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

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

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold">Teachers</h2>
            <div className="text-right">
              <div className="text-gray-600 font-semibold">{formattedDate}</div>
              <div className="text-gray-500">{formattedTime}</div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Teacher
              </button>
              
              <div className="relative">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Bulk Actions
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Teachers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.length === teachers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.teacherId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.teacherId)}
                        onChange={() => handleSelectTeacher(teacher.teacherId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.teacherId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {/* TODO: View teacher */}}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {/* TODO: Delete teacher */}}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTeachers;
