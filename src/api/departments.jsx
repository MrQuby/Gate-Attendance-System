import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'departments';

export const getDepartments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), departmentData);
    return { id: docRef.id, ...departmentData };
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const updateDepartment = async (id, departmentData) => {
  try {
    const departmentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(departmentRef, departmentData);
    return { id, ...departmentData };
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
