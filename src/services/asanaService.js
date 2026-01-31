import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all asanas
 */
export const getAllAsanas = async () => {
  try {
    const asanasRef = collection(db, 'asanas');
    const snapshot = await getDocs(asanasRef);
    
    // Ако няма документи, върни празен масив веднага
    if (snapshot.empty) {
      return [];
    }
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; // desc
    });
  } catch (error) {
    console.error('Error fetching asanas:', error);
    // Ако има грешка, върни празен масив вместо да хвърляш грешка
    return [];
  }
};

/**
 * Get asanas by course ID
 */
export const getAsanasByCourseId = async (courseId) => {
  try {
    const asanasRef = collection(db, 'asanas');
    const q = query(asanasRef, where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    
    const asanas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return asanas.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return aTime - bTime; // asc
    });
  } catch (error) {
    console.error('Error fetching asanas by course:', error);
    throw new Error('Грешка при зареждане на асаните: ' + error.message);
  }
};

/**
 * Get asana by ID
 */
export const getAsanaById = async (asanaId) => {
  try {
    const asanaRef = doc(db, 'asanas', asanaId);
    const asanaSnap = await getDoc(asanaRef);
    
    if (!asanaSnap.exists()) {
      return null;
    }
    
    return {
      id: asanaSnap.id,
      ...asanaSnap.data()
    };
  } catch (error) {
    console.error('Error fetching asana:', error);
    throw new Error('Грешка при зареждане на асаната: ' + error.message);
  }
};

/**
 * Create new asana
 */
export const createAsana = async (asanaData) => {
  try {
    const asanasRef = collection(db, 'asanas');
    const newAsana = {
      ...asanaData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(asanasRef, newAsana);
    return { id: docRef.id, ...newAsana };
  } catch (error) {
    console.error('Error creating asana:', error);
    throw new Error('Грешка при създаване на асаната: ' + error.message);
  }
};

/**
 * Update asana
 */
export const updateAsana = async (asanaId, asanaData) => {
  try {
    const asanaRef = doc(db, 'asanas', asanaId);
    const updatedData = {
      ...asanaData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(asanaRef, updatedData);
    return { id: asanaId, ...updatedData };
  } catch (error) {
    console.error('Error updating asana:', error);
    throw new Error('Грешка при обновяване на асаната: ' + error.message);
  }
};

/**
 * Delete asana
 */
export const deleteAsana = async (asanaId) => {
  try {
    const asanaRef = doc(db, 'asanas', asanaId);
    await deleteDoc(asanaRef);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting asana:', error);
    return { success: false, error: error.message };
  }
};

