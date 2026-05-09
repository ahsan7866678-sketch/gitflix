import { Layout } from "@/components/layout/Layout";
import { MovieCard } from "@/components/ui/MovieCard";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites, loading } = useFavorites();

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-pink-500" />
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--app-text)" }}>My Favourites</h1>
          {favorites.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-600 text-white">
              {favorites.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="mx-auto text-gray-700 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No favourites yet</h2>
            <p className="text-gray-500 text-sm">Heart movies you love to save them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
