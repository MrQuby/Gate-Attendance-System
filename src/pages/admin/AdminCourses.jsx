import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import CourseModal from '../../components/modals/CourseModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { getCourses, addCourse, updateCourse, deleteCourse, subscribeToCourses } from '../../api/courses';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentCourse, setCurrentCourse] = useState({
    courseId: '',
    courseName: '',
    description: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Initial fetch
    getCourses()
      .then(data => {
        setCourses(data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses');
      });

    // Set up real-time listener
    const unsubscribe = subscribeToCourses((updatedCourses) => {
      setCourses(updatedCourses);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Modal handlers
  const openModal = (mode, course = null) => {
    setModalMode(mode);
    setCurrentCourse(course || { courseId: '', courseName: '', description: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCourse({ courseId: '', courseName: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await addCourse(currentCourse);
        toast.success('Course added successfully');
      } else if (modalMode === 'edit') {
        await updateCourse(currentCourse.id, currentCourse);
        toast.success('Course updated successfully');
      }
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(modalMode === 'add' ? 'Failed to add course' : 'Failed to update course');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      toast.success('Course archived successfully');
      setDeleteModal({ isOpen: false, courseId: null, courseName: '' });
    } catch (error) {
      console.error('Error archiving course:', error);
      toast.error('Failed to archive course');
    }
  };

  const openDeleteModal = (course) => {
    setDeleteModal({
      isOpen: true,
      courseId: course.id,
      courseName: course.courseName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      courseId: null,
      courseName: ''
    });
  };

  const filteredCourses = courses.filter((course) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      course.courseId.toLowerCase().includes(searchTerm) ||
      course.courseName.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm)
    );
  });

  // Calculate pagination
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Course List" />

        <div className="flex-1 overflow-auto">
          <main className="p-8">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('add')}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
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
                  {currentItems.map((course, index) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
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
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => openModal('view', course)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => openModal('edit', course)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => openDeleteModal(course)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCourses.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            )}

            {/* Course Modal */}
            <CourseModal
              isOpen={isModalOpen}
              onClose={closeModal}
              mode={modalMode}
              currentCourse={currentCourse}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              isOpen={deleteModal.isOpen}
              onClose={closeDeleteModal}
              onConfirm={() => handleDelete(deleteModal.courseId)}
              title="Delete Course"
              message={`Are you sure you want to delete "${deleteModal.courseName}"? This action cannot be undone.`}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
