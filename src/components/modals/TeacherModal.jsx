import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../api/classes';
import { getCourses } from '../../api/courses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const TeacherModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  teacher, 
  onSubmit, 
  onInputChange,
  departments = []
}) => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [classesByCourse, setClassesByCourse] = useState({});
  
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (teacher.classes) {
      setSelectedClasses(teacher.classes);
      
      // Determine selected courses based on selected classes
      if (classes.length > 0) {
        const coursesSet = new Set();
        teacher.classes.forEach(classId => {
          const classItem = classes.find(c => c.id === classId);
          if (classItem && classItem.courseId) {
            coursesSet.add(classItem.courseId);
          }
        });
        setSelectedCourses(Array.from(coursesSet));
      }
    } else {
      setSelectedClasses([]);
      setSelectedCourses([]);
    }
  }, [teacher.classes, classes]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesData = await getCourses();
      setCourses(coursesData);
      
      // Fetch classes
      const classesData = await getClasses();
      setClasses(classesData);
      
      // Group classes by course
      const groupedClasses = {};
      classesData.forEach(classItem => {
        const courseId = classItem.courseId;
        if (!groupedClasses[courseId]) {
          groupedClasses[courseId] = [];
        }
        groupedClasses[courseId].push(classItem);
      });
      
      setClassesByCourse(groupedClasses);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    let updatedCourses;
    
    if (e.target.checked) {
      updatedCourses = [...selectedCourses, courseId];
    } else {
      updatedCourses = selectedCourses.filter(id => id !== courseId);
      
      // Remove classes from this course from selected classes
      const classesFromCourse = classesByCourse[courseId] || [];
      const classIdsFromCourse = classesFromCourse.map(c => c.id);
      const updatedClasses = selectedClasses.filter(id => !classIdsFromCourse.includes(id));
      
      setSelectedClasses(updatedClasses);
      onInputChange({
        target: {
          name: 'classes',
          value: updatedClasses
        }
      });
    }
    
    setSelectedCourses(updatedCourses);
  };
  
  const handleClassChange = (e) => {
    const classId = e.target.value;
    let updatedClasses;
    
    if (e.target.checked) {
      updatedClasses = [...selectedClasses, classId];
    } else {
      updatedClasses = selectedClasses.filter(id => id !== classId);
    }
    
    setSelectedClasses(updatedClasses);
    
    // Update the teacher object with the new classes
    onInputChange({
      target: {
        name: 'classes',
        value: updatedClasses
      }
    });
  };
  
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

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={teacher.firstName || ''}
                    onChange={onInputChange}
                    placeholder="Enter first name"
                    className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                      bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    disabled={mode === 'view'}
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
                    value={teacher.lastName || ''}
                    onChange={onInputChange}
                    placeholder="Enter last name"
                    className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm p-2.5 
                      bg-white hover:border-gray-400 focus:border-blue-500 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                    disabled={mode === 'view'}
                  />
                </div>
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
            
            {/* Courses Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assigned Courses
              </label>
              {loading ? (
                <div className="flex items-center justify-center p-4 border rounded-lg">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 mr-2" />
                  <span>Loading courses...</span>
                </div>
              ) : (
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                  {courses.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {courses.map(course => {
                        const isChecked = selectedCourses.includes(course.id);
                        return (
                          <div key={course.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`course-${course.id}`}
                              value={course.id}
                              checked={isChecked}
                              onChange={handleCourseChange}
                              disabled={mode === 'view'}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`course-${course.id}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {course.courseId}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No courses available</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Classes Field */}
            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assigned Classes
              </label>
              {loading ? (
                <div className="flex items-center justify-center p-4 border rounded-lg">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 mr-2" />
                  <span>Loading classes...</span>
                </div>
              ) : (
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                  {selectedCourses.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCourses.map(courseId => {
                        const course = courses.find(c => c.id === courseId);
                        const courseClasses = classesByCourse[courseId] || [];
                        if (!course || courseClasses.length === 0) return null;
                        
                        return (
                          <div key={courseId} className="border-b pb-2 last:border-b-0 last:pb-0">
                            <h4 className="font-medium text-gray-700 mb-2">{course.courseId}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {courseClasses.map(classItem => {
                                const isChecked = selectedClasses.includes(classItem.id);
                                return (
                                  <div key={classItem.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`class-${classItem.id}`}
                                      value={classItem.id}
                                      checked={isChecked}
                                      onChange={handleClassChange}
                                      disabled={mode === 'view'}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor={`class-${classItem.id}`}
                                      className="ml-2 block text-sm text-gray-700"
                                    >
                                      {classItem.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Please select courses first to view available classes</p>
                  )}
                </div>
              )}
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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    department: PropTypes.string,
    courses: PropTypes.arrayOf(PropTypes.string),
    classes: PropTypes.arrayOf(PropTypes.string)
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
