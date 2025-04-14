import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};

export const getImageUrl = (path: string | null, size: string): string => {
  if (!path) {
    // Return a placeholder image from placeholder.com
    if (size.includes('original')) {
      return 'https://via.placeholder.com/1280x720?text=No+Image';
    } else if (size.includes('w500')) {
      return 'https://via.placeholder.com/500x750?text=No+Image';
    } else if (size.includes('w342')) {
      return 'https://via.placeholder.com/342x513?text=No+Image';
    } else if (size.includes('w185')) {
      return 'https://via.placeholder.com/185x278?text=No+Image';
    }
    return 'https://via.placeholder.com/300x450?text=No+Image';
  }

  // Check if path is already a full URL
  if (path.startsWith('http')) {
    return path;
  }

  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'de-DE',
  },
});

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  runtime?: number;
}

export interface Series {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  episode_run_time?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface ContentDetails extends Movie, Series {
  genres: Genre[];
  homepage?: string;
  status?: string;
  tagline?: string;
  created_by?: any[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

// API Endpoints
export const apiEndpoints = {
  // Movies
  getTrendingMovies: () => tmdbApi.get<MediaResponse<Movie>>('/trending/movie/week'),
  getPopularMovies: (page = 1) =>
    tmdbApi.get<MediaResponse<Movie>>('/movie/popular', { params: { page } }),
  getMovieById: (id: number) =>
    tmdbApi.get<ContentDetails>(`/movie/${id}`),
  getMoviesByGenre: (genreId: number, page = 1) =>
    tmdbApi.get<MediaResponse<Movie>>('/discover/movie', {
      params: { with_genres: genreId, page }
    }),

  // TV Series
  getTrendingTVSeries: () => tmdbApi.get<MediaResponse<Series>>('/trending/tv/week'),
  getPopularTVSeries: (page = 1) =>
    tmdbApi.get<MediaResponse<Series>>('/tv/popular', { params: { page } }),
  getTVSeriesById: (id: number) =>
    tmdbApi.get<ContentDetails>(`/tv/${id}`),
  getTVSeriesByGenre: (genreId: number, page = 1) =>
    tmdbApi.get<MediaResponse<Series>>('/discover/tv', {
      params: { with_genres: genreId, page }
    }),

  // Genres
  getMovieGenres: () => tmdbApi.get<{genres: Genre[]}>('/genre/movie/list'),
  getTVGenres: () => tmdbApi.get<{genres: Genre[]}>('/genre/tv/list'),

  // Search
  searchMulti: (query: string, page = 1) =>
    tmdbApi.get<MediaResponse<Movie | Series>>('/search/multi', {
      params: { query, page, include_adult: false }
    }),
  searchMovies: (query: string, page = 1) =>
    tmdbApi.get<MediaResponse<Movie>>('/search/movie', {
      params: { query, page, include_adult: false }
    }),
  searchTVSeries: (query: string, page = 1) =>
    tmdbApi.get<MediaResponse<Series>>('/search/tv', {
      params: { query, page, include_adult: false }
    }),
};

export default tmdbApi;
