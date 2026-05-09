import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useGenres, useInfiniteDiscover } from "@/api/hooks";
import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { MovieCardSkeleton } from "@/components/ui/SkeletonLoader";
import { SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre") ? Number(searchParams.get("genre")) : undefined;
  const sortParam = searchParams.get("sort") ?? "popularity.desc";

  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(genreParam);
  const [sortBy, setSortBy] = useState(sortParam);

  const { data: genresData } = useGenres();

  const params = {
    sort_by: sortBy,
    with_genres: selectedGenre,
    "vote_count.gte": 50,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteDiscover(params);

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  function handleGenreClick(id?: number) {
    setSelectedGenre(id);
    const next = new URLSearchParams(searchParams);
    if (id) next.set("genre", String(id));
    else next.delete("genre");
    setSearchParams(next, { replace: true });
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    setSearchParams(next, { replace: true });
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--app-text)" }}>Browse Movies</h1>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenreClick(undefined)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !selectedGenre
                  ? "bg-[#e50914] text-white"
                  : "text-gray-300 hover:bg-[#2a2a2a]"
              }`}
              style={!selectedGenre ? {} : { backgroundColor: "var(--app-surface)" }}
            >
              All
            </button>
            {genresData?.genres.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenreClick(g.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === g.id
                    ? "bg-[#e50914] text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a]"
                }`}
                style={selectedGenre === g.id ? {} : { backgroundColor: "var(--app-surface)" }}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-gray-300 border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#e50914]"
              style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No movies found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m, i) => <MovieCard key={`${m.id}-${i}`} movie={m} />)}
          </div>
        )}

        <div ref={sentinelRef} className="py-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="w-8 h-8 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    </Layout>
  );
}
