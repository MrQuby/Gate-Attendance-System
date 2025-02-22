import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import CourseModal from '../../components/modals/CourseModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentCourse, setCurrentCourse] = useState({
    courseId: '',
    courseName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: ''
  });

  // Fetch courses from Firebase
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  };

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
    setLoading(true);

    try {
      if (modalMode === 'add') {
        await addDoc(collection(db, 'courses'), currentCourse);
        toast.success('Course added successfully');
      } else if (modalMode === 'edit') {
        const courseRef = doc(db, 'courses', currentCourse.id);
        await updateDoc(courseRef, currentCourse);
        toast.success('Course updated successfully');
      }
      
      fetchCourses();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(modalMode === 'add' ? 'Failed to add course' : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success('Course deleted successfully');
      fetchCourses();
      setDeleteModal({ isOpen: false, courseId: null, courseName: '' });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
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

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCourses(courses.map(course => course.id));
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
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleSelectCourse(course.id)}
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
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-2 rounded-lg transition duration-200"
                          onClick={() => openModal('view', course)}
                        >
                          <i className="fas fa-eye fa-lg"></i>
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-2 rounded-lg transition duration-200"
                          onClick={() => openModal('edit', course)}
                        >
                          <i className="fas fa-edit fa-lg"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-2 rounded-lg transition duration-200"
                          onClick={() => openDeleteModal(course)}
                        >
                          <i className="fas fa-trash fa-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Course Modal */}
          <CourseModal
            isOpen={isModalOpen}
            onClose={closeModal}
            mode={modalMode}
            currentCourse={currentCourse}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            loading={loading}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(deleteModal.courseId)}
            title="Delete Course"
            message={`Are you sure you want to delete "${deleteModal.courseName}"? This action cannot be undone.`}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminCourses;
