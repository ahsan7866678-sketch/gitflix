import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  searchMovies,
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getGenres,
  discoverMovies,
} from "./tmdb";
import type { DiscoverParams } from "@/types/tmdb";

const STALE_TIME = 5 * 60 * 1000;

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
    staleTime: STALE_TIME,
  });
}

export function usePopular(page = 1) {
  return useQuery({
    queryKey: ["popular", page],
    queryFn: () => getPopular(page),
    staleTime: STALE_TIME,
  });
}

export function useTopRated(page = 1) {
  return useQuery({
    queryKey: ["topRated", page],
    queryFn: () => getTopRated(page),
    staleTime: STALE_TIME,
  });
}

export function useNowPlaying(page = 1) {
  return useQuery({
    queryKey: ["nowPlaying", page],
    queryFn: () => getNowPlaying(page),
    staleTime: STALE_TIME,
  });
}

export function useSearchMovies(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchMovies(query, page),
    staleTime: STALE_TIME,
    enabled: query.length >= 2,
  });
}

export function useMovieDetail(id: number | string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useMovieCredits(id: number | string) {
  return useQuery({
    queryKey: ["credits", id],
    queryFn: () => getMovieCredits(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useMovieVideos(id: number | string) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => getMovieVideos(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useSimilarMovies(id: number | string) {
  return useQuery({
    queryKey: ["similar", id],
    queryFn: () => getSimilarMovies(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: STALE_TIME,
  });
}

export function useDiscoverMovies(params: DiscoverParams) {
  return useQuery({
    queryKey: ["discover", params],
    queryFn: () => discoverMovies(params),
    staleTime: STALE_TIME,
  });
}

export function useInfiniteDiscover(params: Omit<DiscoverParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["infiniteDiscover", params],
    queryFn: ({ pageParam = 1 }) => discoverMovies({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    staleTime: STALE_TIME,
  });
}
