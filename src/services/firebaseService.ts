import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const onAuthChange = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback);

// Firestore helpers for user profile
export const saveUserData = async (userId: string, data: any) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
};

export const getUserData = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Notes operations
export const saveNotes = async (userId: string, notes: any[]) => {
    const notesRef = doc(db, 'users', userId, 'data', 'notes');
    await setDoc(notesRef, { notes, updatedAt: Timestamp.now() });
};

export const getNotes = async (userId: string) => {
    const notesRef = doc(db, 'users', userId, 'data', 'notes');
    const docSnap = await getDoc(notesRef);
    return docSnap.exists() ? docSnap.data().notes : [];
};

// Ideas operations
export const saveIdeas = async (userId: string, ideas: any[]) => {
    const ideasRef = doc(db, 'users', userId, 'data', 'ideas');
    await setDoc(ideasRef, { ideas, updatedAt: Timestamp.now() });
};

export const getIdeas = async (userId: string) => {
    const ideasRef = doc(db, 'users', userId, 'data', 'ideas');
    const docSnap = await getDoc(ideasRef);
    return docSnap.exists() ? docSnap.data().ideas : [];
};
