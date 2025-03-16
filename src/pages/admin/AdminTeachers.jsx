import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, subscribeToTeachers } from '../../api/teachers';
import { getDepartments, subscribeToDepartments } from '../../api/departments';
import { getClasses, subscribeToClasses } from '../../api/classes';
import { getCourses, subscribeToCourses } from '../../api/courses';
import { toast } from 'react-toastify';
import TeacherModal from '../../components/modals/TeacherModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentTeacher, setCurrentTeacher] = useState({
    teacherId: '',
    name: '',
    email: '',
    department: '',
    courses: [],
    classes: []
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentMap, setDepartmentMap] = useState({});
  const [classMap, setClassMap] = useState({});
  const [courseMap, setCourseMap] = useState({});

  useEffect(() => {
    const unsubscribeTeachers = subscribeToTeachers((updatedTeachers) => {
      if (updatedTeachers) {
        setTeachers(updatedTeachers);
      }
    });

    const unsubscribeDepts = subscribeToDepartments((updatedDepartments) => {
      if (updatedDepartments) {
        setDepartments(updatedDepartments);
        
        // Create department map for display
        const deptMap = {};
        updatedDepartments.forEach(dept => {
          deptMap[dept.id] = dept.name;
        });
        setDepartmentMap(deptMap);
      }
    });
    
    const unsubscribeClasses = subscribeToClasses((updatedClasses) => {
      if (updatedClasses) {
        setClasses(updatedClasses);
        
        // Create class map for display
        const classMap = {};
        updatedClasses.forEach(cls => {
          classMap[cls.id] = cls;
        });
        setClassMap(classMap);
      }
    });
    
    const unsubscribeCourses = subscribeToCourses((updatedCourses) => {
      if (updatedCourses) {
        setCourses(updatedCourses);
        
        // Create course map for display
        const courseMap = {};
        updatedCourses.forEach(course => {
          courseMap[course.id] = {
            name: course.courseName,
            code: course.courseId
          };
        });
        setCourseMap(courseMap);
      }
    });

    return () => {
      unsubscribeTeachers();
      unsubscribeDepts();
      unsubscribeClasses();
      unsubscribeCourses();
    };
  }, []);

  const handleOpenModal = (mode, teacher = null) => {
    setModalMode(mode);
    setCurrentTeacher(teacher || {
      teacherId: '',
      name: '',
      email: '',
      department: '',
      courses: [],
      classes: []
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        await addTeacher({
          ...currentTeacher,
          isActive: true
        });
        toast.success('Teacher added successfully');
      } else if (modalMode === 'edit') {
        await updateTeacher(currentTeacher.id, currentTeacher);
        toast.success('Teacher updated successfully');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error('Failed to save teacher');
    }
  };

  const handleOpenDeleteModal = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTeacherToDelete(null);
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    
    try {
      await deleteTeacher(teacherToDelete.id);
      toast.success('Teacher archived successfully');
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error archiving teacher:', error);
      toast.error('Failed to archive teacher');
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher => {
    const searchTerm = searchQuery.toLowerCase();
    const departmentName = departmentMap[teacher.department] || '';
    
    // Get class names for this teacher
    const teacherClassNames = (teacher.classes || [])
      .map(classId => {
        const classItem = classMap[classId];
        const course = courseMap[classItem?.courseId];
        if (classItem && course) {
          return `${course.code} ${classItem.name}`;
        }
        return '';
      })
      .join(' ');
    
    return (
      teacher.name.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm) ||
      teacher.teacherId.toLowerCase().includes(searchTerm) ||
      departmentName.toLowerCase().includes(searchTerm) ||
      teacherClassNames.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination
  const indexOfLastTeacher = currentPage * itemsPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Format class names for display
  const getClassesDisplay = (classIds) => {
    if (!classIds || classIds.length === 0) return '-';
    
    return classIds
      .map(id => {
        const classItem = classMap[id];
        const course = courseMap[classItem?.courseId];
        if (classItem && course) {
          return `${course.code} ${classItem.name}`;
        }
        return '';
      })
      .filter(name => name)
      .join(', ');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Teacher Management" />
        
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
                <SearchBar
                  placeholder="Search Teachers"
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
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
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classes
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTeachers.map((teacher, index) => (
                    <tr key={teacher.id} className="hover:bg-lamaPurpleLight">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {indexOfFirstTeacher + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.teacherId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {departmentMap[teacher.department] || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getClassesDisplay(teacher.classes)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('view', teacher)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('edit', teacher)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenDeleteModal(teacher)}
                            title="Archive"
                          >
                            <i className="fas fa-archive"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentTeachers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No teachers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTeachers.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredTeachers.length}
              />
            )}
          </main>
        </div>
      </div>

      {/* Teacher Modal */}
      <TeacherModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        teacher={currentTeacher}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        departments={departments}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteTeacher}
        title="Archive Teacher"
        message={`Are you sure you want to archive ${teacherToDelete?.name}? This teacher will be hidden from the system but can be restored later.`}
      />
    </div>
  );
};

export default AdminTeachers;
