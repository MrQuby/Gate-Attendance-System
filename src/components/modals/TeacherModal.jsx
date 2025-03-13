import React from 'react';
import PropTypes from 'prop-types';

const TeacherModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  currentTeacher, 
  onSubmit, 
  onChange,
  loading,
  departments = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-lg w-full mx-2 transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              {mode === 'add' ? 'Add New Teacher' : 
               mode === 'edit' ? 'Edit Teacher' : 'Teacher Details'}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {mode === 'add' ? 'Create a new teacher account in the system' : 
               mode === 'edit' ? 'Modify existing teacher details' : 'View teacher information'}
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
                  value={currentTeacher.teacherId}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter teacher ID"
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' 
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
                />
              </div>
            </div>

            {/* First Name Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                First Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={currentTeacher.firstName}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter first name"
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' 
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
                />
              </div>
            </div>

            {/* Last Name Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Last Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={currentTeacher.lastName}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter last name"
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' 
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
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
                  value={currentTeacher.email}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter email address"
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' 
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
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
                  value={currentTeacher.department}
                  onChange={onChange}
                  disabled={mode === 'view' || loading}
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' || loading
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
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
                  disabled={loading}
                  className={`px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                    ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    flex items-center gap-2`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className={`fas ${mode === 'add' ? 'fa-plus' : 'fa-save'}`}></i>
                      {mode === 'add' ? 'Add Teacher' : 'Save Changes'}
                    </>
                  )}
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
  currentTeacher: PropTypes.shape({
    teacherId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    department: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  departments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};

export default TeacherModal;
