import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Bookmark } from "lucide-react";

export default function Watchlist() {
  const { watchlist, loading } = useWatchlist();

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark size={28} className="text-[#e50914]" />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--app-text)" }}>My Watchlist</h1>
          {watchlist.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e50914] text-white">
              {watchlist.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={56} className="mx-auto text-gray-700 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-500 text-sm">Add movies you want to watch later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
