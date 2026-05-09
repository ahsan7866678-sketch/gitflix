import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { isFirebaseConfigured, db } from "@/lib/firebase";
import type { Movie } from "@/types/tmdb";

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !isFirebaseConfigured || !db) {
      setWatchlist([]);
      return;
    }

    setLoading(true);
    let unsubscribe: (() => void) | undefined;

    Promise.all([
      import("firebase/firestore"),
    ]).then(([{ doc, onSnapshot }]) => {
      unsubscribe = onSnapshot(doc(db!, "users", user.uid), (snap) => {
        const data = snap.data();
        setWatchlist(data?.watchlist ?? []);
        setLoading(false);
      });
    });

    return () => unsubscribe?.();
  }, [user]);

  function isInWatchlist(movieId: number) {
    return watchlist.some((m) => m.id === movieId);
  }

  async function addToWatchlist(movie: Movie) {
    if (!user || !isFirebaseConfigured || !db) return;
    const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", user.uid), {
      watchlist: arrayUnion(movie),
    });
  }

  async function removeFromWatchlist(movie: Movie) {
    if (!user || !isFirebaseConfigured || !db) return;
    const { doc, updateDoc, arrayRemove } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", user.uid), {
      watchlist: arrayRemove(movie),
    });
  }

  return { watchlist, loading, isInWatchlist, addToWatchlist, removeFromWatchlist };
}
