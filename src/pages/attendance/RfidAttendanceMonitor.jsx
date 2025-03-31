import React, { useState, useEffect, useRef } from 'react';
import { subscribeToLatestAttendance, recordCheckIn, isStudentCheckedInToday } from '../../api/attendance';
import { subscribeToCourses } from '../../api/courses';
import { toast } from 'react-toastify';
import defaultAvatar from '../../assets/default-avatar.jpg';
import schoolLogo from '../../assets/school-logo.jpg';
import depedLogo from '../../assets/deped-logo.jpg';
import schoolSeal from '../../assets/school-seal.jpg';
import { getStudents, subscribeToStudents } from '../../api/students';

const RfidAttendanceMonitor = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rfidInput, setRfidInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentStudents, setRecentStudents] = useState([]);
  const scanTimeoutRef = useRef(null);
  const resetTimerRef = useRef(null);
  
  // Set default featured student
  const featuredStudent = currentStudent || {
    studentId: '',
    firstName: '',
    lastName: '',
    fullName: '',
    course: '',
    status: isCheckedIn ? (isCheckingOut ? 'CHECKED OUT' : 'CHECKED IN') : 'WAITING'
  };

  // Get the latest 7 attendance records for the table
  const latestAttendanceRecords = attendanceRecords.slice(0, 7);

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Subscribe to all attendance records (not just today's)
  useEffect(() => {
    // Use subscribeToLatestAttendance with a higher limit to get more records
    const unsubscribe = subscribeToLatestAttendance(20, (records) => {
      console.log('Received attendance records:', records);
      setAttendanceRecords(records);
    });
    
    return () => unsubscribe();
  }, []);

  // Subscribe to students data
  useEffect(() => {
    const unsubscribe = subscribeToStudents((studentsList) => {
      console.log('Received students data:', studentsList);
      setStudents(studentsList);
    });
    
    return () => unsubscribe();
  }, []);

  // Subscribe to courses data
  useEffect(() => {
    const unsubscribe = subscribeToCourses((coursesList) => {
      console.log('Received courses data:', coursesList);
      setCourses(coursesList);
    });
    
    return () => unsubscribe();
  }, []);

  // Set up keyboard event listener for RFID scanner
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only process if we're not already processing a scan and not in a form field
      if (isProcessing || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // If it's the first character of a new scan, start the timeout
      if (rfidInput === '') {
        // Clear any existing timeout
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
        
        // Set a timeout to process the complete scan
        scanTimeoutRef.current = setTimeout(() => {
          if (rfidInput.length > 0) {
            processRfidScan(rfidInput);
            setRfidInput('');
          }
        }, 500); // 500ms timeout for complete scan
      }

      // Append the character to the RFID input if it's a valid character
      // Most RFID scanners will send Enter key at the end
      if (e.key === 'Enter') {
        // Process the scan immediately when Enter is pressed
        clearTimeout(scanTimeoutRef.current);
        processRfidScan(rfidInput);
        setRfidInput('');
      } else if (e.key.length === 1) { // Only single characters
        setRfidInput(prev => prev + e.key);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [rfidInput, isProcessing]);

  // Format date and time
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDateTime.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTime = () => {
    return currentDateTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  // Helper function to get the course name from course ID
  const getCourseName = (courseId) => {
    if (!courseId) return 'No Course';
    
    const course = courses.find(c => c.id === courseId);
    if (course) {
      return course.courseId;
    }
    
    // Fallback to courseId if course not found
    return courseId;
  };

  // Process RFID scan
  const processRfidScan = async (rfidTag) => {
    try {
      setIsProcessing(true);
      console.log('Processing RFID tag:', rfidTag);
      
      // Find student by RFID tag to check if they're already checked in
      const student = students.find(s => s.rfidTag === rfidTag);
      
      if (!student) {
        toast.error('Student data not found in local cache');
        setIsProcessing(false);
        return;
      }
      
      // Check if student is already checked in today
      const existingRecord = await isStudentCheckedInToday(student.studentId);
      const isAlreadyCheckedIn = !!existingRecord;
      
      // Use the recordCheckIn function which handles both check-in and check-out
      await recordCheckIn(rfidTag);
      
      // Set the student in the UI
      setCurrentStudent(student);
      
      // Update UI based on whether this was a check-in or check-out
      if (isAlreadyCheckedIn) {
        // This was a check-out
        setIsCheckedIn(false);
        setIsCheckingOut(true);
        
        // Add to recent students with OUT status
        setRecentStudents(prev => {
          // Create a new array with current student at the beginning
          const newRecent = [
            {
              ...student,
              timeIn: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              }),
              status: 'OUT'
            },
            // Add previous recent students (up to 2 to keep 3 total)
            ...prev.slice(0, 2)
          ];
          return newRecent;
        });
        
        toast.success(`${student.firstName} ${student.lastName} checked out successfully`);
      } else {
        // This was a check-in
        setIsCheckedIn(true);
        setIsCheckingOut(false);
        
        // If there's a current student, move them to recent students
        if (currentStudent) {
          // Add current student to the beginning of recent students
          setRecentStudents(prev => {
            // Create a new array with current student at the beginning
            const newRecent = [
              {
                ...currentStudent,
                timeIn: new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                }),
                status: 'IN'
              },
              // Add previous recent students (up to 2 to keep 3 total)
              ...prev.slice(0, 2)
            ];
            return newRecent;
          });
        } else {
          // Add this student to recent with IN status
          setRecentStudents(prev => {
            const newRecent = [
              {
                ...student,
                timeIn: new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                }),
                status: 'IN'
              },
              ...prev.slice(0, 2)
            ];
            return newRecent;
          });
        }
        
        toast.success(`${student.firstName} ${student.lastName} checked in successfully`);
      }
      
      // Reset after 30 seconds (student stays visible longer)
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      
      resetTimerRef.current = setTimeout(() => {
        // Move current student to recent students when resetting if not already moved
        if (currentStudent && isCheckedIn) {
          setRecentStudents(prev => {
            // Check if this student is already in the recent list
            const isAlreadyInRecent = prev.some(s => s.id === currentStudent.id);
            
            if (!isAlreadyInRecent) {
              const newRecent = [
                {
                  ...currentStudent,
                  timeIn: new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  }),
                  status: 'IN'
                },
                ...prev.slice(0, 2)
              ];
              return newRecent;
            }
            
            return prev;
          });
        }
        
        setCurrentStudent(null);
        setIsCheckedIn(false);
        setIsCheckingOut(false);
        setIsProcessing(false);
      }, 30000); // 30 seconds for better visibility
      
      // Allow new processing sooner
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing RFID scan:', error);
      toast.error(error.message || 'Failed to process attendance');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img src={schoolLogo} alt="College Logo" className="mr-3 h-12 w-12" />
          <div className="text-white">
            <h1 className="text-xl font-bold">ST. CECILIA'S COLLEGE - CEBU, INC.</h1>
            <p className="text-sm">Ward II, Minglanilla, Cebu</p>
          </div>
        </div>
        <div className="flex items-center">
          <img src={depedLogo} alt="DepEd Logo" className="mr-2 h-10 w-10" />
          <img src={schoolSeal} alt="School Seal" className="h-10 w-10" />
        </div>
      </div>

      {/* Date/Time Banner */}
      <div className="bg-white rounded mb-4 p-4 text-center text-blue-600 text-2xl font-bold">
        {formatDate()} {formatTime()}
      </div>

      {/* RFID Input Status (hidden but shows status) */}
      <div className="sr-only">
        Current RFID Input: {rfidInput}
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left Panel - Featured Student */}
        <div className="bg-white rounded p-4 w-1/3">
          <div className="border border-gray-300 p-2 mb-3">
            <div className="w-full h-[400px] flex items-center justify-center overflow-hidden bg-gray-100">
              <img 
                src={currentStudent?.profileImageURL || defaultAvatar} 
                alt="Student" 
                className="w-full h-full object-fill"
                style={{ width: '450px', height: '450px' }}
              />
            </div>
          </div>
          <div className={`${isCheckedIn ? 'bg-green-500' : (isCheckingOut ? 'bg-red-500' : 'bg-gray-400')} text-white text-center p-3 font-bold mb-3`}>
            {isCheckedIn ? 'CHECKED IN' : (isCheckingOut ? 'CHECKED OUT' : 'WAITING')}
          </div>
          <div className="text-center font-bold text-xl">
            <p>{featuredStudent.firstName} {featuredStudent.lastName}</p>
            <p>{getCourseName(featuredStudent.course)}</p>
          </div>
        </div>

        {/* Right Panel - Students List */}
        <div className="w-2/3">
          {/* Student Cards - Now showing recent students from our state */}
          <div className="flex gap-4 mb-4">
            {recentStudents.length > 0 ? (
              recentStudents.map((student, index) => (
                <div key={index} className="bg-white rounded p-4 flex-1 flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-8 mb-3">
                    {student.profileImageURL ? (
                      <img 
                        src={student.profileImageURL || defaultAvatar} 
                        alt={student.firstName} 
                        className="mr-2 rounded-full h-6 w-6" 
                      />
                    ) : (
                      <div className="h-6 w-6 bg-gray-500 rounded-full mr-2"></div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{student.firstName} {student.lastName}</p>
                    <p>{getCourseName(student.course)}</p>
                  </div>
                  <div className={`${student.status === 'OUT' ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 mt-2 font-bold rounded`}>
                    {student.status || 'IN'}
                  </div>
                </div>
              ))
            ) : (
              // Placeholder cards when no recent students
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded p-4 flex-1 flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-8 mb-3">
                    <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-400">No Data</p>
                    <p className="text-gray-400">-</p>
                  </div>
                  <div className="bg-gray-300 text-white px-3 py-1 mt-2 font-bold rounded">
                    -
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Attendance Table - Now showing only the latest 7 records */}
          <div className="bg-white rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">Recent Attendance</h2>
              <span className="text-sm text-gray-500">Showing latest {latestAttendanceRecords.length} records</span>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-600 p-2 text-left">Student ID</th>
                  <th className="border border-gray-600 p-2 text-left">Full Name</th>
                  <th className="border border-gray-600 p-2 text-left">Course</th>
                  <th className="border border-gray-600 p-2 text-left">Date</th>
                  <th className="border border-gray-600 p-2 text-left">Time In</th>
                  <th className="border border-gray-600 p-2 text-left">Time Out</th>
                  <th className="border border-gray-600 p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestAttendanceRecords.length > 0 ? (
                  latestAttendanceRecords.map((record) => {
                    console.log('Rendering record:', record);
                    const student = students.find(s => s.studentId === record.studentId) || {};
                    console.log('Found student for record:', student);
                    return (
                      <tr key={record.id} className="border-b border-gray-200">
                        <td className="border-l border-r border-gray-300 p-2">{record.studentId}</td>
                        <td className="border-r border-gray-300 p-2 flex items-center">
                          {student.profileImageURL ? (
                            <img 
                              src={student.profileImageURL || defaultAvatar} 
                              alt="" 
                              className="mr-2 rounded-full h-6 w-6" 
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-500 rounded-full mr-2"></div>
                          )}
                          {record.studentName}
                        </td>
                        <td className="border-r border-gray-300 p-2">{record.course || getCourseName(student.course)}</td>
                        <td className="border-r border-gray-300 p-2">{record.date}</td>
                        <td className="border-r border-gray-300 p-2 text-green-600 font-medium">{record.timeIn}</td>
                        <td className="border-r border-gray-300 p-2 text-red-600 font-medium">{record.timeOut || 'N/A'}</td>
                        <td className={`border-r border-gray-300 p-2 font-medium ${record.status === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.status}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="border border-gray-300 p-4 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfidAttendanceMonitor;
