import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured, auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function notConfigured(): Promise<void> {
  return Promise.reject(new Error("Firebase is not configured yet."));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth!, (u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => unsubscribe?.();
  }, []);

  async function signUp(email: string, password: string, displayName: string) {
    if (!isFirebaseConfigured || !auth || !db) return notConfigured();
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    await setDoc(doc(db, "users", newUser.uid), {
      email,
      displayName,
      createdAt: serverTimestamp(),
      watchlist: [],
      favorites: [],
    });
  }

  async function signIn(email: string, password: string) {
    if (!isFirebaseConfigured || !auth) return notConfigured();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    if (!isFirebaseConfigured || !auth || !db) return notConfigured();
    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    const provider = new GoogleAuthProvider();
    const { user: googleUser } = await signInWithPopup(auth, provider);
    await setDoc(
      doc(db, "users", googleUser.uid),
      {
        email: googleUser.email,
        displayName: googleUser.displayName,
        createdAt: serverTimestamp(),
        watchlist: [],
        favorites: [],
      },
      { merge: true }
    );
  }

  async function signOut() {
    if (!isFirebaseConfigured || !auth) return notConfigured();
    const { signOut: firebaseSignOut } = await import("firebase/auth");
    await firebaseSignOut(auth);
  }

  async function resetPassword(email: string) {
    if (!isFirebaseConfigured || !auth) return notConfigured();
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
