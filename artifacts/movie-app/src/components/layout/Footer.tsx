import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      className="border-t mt-12 py-10 px-4 md:px-12"
      style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-bg)" }}
    >
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-[#e50914] font-black text-2xl tracking-tight block mb-6">
          FILXJOY
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-8" style={{ color: "var(--app-muted)" }}>
          <div className="space-y-3">
            <p className="font-semibold" style={{ color: "var(--app-text)" }}>Browse</p>
            <Link to="/browse" className="block hover:text-white transition-colors">Movies</Link>
            <Link to="/search" className="block hover:text-white transition-colors">Search</Link>
          </div>
          <div className="space-y-3">
            <p className="font-semibold" style={{ color: "var(--app-text)" }}>My Account</p>
            <Link to="/watchlist" className="block hover:text-white transition-colors">Watchlist</Link>
            <Link to="/favorites" className="block hover:text-white transition-colors">Favourites</Link>
            <Link to="/profile" className="block hover:text-white transition-colors">Profile</Link>
          </div>
          <div className="space-y-3">
            <p className="font-semibold" style={{ color: "var(--app-text)" }}>Powered by</p>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
              TMDB API
            </a>
          </div>
        </div>
        <p className="text-xs" style={{ color: "var(--app-muted)" }}>
          © {new Date().getFullYear()} Filxjoy. Movie data provided by The Movie Database (TMDB). Not affiliated with any streaming service.
        </p>
      </div>
    </footer>
  );
}
