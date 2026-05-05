import { initializeApp } from "firebase/app";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore/lite";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyDbxxfJtvmWMyBgYAhv5vS0sX86zl0UsDk",
  authDomain: "app-tu-calle.firebaseapp.com",
  projectId: "app-tu-calle",
  storageBucket: "app-tu-calle.firebasestorage.app",
  messagingSenderId: "449657578596",
  appId: "1:449657578596:web:15f939b9df4591072e6b71"
};





const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};



const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "user"), {
      uid: res.user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = () => {
  signOut(auth);
};


export { auth, db, login, signup, logout, loginWithGoogle };