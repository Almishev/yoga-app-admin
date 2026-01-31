import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Login user with email and password
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Проверка за admin права - използвай кеширан токен първо (по-бързо)
    // Ако няма admin права в кеширания токен, тогава force refresh
    let tokenResult = await getIdTokenResult(userCredential.user);
    let isAdmin = tokenResult.claims.admin === true;
    
    // Ако няма admin в кеширания токен, опитай с force refresh
    if (!isAdmin) {
      await userCredential.user.getIdToken(true);
      tokenResult = await getIdTokenResult(userCredential.user);
      isAdmin = tokenResult.claims.admin === true;
    }
    
    if (!isAdmin) {
      // Ако няма admin права, излез потребителя
      await signOut(auth);
      throw new Error('Нямате администраторски права. Моля, свържете се с администратор.');
    }
    
    return userCredential.user;
  } catch (error) {
    let errorMessage = error.message;
    
    // Ако вече е нашата custom грешка, я върни
    if (errorMessage.includes('администраторски права')) {
      throw error;
    }
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Потребител с този email не съществува.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Грешна парола.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Невалиден email адрес.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Грешен email или парола.';
        break;
      default:
        errorMessage = error.message || 'Възникна грешка при влизането.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Logout current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Check if current user has admin claim
 * Използва кеширан токен по подразбиране (по-бързо)
 * Force refresh само ако е необходимо
 */
export const checkAdminClaim = async (forceRefresh = false) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Първо опитай с кеширан токен (по-бързо)
    let tokenResult = await getIdTokenResult(user);
    let isAdmin = tokenResult.claims.admin === true;
    
    // Ако няма admin в кеширания токен и е нужен force refresh, обнови токена
    if (!isAdmin && forceRefresh) {
      await user.getIdToken(true);
      tokenResult = await getIdTokenResult(user);
      isAdmin = tokenResult.claims.admin === true;
    }
    
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin claim:', error);
    return false;
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

