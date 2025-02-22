import React, { useState } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  // Sample data - replace with actual data from your backend
  const courses = [
    {
      courseId: 'ACT',
      courseName: 'Associate in Computer Technology',
      description: 'A two-year course focused on IT and computer systems.',
    },
    {
      courseId: 'BSBA',
      courseName: 'Bachelor of Science in Business Administration',
      description: 'A course covering various aspects of business administration.',
    },
    {
      courseId: 'BSCS',
      courseName: 'Bachelor of Science in Computer Science',
      description: 'A four-year program on computing, algorithms, and new developments in the field.',
    },
    {
      courseId: 'BSCRIM',
      courseName: 'Bachelor of Science in Criminology',
      description: 'A course focused on criminology and criminal justice.',
    },
    {
      courseId: 'BSED',
      courseName: 'Bachelor of Science in Education',
      description: 'A course for students aiming to become educators.',
    },
    {
      courseId: 'BSHM',
      courseName: 'Bachelor of Science in Hospitality Management',
      description: 'A course focused on hospitality and management.',
    },
    {
      courseId: 'BSIT',
      courseName: 'Bachelor of Science in Information Technology',
      description: 'A four-year course focused on IT and computer systems.',
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      course.courseId.toLowerCase().includes(searchTerm) ||
      course.courseName.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm)
    );
  });

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCourses(courses.map(course => course.courseId));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold">Course List</h2>
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
                Add Course
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
                  placeholder="Search Courses"
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

          {/* Courses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCourses.length === courses.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.courseId)}
                        onChange={() => handleSelectCourse(course.courseId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.courseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.courseName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {/* TODO: View course */}}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {/* TODO: Delete course */}}
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

export default AdminCourses;
