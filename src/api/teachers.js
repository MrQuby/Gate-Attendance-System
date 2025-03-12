import { collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

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
 * @property {Date|null} deletedAt - When the teacher was soft deleted, null if active
 */

/**
 * Retrieves all active (non-deleted) teachers
 * @returns {Promise<Teacher[]>} Array of active teachers
 */
export const getTeachers = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('deletedAt', '==', null)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for active teachers
 * @param {function} onUpdate - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToTeachers = (onUpdate) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('deletedAt', '==', null)
    );

    return onSnapshot(q, (snapshot) => {
      const teachers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(teachers);
    }, (error) => {
      console.error('Error in teachers subscription:', error);
    });
  } catch (error) {
    console.error('Error setting up teachers subscription:', error);
    throw error;
  }
};

/**
 * Creates a new teacher record
 * @param {Omit<Teacher, 'id'|'createdAt'|'deletedAt'>} teacherData - The teacher data
 * @returns {Promise<Teacher>} The created teacher record
 */
export const addTeacher = async (teacherData) => {
  try {
    const dataWithTimestamp = {
      ...teacherData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataWithTimestamp);
    return { id: docRef.id, ...dataWithTimestamp };
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

/**
 * Updates an existing teacher record
 * @param {string} id - The teacher ID
 * @param {Partial<Teacher>} teacherData - The fields to update
 * @returns {Promise<Teacher>} The updated teacher record
 */
export const updateTeacher = async (id, teacherData) => {
  try {
    const teacherRef = doc(db, COLLECTION_NAME, id);
    const dataWithTimestamp = {
      ...teacherData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(teacherRef, dataWithTimestamp);
    return { id, ...dataWithTimestamp };
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

/**
 * Soft deletes a teacher by setting deletedAt
 * @param {string} id - The teacher ID
 * @returns {Promise<string>} The ID of the deleted teacher
 */
export const deleteTeacher = async (id) => {
  try {
    const teacherRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(teacherRef, {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

/**
 * Restores a soft-deleted teacher
 * @param {string} id - The teacher ID
 * @returns {Promise<string>} The ID of the restored teacher
 */
export const restoreTeacher = async (id) => {
  try {
    const teacherRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(teacherRef, {
      deletedAt: null,
      updatedAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error restoring teacher:', error);
    throw error;
  }
};

/**
 * Get teachers by department ID
 * @param {string} departmentId - The department ID to filter by
 * @returns {Promise<Teacher[]>} Array of active teachers in the department
 */
export const getTeachersByDepartment = async (departmentId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('deletedAt', '==', null),
      where('department', '==', departmentId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching teachers by department:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for teachers in a specific department
 * @param {string} departmentId - The department ID to filter by
 * @param {function} onUpdate - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToTeachersByDepartment = (departmentId, onUpdate) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('deletedAt', '==', null),
      where('department', '==', departmentId)
    );

    return onSnapshot(q, (snapshot) => {
      const teachers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(teachers);
    }, (error) => {
      console.error('Error in teachers by department subscription:', error);
    });
  } catch (error) {
    console.error('Error setting up teachers by department subscription:', error);
    throw error;
  }
};
