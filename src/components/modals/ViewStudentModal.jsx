import React from 'react';

const ViewStudentModal = ({ isOpen, onClose, student }) => {
  if (!isOpen) return null;

  const getAbbreviatedCourse = (course) => {
    const courseMap = {
      "Bachelor of Science in Information Technology": "BSIT",
      "Bachelor of Science in Computer Science": "BSCS",
      "Bachelor of Science in Education": "BSED",
      "Bachelor of Science in Business Administration": "BSBA",
      "Bachelor of Science in Criminology": "BS-CRIM"
    };
    return courseMap[course] || course;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="relative flex items-center justify-center p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-600 flex items-center">
            <i className="fas fa-user-graduate mr-2"></i>
            View Student
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-id-card text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.studentId} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-fingerprint text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.studentRFID} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-user text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.firstName} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-user text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.lastName} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-envelope text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.email} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-graduation-cap text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={getAbbreviatedCourse(student.course)} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-calendar text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.birthDate} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-layer-group text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.yearLevel} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-venus-mars text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.gender} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-phone text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.phone} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-user-friends text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.guardianName} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <i className="fas fa-phone text-blue-500 mr-3"></i>
                <input 
                  type="text" 
                  value={student.guardianContact} 
                  readOnly 
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <i className="fas fa-map-marker-alt text-blue-500 mr-3"></i>
              <input 
                type="text" 
                value={student.address} 
                readOnly 
                className="bg-transparent w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;
