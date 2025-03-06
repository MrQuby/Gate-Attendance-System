import React, { useState, useEffect } from 'react';
import { getDepartments, addDepartment, updateDepartment, deleteDepartment, restoreDepartment, subscribeToDepartments } from '../../api/departments';
import DepartmentModal from '../../components/modals/DepartmentModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import { toast } from 'react-toastify';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    setLoading(true);

    // Initial fetch
    getDepartments()
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments');
        setLoading(false);
      });

    // Set up real-time listener
    const unsubscribe = subscribeToDepartments((updatedDepartments) => {
      setDepartments(updatedDepartments);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (mode, department = null) => {
    setModalMode(mode);
    setCurrentDepartment(department || { name: '', code: '', description: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentDepartment({ name: '', code: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addDepartment(currentDepartment);
        toast.success('Department added successfully');
      } else if (modalMode === 'edit') {
        await updateDepartment(currentDepartment.id, currentDepartment);
        toast.success('Department updated successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting department:', error);
      toast.error('Failed to save department');
    }
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await deleteDepartment(departmentToDelete.id);
      toast.success('Department archived successfully');
      setDeleteModalOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      console.error('Error archiving department:', error);
      toast.error('Failed to archive department');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDepartmentToDelete(null);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  const filteredDepartments = departments.filter((department) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      department.name.toLowerCase().includes(searchTerm) ||
      department.code.toLowerCase().includes(searchTerm) ||
      department.description.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Department Management" />
      
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
                  Add Department
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
                    placeholder="Search Departments"
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDepartments.map((department) => (
                      <tr 
                        key={department.id} 
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{department.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{department.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">{department.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal('view', department)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', department)}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(department)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredDepartments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No departments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <DepartmentModal
              isOpen={modalOpen}
              onClose={handleCloseModal}
              mode={modalMode}
              currentDepartment={currentDepartment}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              loading={loading}
            />
          </main>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Archive Department"
        message={`Are you sure you want to archive the department '${departmentToDelete?.name}'? The department will be hidden but can be restored later.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminDepartments;
