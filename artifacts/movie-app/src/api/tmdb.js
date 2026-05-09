import axios from "axios";

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL ?? "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function getTrending() {
  const { data } = await tmdb.get("/trending/movie/week");
  return data;
}

export async function getPopular(page = 1) {
  const { data } = await tmdb.get("/movie/popular", { params: { page } });
  return data;
}

export async function getTopRated(page = 1) {
  const { data } = await tmdb.get("/movie/top_rated", { params: { page } });
  return data;
}

export async function getNowPlaying(page = 1) {
  const { data } = await tmdb.get("/movie/now_playing", { params: { page } });
  return data;
}

export async function searchMovies(query, page = 1) {
  const { data } = await tmdb.get("/search/movie", { params: { query, page } });
  return data;
}

export async function getMovieDetail(id) {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
}

export async function getMovieCredits(id) {
  const { data } = await tmdb.get(`/movie/${id}/credits`);
  return data;
}

export async function getMovieVideos(id) {
  const { data } = await tmdb.get(`/movie/${id}/videos`);
  return data;
}

export async function getSimilarMovies(id) {
  const { data } = await tmdb.get(`/movie/${id}/similar`);
  return data;
}

export async function getGenres() {
  const { data } = await tmdb.get("/genre/movie/list");
  return data;
}

export async function discoverMovies(params) {
  const { data } = await tmdb.get("/discover/movie", { params });
  return data;
}
