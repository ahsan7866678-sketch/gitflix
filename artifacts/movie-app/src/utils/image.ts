const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getPosterUrl(path: string | null, size = "w500"): string {
  if (!path) return "https://placehold.co/500x750/1c1c1c/555?text=No+Image";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "w1280"): string {
  if (!path) return "https://placehold.co/1280x720/1c1c1c/555?text=No+Image";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null, size = "w185"): string {
  if (!path) return "https://placehold.co/185x278/1c1c1c/555?text=?";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
