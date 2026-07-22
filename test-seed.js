import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMKN983mAjjtHo_UMaNEZdE6rryh6msbw",
  authDomain: "my-portfolio-34630.firebaseapp.com",
  projectId: "my-portfolio-34630",
  storageBucket: "my-portfolio-34630.firebasestorage.app",
  messagingSenderId: "723804171290",
  appId: "1:723804171290:web:21bc10d3fd3ffb0b31f5a3",
  measurementId: "G-SX1NG8G1NL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const q = query(collection(db, "projects"), where("isSeeded", "==", true));
    const snap = await getDocs(q);
    console.log("Success! Docs:", snap.docs.length);
  } catch (e) {
    console.error("FIREBASE ERROR:", e);
  }
}
test();
