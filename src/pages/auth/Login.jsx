import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import SuccessModal from '../../components/modals/SuccessModal';

const Login = () => {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleContinue = () => {
    if (userData?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (userData?.role === 'teacher') {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // First, query Firestore to find the user with the given ID number
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('idNumber', '==', idNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this ID number');
        return;
      }

      // Get the email associated with the ID number
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;

      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      
      // Get the user's role from Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserData(userData);
        setShowSuccessModal(true);
      } else {
        setError('User data not found');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid ID number or password');
      } else if (error.code === 'auth/configuration-not-found') {
        setError('Authentication service is not properly configured. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-3/4 px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center text-blue-600">
              <i className="fas fa-graduation-cap text-4xl"></i>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-blue-600 flex items-center justify-center">
              <i className="fas fa-user mr-2"></i>
              LOGIN ACCOUNT
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* ID Number */}
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <i className="fas fa-id-card text-blue-500"></i>
                </div>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="SCC-123456"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <i className="fas fa-lock text-blue-500"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 z-10"
                >
                  <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} h-4 w-5`}></i>
                </button>
              </div>
            </div>

            {/* Show any error messages */}
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {error}
              </div>
            )}

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot Password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                SIGN IN
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right side - Blue section */}
        <div className="hidden md:block w-1/2 bg-blue-600 px-8 py-12">
          <div className="h-full flex flex-col justify-center items-center text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-center text-lg">
              Sign in to access the Attendance Monitoring System
            </p>
            <div className="mt-8">
              <i className="fas fa-clipboard-check text-6xl text-white/60"></i>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        title="Login Success"
        message={`Welcome back, ${userData?.role?.toUpperCase() || 'USER'} !`}
        onContinue={handleContinue}
        autoCloseTime={3}
      />
    </div>
  );
};

export default Login;
