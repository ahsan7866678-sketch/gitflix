import axios from "axios";
import type {
  Movie,
  MovieDetail,
  Genre,
  CreditsResponse,
  VideosResponse,
  PaginatedResponse,
  DiscoverParams,
} from "@/types/tmdb";

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL ?? "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function getTrending(): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/trending/movie/week");
  return data;
}

export async function getPopular(page = 1): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/movie/popular", { params: { page } });
  return data;
}

export async function getTopRated(page = 1): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/movie/top_rated", { params: { page } });
  return data;
}

export async function getNowPlaying(page = 1): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/movie/now_playing", { params: { page } });
  return data;
}

export async function searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/search/movie", { params: { query, page } });
  return data;
}

export async function getMovieDetail(id: number | string): Promise<MovieDetail> {
  const { data } = await tmdb.get<MovieDetail>(`/movie/${id}`);
  return data;
}

export async function getMovieCredits(id: number | string): Promise<CreditsResponse> {
  const { data } = await tmdb.get<CreditsResponse>(`/movie/${id}/credits`);
  return data;
}

export async function getMovieVideos(id: number | string): Promise<VideosResponse> {
  const { data } = await tmdb.get<VideosResponse>(`/movie/${id}/videos`);
  return data;
}

export async function getSimilarMovies(id: number | string): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>(`/movie/${id}/similar`);
  return data;
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  const { data } = await tmdb.get<{ genres: Genre[] }>("/genre/movie/list");
  return data;
}

export async function discoverMovies(params: DiscoverParams): Promise<PaginatedResponse<Movie>> {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>("/discover/movie", { params });
  return data;
}
