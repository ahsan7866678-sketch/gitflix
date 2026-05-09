import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight, Plus, ThumbsUp } from "lucide-react";
import { useTrending, usePopular, useTopRated, useNowPlaying, useMovieVideos } from "@/api/hooks";
import { getBackdropUrl } from "@/utils/image";
import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { TrailerModal } from "@/components/ui/TrailerModal";
import { HeroSkeleton, MovieCardSkeleton } from "@/components/ui/SkeletonLoader";
import type { Movie } from "@/types/tmdb";

function HeroTrailerButton({ movieId }: { movieId: number }) {
  const { data: videos } = useMovieVideos(movieId);
  const [open, setOpen] = useState(false);
  const trailer = videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  if (!trailer) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded font-bold text-sm hover:bg-white/80 transition-colors"
      >
        <Play size={18} fill="black" /> Play
      </button>
      {open && <TrailerModal videoKey={trailer.key} onClose={() => setOpen(false)} />}
    </>
  );
}

function HeroBanner({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[95vh] overflow-hidden">
      <img
        src={getBackdropUrl(movie.backdrop_path, "original")}
        alt={`${movie.title} backdrop`}
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />

      <div className="absolute bottom-28 left-6 md:left-16 max-w-lg space-y-5">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight drop-shadow-2xl">
          {movie.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span className="text-green-400 font-bold text-base">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span className="border border-gray-500 px-1.5 py-0.5 text-xs rounded">HD</span>
        </div>
        <p className="text-gray-200 text-sm md:text-base line-clamp-3 leading-relaxed max-w-md">
          {movie.overview}
        </p>
        <div className="flex items-center gap-3">
          <HeroTrailerButton movieId={movie.id} />
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded font-bold text-sm transition-colors"
          >
            <Info size={18} /> More Info
          </button>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="flex items-center gap-2 text-xs hover:text-white transition-colors">
            <Plus size={16} /> My List
          </button>
          <button className="flex items-center gap-2 text-xs hover:text-white transition-colors">
            <ThumbsUp size={16} /> Rate
          </button>
        </div>
      </div>
    </div>
  );
}

function MovieRow({ title, movies, loading }: { title: string; movies: Movie[] | undefined; loading: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  }

  return (
    <section className="px-4 md:px-12 py-3">
      <h2 className="text-white text-base md:text-lg font-bold mb-3 tracking-wide">{title}</h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r"
        >
          <ChevronLeft size={22} />
        </button>
        <div ref={rowRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies?.slice(0, 20).map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: trending, isLoading: trendingLoading } = useTrending();
  const { data: popular, isLoading: popularLoading } = usePopular();
  const { data: topRated, isLoading: topRatedLoading } = useTopRated();
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlaying();

  const hero = trending?.results?.[0];

  return (
    <Layout>
      {trendingLoading ? (
        <HeroSkeleton />
      ) : hero ? (
        <HeroBanner movie={hero} />
      ) : null}

      <div className="-mt-16 relative z-10 pb-12">
        <MovieRow title="Trending Now" movies={trending?.results} loading={trendingLoading} />
        <MovieRow title="Popular on Filxjoy" movies={popular?.results} loading={popularLoading} />
        <MovieRow title="Top Rated" movies={topRated?.results} loading={topRatedLoading} />
        <MovieRow title="Now Playing" movies={nowPlaying?.results} loading={nowPlayingLoading} />
      </div>
    </Layout>
  );
}
