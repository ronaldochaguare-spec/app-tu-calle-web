import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCptwUoF8PxJF5Dzn_SYQ957yhQOAzuvGQ",
  authDomain: "apptucalle-62c65.firebaseapp.com",
  projectId: "apptucalle-62c65",
  storageBucket: "apptucalle-62c65.firebasestorage.app",
  messagingSenderId: "117716463919",
  appId: "1:117716463919:web:a88d7901895943d835b1da",
  measurementId: "G-ED1J8ZD9HP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────────
// FUNCIONES DE AUTENTICACIÓN Y BASE DE DATOS
// ─────────────────────────────────────────────────────────────────

// 1. Iniciar sesión con Email y Contraseña 
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
};

// 2. Registrar un USUARIO normal
export const registerNormalUser = async (name, email, password, phone) => {
  try {
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
   
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre: name,
      email: email,
      telefono: phone, 
      rol: "USUARIO"
    });
    
    return user;
  } catch (error) {
    console.error("Error en registro de usuario:", error.message);
    throw error;
  }
};

// 3. Registrar una TIENDA
export const registerStore = async (storeName, email, password, phone, addressObj, hours, daysOpen) => {
  try {
    // Creamos la cuenta en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardamos la tienda en la colección "tiendas" 
    await setDoc(doc(db, "tiendas", user.uid), {
      celular: phone,
      diasApertura: daysOpen, 
      direccion: {
        latitud: addressObj.latitud,
        longitud: addressObj.longitud,
        texto: addressObj.texto
      },
      email: email,
      horario: hours,
      nombre: storeName,
      rol: "TIENDA"
    });
    
    return user;
  } catch (error) {
    console.error("Error en registro de tienda:", error.message);
    throw error;
  }
};

// 4. Iniciar sesión con Google (Detectando si es nuevo)
const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    // Si NO existe (es la primera vez que se loguea con Google)
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        nombre: user.displayName, // Google nos da su nombre completo
        email: user.email,
        rol: "USUARIO" // Por defecto, quien entra con Google es un cliente normal
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error con Google:", error.message);
    throw error;
  }
};

// 5. Cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error.message);
    throw error;
  }
};

export const confirmNewPassword = async (oobCode, newPassword) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error("Error al confirmar nueva contraseña:", error.message);
    throw error;
  }
};