'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MediaCard } from '@/components/ui/media-card';
import { SearchBar, SearchFilters } from '@/components/ui/search-bar';
import { clientApi, Movie, Series } from '@/lib/client-api';
import { toast } from 'sonner';

// SearchParamsWrapper komponente, um useSearchParams in einem Suspense zu verwenden
function SearchParamsWrapper({ children }: { children: (params: URLSearchParams) => React.ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<(Movie | Series)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  // Fetch genres for filter
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Mock genres since we don't have a real API key
        setGenres([
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 99, name: 'Documentary' },
          { id: 18, name: 'Drama' },
          { id: 10751, name: 'Family' },
          { id: 14, name: 'Fantasy' },
          { id: 36, name: 'History' },
          { id: 27, name: 'Horror' },
          { id: 10402, name: 'Music' },
          { id: 9648, name: 'Mystery' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Science Fiction' },
          { id: 10770, name: 'TV Movie' },
          { id: 53, name: 'Thriller' },
          { id: 10752, name: 'War' },
          { id: 37, name: 'Western' },
        ]);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Mock performSearch function, since we don't have a real API key
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters, pageNum = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock data for search results (using data from home page)
      const mockMovies = [
        {
          id: 1,
          title: 'Dune: Part Two',
          overview: 'Paul Atreides joins forces with the Fremen to take revenge on those who destroyed his family.',
          poster_path: '/jQNOzoiaIQWxJAx8OUighnvnhRA.jpg',
          backdrop_path: '/uUiIGztTrfDhPfAkQVBQCYcBxjt.jpg',
          release_date: '2024-03-01',
          vote_average: 8.5,
          genre_ids: [878, 12],
          original_language: 'en',
        },
        {
          id: 2,
          title: 'Civil War',
          overview: 'In a near-future America caught in the grip of a civil war, a team of journalists risk their lives to report on the conflict.',
          poster_path: '/mBuZMXipxlTeBJfxXN2YZUdg6B.jpg',
          backdrop_path: '/x9v4Y1R1mXBvHx3yP9mNCmTumwk.jpg',
          release_date: '2024-04-12',
          vote_average: 7.8,
          genre_ids: [28, 18, 53],
          original_language: 'en',
        },
      ];

      const mockSeries = [
        {
          id: 94605,
          name: 'Arcane',
          overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war.',
          poster_path: '/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
          backdrop_path: '/q54qEgagGOYCq5D1903eBVMNkbo.jpg',
          first_air_date: '2021-11-06',
          vote_average: 8.7,
          genre_ids: [16, 10765, 10759, 18],
          original_language: 'en',
        },
        {
          id: 134224,
          name: 'Shōgun',
          overview: 'An English navigator becomes a samurai in feudal Japan.',
          poster_path: '/a2zqo1IgsOhimQXdswggMbhUfTJ.jpg',
          backdrop_path: '/xmW4jEKk5V7qGgxQ2HRgIBLKUKq.jpg',
          first_air_date: '2024-02-27',
          vote_average: 8.6,
          genre_ids: [18, 10759],
          original_language: 'en',
        },
      ];

      // Filter the mock data based on search query
      let combinedResults = [
        ...mockMovies.filter(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        ...mockSeries.filter(series =>
          series.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          series.overview.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ];

      // Apply filters (simplified)
      if (searchFilters.genre) {
        combinedResults = combinedResults.filter(item =>
          item.genre_ids.includes(Number(searchFilters.genre))
        );
      }

      if (searchFilters.year) {
        const year = searchFilters.year;
        combinedResults = combinedResults.filter(item => {
          const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
          return releaseDate && releaseDate.startsWith(year);
        });
      }

      setResults(combinedResults);
      setTotalResults(combinedResults.length);
      setPage(pageNum);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string, searchFilters: SearchFilters) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
    performSearch(searchQuery, searchFilters);

    // Update URL with search parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);

      if (searchFilters.genre) url.searchParams.set('genre', searchFilters.genre);
      else url.searchParams.delete('genre');

      if (searchFilters.year) url.searchParams.set('year', searchFilters.year);
      else url.searchParams.delete('year');

      if (searchFilters.country) url.searchParams.set('country', searchFilters.country);
      else url.searchParams.delete('country');

      if (searchFilters.sort) url.searchParams.set('sort', searchFilters.sort);
      else url.searchParams.delete('sort');

      window.history.pushState({}, '', url.toString());
    }
  };

  const handleMediaAction = (action: string, item: any) => {
    const title = 'title' in item ? item.title : item.name;

    if (action === 'play') {
      toast.info(`Playing ${title}`);
    } else if (action === 'add') {
      // Add to watchlist
      const savedWatchlist = localStorage.getItem('watchlist');
      let watchlist: any[] = [];

      if (savedWatchlist) {
        try {
          watchlist = JSON.parse(savedWatchlist);
        } catch (error) {
          console.error('Error parsing watchlist:', error);
        }
      }

      if (!watchlist.some(i => i.id === item.id)) {
        watchlist.push(item);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        toast.success(`Added ${title} to watchlist`);
      } else {
        toast.info(`${title} is already in your watchlist`);
      }
    }
  };

  // Generate years for filter
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  // Countries for filter
  const countries = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  // Init search from URL params
  useEffect(() => {
    const initSearchFromParams = () => {
      // Wrap this in Suspense boundary
      <Suspense fallback={<div>Loading search parameters...</div>}>
        <SearchParamsWrapper>
          {(searchParams) => {
            const q = searchParams.get('q') || '';
            const genre = searchParams.get('genre') || '';
            const year = searchParams.get('year') || '';
            const country = searchParams.get('country') || '';
            const sort = searchParams.get('sort') || 'popularity.desc';

            if (q) {
              setQuery(q);
              setFilters({
                genre,
                year,
                country,
                sort,
              });

              performSearch(q, {
                genre,
                year,
                country,
                sort,
              });
            }

            return null;
          }}
        </SearchParamsWrapper>
      </Suspense>
    };

    initSearchFromParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <SearchBar
          genres={genres}
          years={years}
          countries={countries}
          expanded={true}
          defaultQuery={query}
          onSearch={handleSearch}
        />
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-color"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-md my-6">
          {error}
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="mb-4 text-secondary-text">
            Found {totalResults} results for "{query}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                type={'title' in item ? 'movie' : 'tv'}
                onAction={handleMediaAction}
              />
            ))}
          </div>
        </>
      ) : query ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h2 className="text-2xl mb-4">No results found</h2>
          <p className="text-secondary-text mb-6">
            We couldn't find any matches for "{query}". Please try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h2 className="text-2xl mb-4">Search for movies and TV shows</h2>
          <p className="text-secondary-text mb-6">
            Enter a search term to find movies and TV shows.
          </p>
        </div>
      )}
    </div>
  );
}
