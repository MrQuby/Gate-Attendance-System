import React from 'react';
import PropTypes from 'prop-types';

const TeacherModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  teacher, 
  onSubmit, 
  onInputChange,
  departments = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-lg w-full mx-2">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              {mode === 'add' ? 'Add New Teacher' : mode === 'edit' ? 'Edit Teacher' : 'View Teacher'}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {mode === 'add' ? 'Create a new teacher account' : mode === 'edit' ? 'Modify teacher details' : 'View teacher information'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="fas fa-times text-gray-500 text-xl"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4">
          <div className="space-y-4">
            {/* Teacher ID Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Teacher ID
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-id-card text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="teacherId"
                  value={teacher.teacherId}
                  onChange={onInputChange}
                  placeholder="Enter teacher ID"
                  className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                    bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            {/* Name Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="name"
                  value={teacher.name}
                  onChange={onInputChange}
                  placeholder="Enter full name"
                  className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                    bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={onInputChange}
                  placeholder="Enter email address"
                  className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                    bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            {/* Department Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Department
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-building text-gray-400"></i>
                </div>
                <select
                  name="department"
                  value={teacher.department}
                  onChange={onInputChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                    bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  disabled={mode === 'view'}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 
                  hover:bg-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                  transition-colors"
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {mode !== 'view' && (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    transition-colors"
                >
                  {mode === 'add' ? 'Create Teacher' : 'Update Teacher'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

TeacherModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
  teacher: PropTypes.shape({
    id: PropTypes.string,
    teacherId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    department: PropTypes.string,
    courses: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  )
};

export default TeacherModal;
