import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { useSearchMovies } from "@/api/hooks";
import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { MovieCardSkeleton } from "@/components/ui/SkeletonLoader";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQuery) next.set("q", debouncedQuery);
    setSearchParams(next, { replace: true });
    setPage(1);
  }, [debouncedQuery, setSearchParams]);

  const { data, isLoading, isError } = useSearchMovies(debouncedQuery, page);

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative max-w-2xl mx-auto mb-10">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies…"
            className="w-full border focus:border-[#e50914] text-white placeholder-gray-500 rounded-lg pl-12 pr-10 py-3.5 text-base outline-none transition-colors"
            style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {!debouncedQuery || debouncedQuery.length < 2 ? (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 text-lg">Type to search for movies…</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-400">Failed to search. Please try again.</div>
        ) : data?.results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No results for "<span className="text-white">{debouncedQuery}</span>"</p>
            <p className="text-sm">Try a different keyword</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">
              {data?.total_results.toLocaleString()} results for "<span className="text-white">{debouncedQuery}</span>"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.results.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
            {data && data.total_pages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors"
                  style={{ backgroundColor: "var(--app-surface)", color: "var(--app-text)" }}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-400">
                  Page {page} of {Math.min(data.total_pages, 500)}
                </span>
                <button
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded text-sm font-medium disabled:opacity-40 transition-colors"
                  style={{ backgroundColor: "var(--app-surface)", color: "var(--app-text)" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
