import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Plus, Play } from "lucide-react";
import { getPosterUrl } from "@/utils/image";
import type { Movie } from "@/types/tmdb";

interface Props {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className = "" }: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`relative flex-shrink-0 w-36 md:w-44 rounded-md overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-105 hover:z-10 ${className}`}
    >
      <div className="aspect-[2/3] bg-[#1c1c1c]">
        <img
          src={imgError ? "https://placehold.co/300x450/1c1c1c/555?text=No+Image" : getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 gap-1.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{movie.title}</p>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="flex items-center gap-0.5 text-yellow-400">
            <Star size={10} fill="currentColor" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span>{movie.release_date?.slice(0, 4)}</span>
        </div>
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
            className="flex-1 bg-white text-black text-xs font-bold py-1 rounded flex items-center justify-center gap-1"
          >
            <Play size={10} fill="black" /> Play
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 bg-white/20 text-white rounded flex items-center justify-center"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
