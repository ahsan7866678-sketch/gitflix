import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Bell, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled || menuOpen ? "shadow-xl" : ""
      }`}
      style={{
        background:
          scrolled || menuOpen
            ? "var(--app-nav)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 h-16 flex items-center gap-8">
        <Link
          to="/"
          className="shrink-0 text-[#e50914] font-black text-2xl md:text-3xl tracking-tight select-none"
          style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: "-0.5px" }}
        >
          FILXJOY
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm font-medium flex-1">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/browse" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
          <Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search</Link>
          {user && (
            <>
              <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors">My List</Link>
              <Link to="/favorites" className="text-gray-300 hover:text-white transition-colors">Favourites</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => navigate("/search")}
            aria-label="Search"
            className="text-gray-300 hover:text-white transition-colors p-1"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            className="text-gray-300 hover:text-white transition-colors p-1"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {user && (
            <button aria-label="Notifications" className="text-gray-300 hover:text-white transition-colors p-1">
              <Bell size={19} />
            </button>
          )}

          {user ? (
            <Link to="/profile" aria-label="Profile" className="ml-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? "Profile"}
                  className="w-8 h-8 rounded object-cover border-2 border-[#e50914]"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center text-white text-xs font-bold">
                  {initials ?? "U"}
                </div>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#e50914] hover:bg-[#c4070f] text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-5 text-sm font-medium"
          style={{ backgroundColor: "var(--app-nav)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
        >
          <Link to="/" className="hover:text-[#e50914] transition-colors">Home</Link>
          <Link to="/browse" className="hover:text-[#e50914] transition-colors">Movies</Link>
          <Link to="/search" className="hover:text-[#e50914] transition-colors">Search</Link>
          {user ? (
            <>
              <Link to="/watchlist" className="hover:text-[#e50914] transition-colors">My List</Link>
              <Link to="/favorites" className="hover:text-[#e50914] transition-colors">Favourites</Link>
              <Link to="/profile" className="hover:text-[#e50914] transition-colors">Profile</Link>
            </>
          ) : (
            <Link to="/login" className="text-[#e50914] font-semibold">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
