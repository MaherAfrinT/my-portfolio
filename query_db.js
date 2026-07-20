import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './src/firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
