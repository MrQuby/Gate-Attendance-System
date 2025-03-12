import React from 'react';
import PropTypes from 'prop-types';

const StudentModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  currentStudent, 
  onSubmit, 
  onChange,
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-lg w-full mx-2">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              {mode === 'add' ? 'Add New Student' : 
               mode === 'edit' ? 'Edit Student' : 'Student Details'}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {mode === 'add' ? 'Create a new student account in the system' : 
               mode === 'edit' ? 'Modify existing student details' : 'View student information'}
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
            {/* Student ID Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Student ID
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-id-card text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="studentId"
                  value={currentStudent.studentId}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter student ID"
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
                  value={currentStudent.name}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter full name"
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
                  value={currentStudent.email}
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
                  value={currentStudent.department}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  className={`pl-10 w-full rounded-lg border ${
                    mode === 'view' 
                      ? 'bg-gray-50 text-gray-500' 
                      : 'bg-white hover:border-gray-400 focus:border-blue-500'
                  } border-gray-300 shadow-sm p-2.5 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="college">College</option>
                  <option value="senior_high">Senior High</option>
                  <option value="junior_high">Junior High</option>
                </select>
              </div>
            </div>

            {/* Course Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Course
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-graduation-cap text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="course"
                  value={currentStudent.course}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter course"
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

            {/* RFID Tag Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                RFID Tag
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-tag text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="rfidTag"
                  value={currentStudent.rfidTag}
                  onChange={onChange}
                  disabled={mode === 'view'}
                  placeholder="Enter RFID tag"
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
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            {mode !== 'view' ? (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 
                    hover:bg-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                    transition-colors"
                >
                  Cancel
                </button>
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
                      {mode === 'add' ? 'Add Student' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-800 text-white rounded-lg shadow-sm text-sm font-medium 
                    hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                    transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Close
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

StudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
  currentStudent: PropTypes.shape({
    studentId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    department: PropTypes.string,
    course: PropTypes.string,
    rfidTag: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default StudentModal;
