import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'teachers';

/**
 * @typedef {Object} Teacher
 * @property {string} id - The unique identifier
 * @property {string} teacherId - The teacher's ID number
 * @property {string} name - The teacher's full name
 * @property {string} email - The teacher's email address
 * @property {string} department - The department ID this teacher belongs to
 * @property {string[]} courses - Array of course IDs this teacher handles
 * @property {Date} createdAt - When the teacher record was created
 * @property {Date} updatedAt - When the teacher record was last updated
 * @property {boolean} isActive - Whether the teacher is active or not
 */

/**
 * Retrieves all active (non-deleted) teachers
 * @returns {Promise<Teacher[]>} Array of active teachers
 */
export const getTeachers = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting teachers:', error);
    throw error;
  }
};

/**
 * Creates a new teacher record
 * @param {Omit<Teacher, 'id'|'createdAt'|'updatedAt'|'isActive'>} teacherData - The teacher data
 * @returns {Promise<string>} The ID of the created teacher record
 */
export const addTeacher = async (teacherData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...teacherData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

/**
 * Updates an existing teacher record
 * @param {string} id - The teacher ID
 * @param {Partial<Teacher>} teacherData - The fields to update
 * @returns {Promise<void>}
 */
export const updateTeacher = async (id, teacherData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...teacherData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

/**
 * Soft deletes a teacher by setting isActive to false
 * @param {string} id - The teacher ID
 * @returns {Promise<void>}
 */
export const deleteTeacher = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for active teachers
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToTeachers = (callback) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isActive', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
      const teachers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(teachers);
    });
  } catch (error) {
    console.error('Error subscribing to teachers:', error);
    throw error;
  }
};
