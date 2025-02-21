import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentRFID: '',
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    address: '',
    birthDate: '',
    phone: '',
    gender: '',
    yearLevel: '',
    guardianName: '',
    guardianContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const courses = [
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Education',
    'Bachelor of Science in Business Administration',
    'Bachelor of Science in Criminology',
  ];

  const yearLevels = ['1st year', '2nd year', '3rd year', '4th year'];
  const genders = ['Male', 'Female', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
      if (!formData.studentRFID) newErrors.studentRFID = 'RFID is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    } else if (step === 2) {
      if (!formData.course) newErrors.course = 'Course is required';
      if (!formData.yearLevel) newErrors.yearLevel = 'Year level is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const studentData = {
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'students'), studentData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === step 
              ? 'bg-blue-600 text-white'
              : currentStep > step
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? '✓' : step}
          </div>
          {step < 3 && (
            <div className={`w-20 h-1 mx-2 ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderError = (field) => (
    errors[field] && (
      <p className="mt-1 text-sm text-red-600 animate-fadeIn">
        {errors[field]}
      </p>
    )
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-slideIn">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Student ID
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-id-card text-blue-500"></i>
          </div>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.studentId ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter student ID"
          />
        </div>
        {renderError('studentId')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Student RFID
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-fingerprint text-blue-500"></i>
          </div>
          <input
            type="text"
            name="studentRFID"
            value={formData.studentRFID}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.studentRFID ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter RFID number"
          />
        </div>
        {renderError('studentRFID')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-user text-blue-500"></i>
          </div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter first name"
          />
        </div>
        {renderError('firstName')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-user text-blue-500"></i>
          </div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter last name"
          />
        </div>
        {renderError('lastName')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-envelope text-blue-500"></i>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter email address"
          />
        </div>
        {renderError('email')}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-slideIn">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-graduation-cap text-blue-500"></i>
          </div>
          <select
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-8 py-2 border ${
              errors.course ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fas fa-chevron-down text-gray-400"></i>
          </div>
        </div>
        {renderError('course')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Year Level
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-layer-group text-blue-500"></i>
          </div>
          <select
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-8 py-2 border ${
              errors.yearLevel ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          >
            <option value="">Select Year Level</option>
            {yearLevels.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fas fa-chevron-down text-gray-400"></i>
          </div>
        </div>
        {renderError('yearLevel')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-venus-mars text-blue-500"></i>
          </div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-8 py-2 border ${
              errors.gender ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          >
            <option value="">Select Gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fas fa-chevron-down text-gray-400"></i>
          </div>
        </div>
        {renderError('gender')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-calendar text-blue-500"></i>
          </div>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
              errors.birthDate ? 'border-red-300' : 'border-gray-300'
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
        </div>
        {renderError('birthDate')}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-slideIn">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-phone text-blue-500"></i>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Guardian Name
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-user-friends text-blue-500"></i>
          </div>
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleInputChange}
            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter guardian's name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Guardian Contact
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <i className="fas fa-phone text-blue-500"></i>
          </div>
          <input
            type="tel"
            name="guardianContact"
            value={formData.guardianContact}
            onChange={handleInputChange}
            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter guardian's contact number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1 relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
            <i className="fas fa-map-marker-alt text-blue-500"></i>
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter complete address"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Add New Student
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please fill in the student information
          </p>
        </div>

        {/* Step indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Student
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
