import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ──────────────────────────────────────────────────────────────
// Firebase Storage is DISABLED to prevent crash when the bucket
// is not provisioned. Uncomment the two lines below once you
// enable Storage in the Firebase Console.
// ──────────────────────────────────────────────────────────────
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyBMKN983mAjjtHo_UMaNEZdE6rryh6msbw',
  authDomain: 'my-portfolio-34630.firebaseapp.com',
  projectId: 'my-portfolio-34630',
  storageBucket: 'my-portfolio-34630.firebasestorage.app',
  messagingSenderId: '723804171290',
  appId: '1:723804171290:web:21bc10d3fd3ffb0b31f5a3',
  measurementId: 'G-SX1NG8G1NL',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Uncomment once Firebase Storage is enabled:
// export const storage = getStorage(app);

export default app;
