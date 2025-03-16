import React, { useState, useEffect } from 'react';
import { getClasses, addClass, updateClass, deleteClass, restoreClass, subscribeToClasses } from '../../api/classes';
import { getDepartments } from '../../api/departments';
import { getCourses } from '../../api/courses';
import ClassModal from '../../components/modals/ClassModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentClass, setCurrentClass] = useState({
    name: '',
    capacity: '',
    yearLevel: '',
    departmentId: '',
    courseId: ''
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [departmentMap, setDepartmentMap] = useState({});
  const [courseMap, setCourseMap] = useState({});

  useEffect(() => {
    // Set up real-time listener for classes
    const unsubscribe = subscribeToClasses((updatedClasses) => {
      setClasses(updatedClasses);
    });

    // Fetch departments and courses for display
    const fetchDepartmentsAndCourses = async () => {
      try {
        // Fetch departments
        const departmentsData = await getDepartments();
        const deptMap = {};
        departmentsData.forEach(dept => {
          deptMap[dept.id] = dept.name;
        });
        setDepartmentMap(deptMap);

        // Fetch courses
        const coursesData = await getCourses();
        const courseMap = {};
        coursesData.forEach(course => {
          courseMap[course.id] = {
            name: course.courseName,
            code: course.courseId
          };
        });
        setCourseMap(courseMap);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.error('Failed to load reference data');
      }
    };

    fetchDepartmentsAndCourses();

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (mode, classItem = null) => {
    setModalMode(mode);
    setCurrentClass(classItem || {
      name: '',
      capacity: '',
      yearLevel: '',
      departmentId: '',
      courseId: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentClass({
      name: '',
      capacity: '',
      yearLevel: '',
      departmentId: '',
      courseId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await addClass(currentClass);
        toast.success('Class added successfully');
      } else if (modalMode === 'edit') {
        await updateClass(currentClass.id, currentClass);
        toast.success('Class updated successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting class:', error);
      toast.error('Failed to save class');
    }
  };

  const handleOpenDeleteModal = (classItem) => {
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    try {
      await deleteClass(classToDelete.id);
      toast.success('Class archived successfully');
      setDeleteModalOpen(false);
      setClassToDelete(null);
    } catch (error) {
      console.error('Error archiving class:', error);
      toast.error('Failed to archive class');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setClassToDelete(null);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredClasses = classes.filter((classItem) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      classItem.name.toLowerCase().includes(searchTerm) ||
      classItem.yearLevel.toLowerCase().includes(searchTerm) ||
      (departmentMap[classItem.departmentId] && departmentMap[classItem.departmentId].toLowerCase().includes(searchTerm)) ||
      (courseMap[classItem.courseId] && 
        (courseMap[classItem.courseId].name.toLowerCase().includes(searchTerm) || 
         courseMap[classItem.courseId].code.toLowerCase().includes(searchTerm)))
    );
  });

  // Calculate pagination
  const totalItems = filteredClasses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Class Management" />
      
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal('add')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Class
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
                    placeholder="Search Classes"
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((classItem, index) => (
                    <tr 
                      key={classItem.id} 
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {classItem.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{classItem.yearLevel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {courseMap[classItem.courseId] 
                            ? `${courseMap[classItem.courseId].name} (${courseMap[classItem.courseId].code})` 
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {departmentMap[classItem.departmentId] || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{classItem.capacity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('view', classItem)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('edit', classItem)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenDeleteModal(classItem)}
                            title="Archive"
                          >
                            <i className="fas fa-archive"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredClasses.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No classes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredClasses.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            )}

            <ClassModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              mode={modalMode}
              currentClass={currentClass}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
            />
          </main>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDelete}
        title="Archive Class"
        message={`Are you sure you want to archive the class '${classToDelete?.name}'? The class will be hidden but can be restored later.`}
      />
    </div>
  );
};

export default AdminClasses;
