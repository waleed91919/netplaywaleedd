import { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie, Series, Genre, ContentDetails, MediaResponse } from './tmdb-api';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'de-DE',
  },
});

// Common hook for fetching data
function useFetch<T>(
  url: string,
  params: Record<string, any> = {},
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get<T>(url, { params });
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return { data, loading, error };
}

// Media Hooks
export function useTrendingMovies() {
  return useFetch<MediaResponse<Movie>>('/trending/movie/week');
}

export function useTrendingTVSeries() {
  return useFetch<MediaResponse<Series>>('/trending/tv/week');
}

export function usePopularMovies(page = 1) {
  return useFetch<MediaResponse<Movie>>('/movie/popular', { page }, [page]);
}

export function usePopularTVSeries(page = 1) {
  return useFetch<MediaResponse<Series>>('/tv/popular', { page }, [page]);
}

export function useMovieDetails(id: number) {
  return useFetch<ContentDetails>(`/movie/${id}`, {}, [id]);
}

export function useSeriesDetails(id: number) {
  return useFetch<ContentDetails>(`/tv/${id}`, {}, [id]);
}

export function useMovieGenres() {
  return useFetch<{genres: Genre[]}>('/genre/movie/list');
}

export function useTVGenres() {
  return useFetch<{genres: Genre[]}>('/genre/tv/list');
}

export function useMoviesByGenre(genreId: number, page = 1) {
  return useFetch<MediaResponse<Movie>>(
    '/discover/movie',
    { with_genres: genreId, page },
    [genreId, page]
  );
}

export function useTVSeriesByGenre(genreId: number, page = 1) {
  return useFetch<MediaResponse<Series>>(
    '/discover/tv',
    { with_genres: genreId, page },
    [genreId, page]
  );
}

export function useSearch(query: string, page = 1) {
  return useFetch<MediaResponse<Movie | Series>>(
    '/search/multi',
    { query, page, include_adult: false },
    [query, page]
  );
}

// Client-side search functions
export const clientApi = {
  searchMulti: (query: string, page = 1) =>
    api.get<MediaResponse<Movie | Series>>('/search/multi', {
      params: { query, page, include_adult: false }
    }),

  searchMovies: (query: string, page = 1) =>
    api.get<MediaResponse<Movie>>('/search/movie', {
      params: { query, page, include_adult: false }
    }),

  searchTVSeries: (query: string, page = 1) =>
    api.get<MediaResponse<Series>>('/search/tv', {
      params: { query, page, include_adult: false }
    }),
};
