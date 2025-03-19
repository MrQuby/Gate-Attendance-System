import { collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'users';

/**
 * @typedef {Object} User
 * @property {string} id - User document ID
 * @property {string} idNumber - User ID number
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} email - User email
 * @property {string} role - User role (admin, teacher, departmentHead, etc.)
 * @property {string} department - User department ID (optional)
 * @property {string[]} classes - Array of class IDs (for teachers)
 * @property {Date} createdAt - When the user record was created
 * @property {Date} updatedAt - When the user record was last updated
 * @property {boolean} isActive - Whether the user is active or not
 */

/**
 * Retrieves all active users
 * @returns {Promise<User[]>} Array of active users
 */
export const getUsers = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Retrieves a user by their ID number
 * @param {string} idNumber - The user's ID number
 * @returns {Promise<User|null>} The user object or null if not found
 */
export const getUserByIdNumber = async (idNumber) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('idNumber', '==', idNumber),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error fetching user by ID number:', error);
    throw error;
  }
};

/**
 * Retrieves a user by their document ID
 * @param {string} id - The user's document ID
 * @returns {Promise<User|null>} The user object or null if not found
 */
export const getUserById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Retrieves users by role
 * @param {string} role - The role to filter by
 * @returns {Promise<User[]>} Array of users with the specified role
 */
export const getUsersByRole = async (role) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('role', '==', role),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    throw error;
  }
};

/**
 * Creates a new user record
 * @param {Omit<User, 'id'|'createdAt'|'updatedAt'|'isActive'>} userData - The user data
 * @returns {Promise<User>} The created user record
 */
export const addUser = async (userData) => {
  try {
    const dataToSave = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
    return {
      id: docRef.id,
      ...dataToSave
    };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

/**
 * Updates an existing user record
 * @param {string} id - The user ID
 * @param {Partial<User>} userData - The fields to update
 * @returns {Promise<void>}
 */
export const updateUser = async (id, userData) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Soft deletes a user by setting isActive to false
 * @param {string} id - The user ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(userRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for all active users
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToUsers = (callback) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isActive', '==', true)
    );
    
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(users);
    });
  } catch (error) {
    console.error('Error setting up users subscription:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for users with a specific role
 * @param {string} role - The role to filter by
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToUsersByRole = (role, callback) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('role', '==', role),
      where('isActive', '==', true)
    );
    
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(users);
    });
  } catch (error) {
    console.error(`Error setting up subscription for users with role ${role}:`, error);
    throw error;
  }
};

/**
 * Convenience function to get teachers (users with role 'teacher')
 * @returns {Promise<User[]>} Array of teachers
 */
export const getTeachers = async () => {
  return getUsersByRole('teacher');
};

/**
 * Convenience function to subscribe to teachers (users with role 'teacher')
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToTeachers = (callback) => {
  return subscribeToUsersByRole('teacher', callback);
};

/**
 * Convenience function to get admins (users with role 'admin')
 * @returns {Promise<User[]>} Array of admins
 */
export const getAdmins = async () => {
  return getUsersByRole('admin');
};

/**
 * Convenience function to subscribe to admins (users with role 'admin')
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToAdmins = (callback) => {
  return subscribeToUsersByRole('admin', callback);
};

/**
 * Convenience function to get department heads (users with role 'departmentHead')
 * @returns {Promise<User[]>} Array of department heads
 */
export const getDepartmentHeads = async () => {
  return getUsersByRole('departmentHead');
};

/**
 * Convenience function to subscribe to department heads (users with role 'departmentHead')
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToDepartmentHeads = (callback) => {
  return subscribeToUsersByRole('departmentHead', callback);
};
