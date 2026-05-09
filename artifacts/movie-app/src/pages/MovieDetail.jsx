import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Heart, HeartOff, Play, Star, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useMovieDetail, useMovieCredits, useMovieVideos, useSimilarMovies } from "@/api/hooks";
import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/utils/image";
import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { TrailerModal } from "@/components/ui/TrailerModal";
import { DetailSkeleton } from "@/components/ui/SkeletonLoader";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isInFavorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [trailerKey, setTrailerKey] = useState(null);

  const { data: movie, isLoading } = useMovieDetail(id ?? "");
  const { data: credits } = useMovieCredits(id ?? "");
  const { data: videos } = useMovieVideos(id ?? "");
  const { data: similar } = useSimilarMovies(id ?? "");

  if (isLoading) return <DetailSkeleton />;
  if (!movie) return null;

  const trailer = videos?.results.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const movieAsMovie = {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    popularity: movie.popularity,
    genre_ids: movie.genres.map((g) => g.id),
    adult: movie.adult,
    original_language: movie.original_language,
    original_title: movie.original_title,
    video: movie.video,
  };

  async function toggleWatchlist() {
    if (!user) { navigate("/login"); return; }
    try {
      if (inWatchlist) { await removeFromWatchlist(movieAsMovie); toast.success("Removed from watchlist"); }
      else { await addToWatchlist(movieAsMovie); toast.success("Added to watchlist"); }
    } catch { toast.error("Something went wrong"); }
  }

  async function toggleFavorites() {
    if (!user) { navigate("/login"); return; }
    try {
      if (inFavorites) { await removeFromFavorites(movieAsMovie); toast.success("Removed from favorites"); }
      else { await addToFavorites(movieAsMovie); toast.success("Added to favorites"); }
    } catch { toast.error("Something went wrong"); }
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <Layout>
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={`${movie.title} backdrop`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        {trailer && (
          <button
            onClick={() => setTrailerKey(trailer.key)}
            aria-label="Play trailer"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-16 bg-[#e50914]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
              <Play size={28} fill="white" className="text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <img
              src={getPosterUrl(movie.poster_path, "w342")}
              alt={`${movie.title} poster`}
              className="w-40 md:w-56 rounded-lg shadow-2xl border-2 border-[#2a2a2a]"
            />
          </div>

          <div className="flex-1 space-y-4 pt-2 md:pt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-gray-400 italic text-sm">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Star size={14} fill="currentColor" /> {movie.vote_average.toFixed(1)}
              </span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              {runtime && (
                <span className="flex items-center gap-1"><Clock size={14} /> {runtime}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 border rounded-full text-xs text-gray-300"
                  style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap pt-2">
              <button
                onClick={toggleWatchlist}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
                  inWatchlist ? "bg-[#e50914] text-white hover:bg-[#c4070f]" : "text-gray-300 hover:bg-[#2a2a2a] border"
                }`}
                style={inWatchlist ? {} : { backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
              >
                {inWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
              <button
                onClick={toggleFavorites}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
                  inFavorites ? "bg-pink-600 text-white hover:bg-pink-700" : "text-gray-300 hover:bg-[#2a2a2a] border"
                }`}
                style={inFavorites ? {} : { backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
              >
                {inFavorites ? <HeartOff size={16} /> : <Heart size={16} />}
                {inFavorites ? "Unfavorite" : "Favorite"}
              </button>
            </div>

            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{movie.overview}</p>
          </div>
        </div>

        {credits?.cast && credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-white text-xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {credits.cast.slice(0, 15).map((c) => (
                <div key={c.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2"
                    style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
                    {c.profile_path ? (
                      <img src={getProfileUrl(c.profile_path)} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">{c.name[0]}</div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-white font-medium leading-tight">{c.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {trailer && (
          <section className="mt-12">
            <h2 className="text-white text-xl font-bold mb-4">Trailer</h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden max-w-3xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        )}

        {similar?.results && similar.results.length > 0 && (
          <section className="mt-12">
            <h2 className="text-white text-xl font-bold mb-4">Similar Movies</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {similar.results.slice(0, 12).map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
          </section>
        )}
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />}
    </Layout>
  );
}
