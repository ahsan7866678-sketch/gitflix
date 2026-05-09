const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getPosterUrl(path, size = "w500") {
  if (!path) return "https://placehold.co/500x750/1c1c1c/555?text=No+Image";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path, size = "w1280") {
  if (!path) return "https://placehold.co/1280x720/1c1c1c/555?text=No+Image";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path, size = "w185") {
  if (!path) return "https://placehold.co/185x278/1c1c1c/555?text=?";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
