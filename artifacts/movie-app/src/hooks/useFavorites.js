import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { isFirebaseConfigured, db } from "@/lib/firebase";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !isFirebaseConfigured || !db) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    let unsubscribe;

    Promise.all([
      import("firebase/firestore"),
    ]).then(([{ doc, onSnapshot }]) => {
      unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
        const data = snap.data();
        setFavorites(data?.favorites ?? []);
        setLoading(false);
      });
    });

    return () => unsubscribe?.();
  }, [user]);

  function isInFavorites(movieId) {
    return favorites.some((m) => m.id === movieId);
  }

  async function addToFavorites(movie) {
    if (!user || !isFirebaseConfigured || !db) return;
    const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", user.uid), {
      favorites: arrayUnion(movie),
    });
  }

  async function removeFromFavorites(movie) {
    if (!user || !isFirebaseConfigured || !db) return;
    const { doc, updateDoc, arrayRemove } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", user.uid), {
      favorites: arrayRemove(movie),
    });
  }

  return { favorites, loading, isInFavorites, addToFavorites, removeFromFavorites };
}
