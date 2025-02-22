import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import TeacherModal from '../../components/modals/TeacherModal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

const AdminTeachers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  // Real-time teachers data subscription
  useEffect(() => {
    const teachersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'teacher')
    );

    const unsubscribe = onSnapshot(teachersQuery, 
      (snapshot) => {
        const teachersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeachers(teachersList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching teachers:', error);
        toast.error('Failed to fetch teachers');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (teacher.idNumber?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.firstName?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.lastName?.toLowerCase().includes(searchTerm) || '') ||
      (teacher.email?.toLowerCase().includes(searchTerm) || '')
    );
  });

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTeachers(teachers.map(teacher => teacher.id));
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

  const handleAddTeacher = () => {
    setModalMode('add');
    setSelectedTeacher(null);
    setModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  const handleViewTeacher = (teacher) => {
    setModalMode('view');
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  const handleDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'users', teacherToDelete.id));
      toast.success('Teacher deleted successfully');
      setDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedTeachers.map((teacherId) =>
          deleteDoc(doc(db, 'users', teacherId))
        )
      );
      toast.success('Selected teachers deleted successfully');
      setSelectedTeachers([]);
      setBulkMenuOpen(false);
    } catch (error) {
      console.error('Error deleting teachers:', error);
      toast.error('Failed to delete selected teachers');
    }
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
                onClick={handleAddTeacher}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Teacher
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  disabled={selectedTeachers.length === 0}
                >
                  Bulk Actions
                  <i className="fas fa-chevron-down"></i>
                </button>
                {bulkMenuOpen && selectedTeachers.length > 0 && (
                  <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <button
                      onClick={handleBulkDelete}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      <i className="fas fa-trash-alt mr-2"></i>
                      Delete Selected
                    </button>
                  </div>
                )}
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
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="flex items-center gap-2 text-gray-500">
                  <i className="fas fa-spinner fa-spin text-xl"></i>
                  <span>Loading teachers...</span>
                </div>
              </div>
            ) : teachers.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32 text-gray-500">
                <i className="fas fa-users text-4xl mb-2"></i>
                <span>No teachers found</span>
              </div>
            ) : (
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
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => handleSelectTeacher(teacher.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.idNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewTeacher(teacher)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2.5 py-2 rounded-lg transition duration-200"
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-2 rounded-lg transition duration-200"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-2 rounded-lg transition duration-200"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Teacher Modal */}
        <TeacherModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          teacher={selectedTeacher}
          mode={modalMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setTeacherToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${teacherToDelete?.firstName} ${teacherToDelete?.lastName}? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default AdminTeachers;
