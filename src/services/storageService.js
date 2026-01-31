import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder path (e.g., 'courses', 'asanas')
 * @returns {Promise<string>} Download URL
 */
export const uploadImage = async (file, folder = 'images') => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Грешка при качване на изображение: ' + error.message);
  }
};

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Full URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'o');
    if (pathIndex === -1) {
      throw new Error('Invalid image URL');
    }
    
    const encodedPath = urlParts[pathIndex + 1].split('?')[0];
    const decodedPath = decodeURIComponent(encodedPath);
    
    const imageRef = ref(storage, decodedPath);
    await deleteObject(imageRef);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

