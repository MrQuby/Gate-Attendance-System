import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, subscribeToTeachers } from '../../api/teachers';
import { toast } from 'react-toastify';
import TeacherModal from '../../components/modals/TeacherModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import Pagination from '../../components/common/Pagination';

const AdminTeachers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentTeacher, setCurrentTeacher] = useState({
    teacherId: '',
    name: '',
    email: '',
    department: '',
    courses: []
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Initial fetch
    getTeachers()
      .then(data => {
        setTeachers(data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
        toast.error('Failed to fetch teachers');
      });

    // Set up real-time listener
    const unsubscribe = subscribeToTeachers((updatedTeachers) => {
      setTeachers(updatedTeachers);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (teacher.teacherId?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.name?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.email?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.department?.toLowerCase().includes(searchTerm) || '')
    );
  });

  // Calculate pagination
  const totalItems = filteredTeachers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleOpenModal = (mode, teacher = null) => {
    setModalMode(mode);
    setCurrentTeacher(teacher || { teacherId: '', name: '', email: '', department: '', courses: [] });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeacher({ teacherId: '', name: '', email: '', department: '', courses: [] });
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
        await addTeacher(currentTeacher);
        toast.success('Teacher added successfully');
      } else if (modalMode === 'edit') {
        await updateTeacher(currentTeacher.id, currentTeacher);
        toast.success('Teacher updated successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error(modalMode === 'add' ? 'Failed to add teacher' : 'Failed to update teacher');
    }
  };

  const handleOpenDeleteModal = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;

    try {
      await deleteTeacher(teacherToDelete.id);
      toast.success('Teacher archived successfully');
      setDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch (error) {
      console.error('Error archiving teacher:', error);
      toast.error('Failed to archive teacher');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Teachers" />

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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((teacher, index) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.teacherId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('view', teacher)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenModal('edit', teacher)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition duration-200"
                            onClick={() => handleOpenDeleteModal(teacher)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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
                totalItems={totalItems}
              />
            )}

            {/* Teacher Modal */}
            <TeacherModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              mode={modalMode}
              currentTeacher={currentTeacher}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDelete}
              title="Archive Teacher"
              message={`Are you sure you want to archive the teacher "${teacherToDelete?.name}"? The teacher will be hidden but can be restored later.`}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers;
