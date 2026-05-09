import React, { createContext, useContext, useEffect, useState } from "react";
import { isFirebaseConfigured, auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

function notConfigured() {
  return Promise.reject(new Error("Firebase is not configured yet."));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    let unsubscribe;

    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => unsubscribe?.();
  }, []);

  async function signUp(email, password, displayName) {
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

  async function signIn(email, password) {
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

  async function resetPassword(email) {
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
