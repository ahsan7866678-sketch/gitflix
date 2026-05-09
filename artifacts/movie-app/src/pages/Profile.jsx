import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { Layout } from "@/components/layout/Layout";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { watchlist } = useWatchlist();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "var(--app-text)" }}>My Profile</h1>

        <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
          <div className="flex items-center gap-4 mb-6">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-[#e50914]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#e50914] flex items-center justify-center text-white text-xl font-bold">
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--app-text)" }}>{user.displayName ?? "User"}</h2>
              <p style={{ color: "var(--app-muted)" }} className="text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--app-bg)" }}>
              <p className="text-2xl font-bold text-[#e50914]">{watchlist.length}</p>
              <p className="text-sm mt-1" style={{ color: "var(--app-muted)" }}>Watchlist</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--app-bg)" }}>
              <p className="text-2xl font-bold text-pink-500">{favorites.length}</p>
              <p className="text-sm mt-1" style={{ color: "var(--app-muted)" }}>Favourites</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
          <h3 className="font-semibold mb-4" style={{ color: "var(--app-text)" }}>Account</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--app-muted)" }}>
              <User size={16} />
              <span>Signed in as <strong style={{ color: "var(--app-text)" }}>{user.email}</strong></span>
            </div>
            {user.emailVerified && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-green-400">Email verified</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 bg-[#e50914] hover:bg-[#c4070f] text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
          >
            <LogOut size={16} />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
