import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AdminHeader = ({ title }) => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = React.useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const displayName = userData ? `${userData.firstName} ${userData.lastName}` : 'Admin User';

  return (
    <header className="flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
            <i className="fas fa-bell text-xl"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold">{displayName}</div>
            <div className="text-xs text-gray-500">Teacher</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
            {displayName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
