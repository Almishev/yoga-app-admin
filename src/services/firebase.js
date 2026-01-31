import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBts_ZuMMY0vXxsRdIi2Wbs6YTGs1SqiHc",
  authDomain: "yoga-vibe-4bdc3.firebaseapp.com",
  projectId: "yoga-vibe-4bdc3",
  storageBucket: "yoga-vibe-4bdc3.firebasestorage.app",
  messagingSenderId: "988839844294",
  appId: "1:988839844294:web:b23d7323760f2f6c31bac7"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

