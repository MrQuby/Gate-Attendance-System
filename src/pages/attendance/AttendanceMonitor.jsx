import React, { useState, useEffect } from 'react';
import { subscribeToTodayAttendance, recordCheckIn } from '../../api/students';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import defaultAvatar from '../../assets/default-avatar.png';

const AttendanceMonitor = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Subscribe to today's attendance records
  useEffect(() => {
    const unsubscribe = subscribeToTodayAttendance((records) => {
      setAttendanceRecords(records);
    });
    
    return () => unsubscribe();
  }, []);

  // Simulate RFID scan (in a real system, this would be triggered by hardware)
  const handleRfidScan = async (rfidTag) => {
    try {
      // In a real system, you would:
      // 1. Read the RFID tag from the hardware
      // 2. Look up the student by RFID tag
      // 3. Record attendance
      
      // For demo purposes, we'll simulate with mock data
      const mockStudent = {
        id: 'SCC-10005',
        studentId: 'SCC-10005',
        firstName: 'Mike',
        lastName: 'Cortez',
        course: 'BSED',
        rfidTag: 'ABC123',
        profileImageURL: '', // This would be the actual image URL
      };
      
      setCurrentStudent(mockStudent);
      
      // Record check-in
      await recordCheckIn({
        studentId: mockStudent.studentId,
        studentName: `${mockStudent.firstName} ${mockStudent.lastName}`,
        course: mockStudent.course,
        rfidTag: mockStudent.rfidTag,
        imageUrl: mockStudent.profileImageURL || '',
      });
      
      setIsCheckedIn(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setCurrentStudent(null);
        setIsCheckedIn(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error processing RFID scan:', error);
      toast.error('Failed to process attendance');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with school name and logo */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="School Logo" 
            className="h-12 w-12 mr-4"
          />
          <div>
            <h1 className="text-xl font-bold">ST. CECILIA'S COLLEGE - CEBU, INC.</h1>
            <p className="text-sm">Ward II, Minglanilla, Cebu</p>
          </div>
        </div>
        <div className="flex items-center">
          <img 
            src="/deped-logo.png" 
            alt="DepEd Logo" 
            className="h-10 w-10 mr-2"
          />
          <img 
            src="/school-seal.png" 
            alt="School Seal" 
            className="h-10 w-10"
          />
        </div>
      </header>
      
      {/* Date and Time Display */}
      <div className="bg-blue-600 text-white p-2 text-center">
        <h2 className="text-2xl font-bold">
          {format(currentDateTime, "EEEE, MMMM d, yyyy")} {format(currentDateTime, "hh:mm:ss a")}
        </h2>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 p-4">
        {/* Left Panel - Current Student */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 mr-4 flex flex-col items-center">
          <div className="w-full h-80 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {currentStudent ? (
              <img 
                src={currentStudent.profileImageURL || defaultAvatar} 
                alt={`${currentStudent.firstName} ${currentStudent.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Waiting for RFID scan...</p>
              </div>
            )}
          </div>
          
          <div className="w-full bg-black text-white p-2 text-center mb-4">
            {currentStudent ? (
              <h2 className="text-2xl font-bold">{currentStudent.lastName}, {currentStudent.firstName}</h2>
            ) : (
              <h2 className="text-2xl font-bold">-</h2>
            )}
          </div>
          
          <div className="w-full text-center">
            {currentStudent ? (
              <>
                <h3 className="text-xl font-bold">{currentStudent.firstName} {currentStudent.lastName}</h3>
                <p className="text-lg">{currentStudent.course}</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold">-</h3>
                <p className="text-lg">-</p>
              </>
            )}
          </div>
          
          <div className="w-full mt-4">
            <button 
              className={`w-full py-3 text-white text-lg font-bold rounded-md ${isCheckedIn ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              {isCheckedIn ? 'CHECKED IN' : 'WAITING'}
            </button>
          </div>
        </div>
        
        {/* Right Panel - Attendance Records */}
        <div className="w-2/3 bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Attendance Records</h2>
          </div>
          
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time In
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Out
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={record.imageUrl || defaultAvatar} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.timeIn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'IN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {record.timeOut || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {attendanceRecords.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* For demo purposes, add a button to simulate RFID scan */}
      <div className="p-4 bg-gray-200">
        <button 
          onClick={() => handleRfidScan('ABC123')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Simulate RFID Scan
        </button>
      </div>
    </div>
  );
};

export default AttendanceMonitor;
