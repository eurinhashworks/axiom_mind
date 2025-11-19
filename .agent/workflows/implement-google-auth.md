---
description: Implémentation de l'authentification Google OAuth pour AXIOM
---

# 🔐 Implémentation de l'Authentification Google - Workflow Complet

**Objectif :** Permettre à chaque utilisateur d'avoir son propre espace privé via Google OAuth 2.0

**Durée estimée :** 7-10 jours  
**Priorité :** 🔴 P0 (Critique)

---

## 📋 Phase 1 : Configuration Firebase (Jour 1)

### 1.1 Créer un projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet "axiom-mind-prod"
3. Activer Google Analytics (optionnel)
4. Enregistrer l'application Web

### 1.2 Configurer Google Authentication

```bash
# Dans Firebase Console :
1. Authentication > Sign-in method
2. Activer "Google" comme provider
3. Configurer le support email : votre-email@gmail.com
4. Ajouter les domaines autorisés : localhost, votre-domaine.com
```

### 1.3 Installer les dépendances

```bash
pnpm add firebase
pnpm add -D @types/firebase
```

### 1.4 Configuration des variables d'environnement

Créer/mettre à jour `.env.local` :

```env
# Gemini (existant)
VITE_GEMINI_API_KEY=your_existing_key

# Firebase Config
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=axiom-mind-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=axiom-mind-prod
VITE_FIREBASE_STORAGE_BUCKET=axiom-mind-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**⚠️ IMPORTANT :** Ajouter `.env.local` au `.gitignore` (déjà fait normalement)

---

## 📋 Phase 2 : Architecture Backend (Jours 2-3)

### 2.1 Créer le service Firebase

**Fichier :** `src/services/firebaseService.ts`

```typescript
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
  getDocs,
  query,
  where,
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

// Firestore helpers
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
```

### 2.2 Créer le Context d'Authentification

**Fichier :** `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  logout, 
  onAuthChange,
  getUserData,
  saveUserData 
} from '../services/firebaseService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        // Create/update user profile in Firestore
        await saveUserData(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
        });
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

## 📋 Phase 3 : Composants UI (Jours 4-5)

### 3.1 Page de Login

**Fichier :** `src/components/LoginView.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-axiom-dark">
      <div className="card max-w-md w-full p-8 text-center space-y-6 animate-popIn">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent">
            AXIOM
          </h1>
          <p className="text-axiom-text-secondary">
            L'Intelligence Artificielle pour Architectes d'Idées
          </p>
        </div>

        {/* Illustration ou Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-axiom-accent/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-axiom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </>
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Footer */}
        <p className="text-axiom-text-secondary text-xs">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
};
```

### 3.2 Header avec Profil Utilisateur

**Fichier :** `src/components/UserMenu.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserMenu: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <img
          src={currentUser.photoURL || 'https://via.placeholder.com/40'}
          alt={currentUser.displayName || 'User'}
          className="w-8 h-8 rounded-full border-2 border-axiom-accent"
        />
        <span className="text-axiom-text-primary text-sm font-medium hidden md:block">
          {currentUser.displayName?.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 card p-4 space-y-3 animate-fadeIn shadow-glow z-50">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <img
              src={currentUser.photoURL || 'https://via.placeholder.com/40'}
              alt={currentUser.displayName || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-axiom-text-primary font-medium truncate">
                {currentUser.displayName}
              </p>
              <p className="text-axiom-text-secondary text-xs truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## 📋 Phase 4 : Migration des Données (Jour 6)

### 4.1 Hook de Synchronisation Firestore

**Fichier :** `src/hooks/useFirestoreSync.ts`

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotes, saveNotes, getIdeas, saveIdeas } from '../services/firebaseService';

export function useFirestoreSync<T>(
  key: 'notes' | 'ideas',
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { currentUser } = useAuth();
  const [data, setData] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Firestore on mount
  useEffect(() => {
    if (currentUser && !isLoaded) {
      const loadData = async () => {
        try {
          const fetchFn = key === 'notes' ? getNotes : getIdeas;
          const cloudData = await fetchFn(currentUser.uid);
          
          if (cloudData && cloudData.length > 0) {
            setData(cloudData);
          } else {
            // Migrate from LocalStorage if cloud is empty
            const localData = localStorage.getItem(`axiom_${key}`);
            if (localData) {
              const parsed = JSON.parse(localData);
              setData(parsed);
              // Save to cloud
              const saveFn = key === 'notes' ? saveNotes : saveIdeas;
              await saveFn(currentUser.uid, parsed);
              // Clear localStorage after migration
              localStorage.removeItem(`axiom_${key}`);
            }
          }
        } catch (error) {
          console.error(`Error loading ${key}:`, error);
        } finally {
          setIsLoaded(true);
        }
      };
      loadData();
    }
  }, [currentUser, key, isLoaded]);

  // Save to Firestore on change
  useEffect(() => {
    if (currentUser && isLoaded) {
      const saveFn = key === 'notes' ? saveNotes : saveIdeas;
      saveFn(currentUser.uid, data as any).catch(console.error);
    }
  }, [data, currentUser, key, isLoaded]);

  return [data, setData];
}
```

### 4.2 Mettre à jour App.tsx

Remplacer `useLocalStorage` par `useFirestoreSync` :

```typescript
// Avant
const [notes, setNotes] = useLocalStorage<BrainDumpNote[]>('axiom_notes', []);
const [completedIdeas, setCompletedIdeas] = useLocalStorage<IdeaNode[]>('axiom_completed_ideas', []);

// Après
const [notes, setNotes] = useFirestoreSync<BrainDumpNote[]>('notes', []);
const [completedIdeas, setCompletedIdeas] = useFirestoreSync<IdeaNode[]>('ideas', []);
```

---

## 📋 Phase 5 : Routing et Protection (Jour 7)

### 5.1 Installer React Router

```bash
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

### 5.2 Créer ProtectedRoute

**Fichier :** `src/components/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-axiom-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};
```

### 5.3 Configurer les Routes

**Mettre à jour `src/index.tsx` :**

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { LoginView } from './components/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 📋 Phase 6 : Tests et Déploiement (Jours 8-10)

### 6.1 Tests Locaux

1. Vérifier le login Google
2. Tester la migration depuis LocalStorage
3. Vérifier la synchronisation entre onglets
4. Tester le logout et la persistance

### 6.2 Configuration Firestore Rules

Dans Firebase Console > Firestore Database > Rules :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /data/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 6.3 Déploiement

```bash
# Build
pnpm build

# Deploy (si Vercel/Netlify configuré)
vercel deploy --prod
# ou
netlify deploy --prod
```

---

## ✅ Checklist Finale

- [ ] Firebase project créé et configuré
- [ ] Google Auth activé dans Firebase Console
- [ ] Variables d'env configurées (`.env.local`)
- [ ] Service Firebase implémenté (`firebaseService.ts`)
- [ ] Context d'authentification créé (`AuthContext.tsx`)
- [ ] Page de login fonctionnelle (`LoginView.tsx`)
- [ ] Menu utilisateur dans le header (`UserMenu.tsx`)
- [ ] Hook de synchronisation Firestore (`useFirestoreSync.ts`)
- [ ] Migration LocalStorage → Firestore testée
- [ ] Routes protégées configurées (`ProtectedRoute.tsx`)
- [ ] Firestore rules configurées (sécurité)
- [ ] Tests complets effectués
- [ ] Documentation mise à jour
- [ ] Déployé en production

---

## 🚨 Points d'Attention

1. **Sécurité :** Ne jamais commit les clés API (`.env.local` dans `.gitignore`)
2. **Migration :** Prévenir les utilisateurs avant de supprimer le LocalStorage
3. **Offline :** Gérer les cas sans connexion (afficher message clair)
4. **Rate Limiting :** Firebase a des quotas gratuits (10k writes/day)
5. **GDPR :** Ajouter une page "Supprimer mon compte" plus tard

---

## 📚 Ressources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Get Started](https://firebase.google.com/docs/firestore)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la documentation Firebase.
