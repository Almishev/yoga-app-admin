import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    // Ако няма документи, върни празен масив веднага
    if (snapshot.empty) {
      return [];
    }
    
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Сортирай локално по createdAt, ако съществува
    return courses.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime; // desc
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Ако има грешка, върни празен масив вместо да хвърляш грешка
    return [];
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) {
      return null;
    }
    
    return {
      id: courseSnap.id,
      ...courseSnap.data()
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Грешка при зареждане на курса: ' + error.message);
  }
};

/**
 * Create new course
 */
export const createCourse = async (courseData) => {
  try {
    const coursesRef = collection(db, 'courses');
    const newCourse = {
      ...courseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(coursesRef, newCourse);
    return { id: docRef.id, ...newCourse };
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Грешка при създаване на курса: ' + error.message);
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const updatedData = {
      ...courseData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(courseRef, updatedData);
    return { id: courseId, ...updatedData };
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Грешка при обновяване на курса: ' + error.message);
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: error.message };
  }
};

