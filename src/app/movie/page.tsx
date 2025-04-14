'use client';

import { useState } from 'react';
import { MediaCard } from '@/components/ui/media-card';
import { SearchBar } from '@/components/ui/search-bar';
import { toast } from 'sonner';

// Mock-Daten für die Entwicklung und Demo
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
    poster_path: '/mBuZMXipxlT eBJfxXN2YZUdg6B.jpg',
    backdrop_path: '/x9v4Y1R1mXBvHx3yP9mNCmTumwk.jpg',
    release_date: '2024-04-12',
    vote_average: 7.8,
    genre_ids: [28, 18, 53],
    original_language: 'en',
  },
  {
    id: 3,
    title: 'Godzilla x Kong: The New Empire',
    overview: 'Godzilla and Kong team up to face a colossal threat hidden deep within the world.',
    poster_path: '/gMJngTNfaqCSCqGD4y8lVMZXKDn.jpg',
    backdrop_path: '/nHf61UzkfFno5X1ofIhugCPus2R.jpg',
    release_date: '2024-03-29',
    vote_average: 6.9,
    genre_ids: [878, 28, 12],
    original_language: 'en',
  },
  {
    id: 4,
    title: 'The Fall Guy',
    overview: 'After a near-fatal accident, a stuntman must track down a missing movie star.',
    poster_path: '/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg',
    backdrop_path: '/cH6rBA5WiF7nPxYnY1qcWxO9SSK.jpg',
    release_date: '2024-05-03',
    vote_average: 7.2,
    genre_ids: [28, 35, 10749],
    original_language: 'en',
  },
  {
    id: 5,
    title: 'Ghostbusters: Frozen Empire',
    overview: 'The Spengler family returns to where it all started – the iconic New York City firehouse.',
    poster_path: '/bKfMavRvjXLgCQ9IB9Vg0X1bLUt.jpg',
    backdrop_path: '/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
    release_date: '2024-03-22',
    vote_average: 7.0,
    genre_ids: [14, 35, 28],
    original_language: 'en',
  },
  {
    id: 6,
    title: 'Kung Fu Panda 4',
    overview: 'Po is gearing up to become the spiritual leader of his Valley of Peace.',
    poster_path: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop_path: '/gJL5kp5FMopB2sN4WZYnNT5uO4Y.jpg',
    release_date: '2024-03-08',
    vote_average: 7.0,
    genre_ids: [16, 12, 10751, 35],
    original_language: 'en',
  },
  {
    id: 7,
    title: 'Kingdom of the Planet of the Apes',
    overview: 'Many years after the reign of Caesar, a young ape goes on a journey that leads him to question everything.',
    poster_path: '/3OuShMVyZwKBQrESDfcWW4L8mGZ.jpg',
    backdrop_path: '/bX547SDHRUmjQTFLTpWL7tV6rCj.jpg',
    release_date: '2024-05-10',
    vote_average: 7.1,
    genre_ids: [28, 12, 878],
    original_language: 'en',
  },
  {
    id: 8,
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster_path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    release_date: '2023-07-19',
    vote_average: 8.2,
    genre_ids: [18, 36],
    original_language: 'en',
  },
  {
    id: 9,
    title: 'Inside Out 2',
    overview: 'Follow Riley in her teenage years as new emotions join the mix, including Anxiety.',
    poster_path: '/5gsjhnkvxCTlKpqUtecJlzmlM9S.jpg',
    backdrop_path: '/AprNYUAS2AJ3xVgg7Wwt00GVv1M.jpg',
    release_date: '2024-06-14',
    vote_average: 8.3,
    genre_ids: [16, 35, 10751],
    original_language: 'en',
  },
  {
    id: 10,
    title: 'Bad Boys: Ride or Die',
    overview: 'Miami detectives Mike Lowrey and Marcus Burnett are back and working with AMMO as they face new threats.',
    poster_path: '/lxfFM02wuLnyzExoJH2aHcSeRQn.jpg',
    backdrop_path: '/hvjibnFyzRAOtPvWexvPcBsYbk5.jpg',
    release_date: '2024-06-07',
    vote_average: 6.2,
    genre_ids: [28, 12, 35, 80],
    original_language: 'en',
  },
  {
    id: 11,
    title: 'Twisters',
    overview: 'Kate Cooper, a retired storm chaser haunted by a devastating encounter with a tornado during her college years, now studies storm patterns on screens in New York City.',
    poster_path: '/kPRb1mbVHBqVJ4CRgFAWO4HMqYL.jpg',
    backdrop_path: '/4CWbfn5l5jQt8t2l9wnH3cj64ON.jpg',
    release_date: '2024-07-19',
    vote_average: 7.0,
    genre_ids: [28, 12, 53],
    original_language: 'en',
  },
  {
    id: 12,
    title: 'Deadpool & Wolverine',
    overview: 'The merc with the mouth gets the merc with the adamantium claws as Deadpool and Wolverine team up in the Marvel Cinematic Universe.',
    poster_path: '/4yqWtNeGwmvZYoJ7rG6xw8u6Lzh.jpg',
    backdrop_path: '/vfvIyuMKFGpVSSSvLvQkLO78Sm.jpg',
    release_date: '2024-07-26',
    vote_average: 7.5,
    genre_ids: [28, 12, 35],
    original_language: 'en',
  },
];

// Mock-Genres für die Entwicklung und Demo
const mockGenres = [
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
];

export default function MoviesPage() {
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);

  // Generate years for filter
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  // Countries for filter
  const countries = [
    { code: 'US', name: 'USA' },
    { code: 'DE', name: 'Germany' },
    { code: 'GB', name: 'UK' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'Korea' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
  ];

  const handleSearch = (query: string, filters: any) => {
    let results = [...mockMovies];

    // Filter by search term
    if (query) {
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by genre
    if (filters.genre) {
      results = results.filter(movie =>
        movie.genre_ids.includes(Number(filters.genre))
      );
    }

    // Filter by year
    if (filters.year) {
      results = results.filter(movie =>
        movie.release_date.startsWith(filters.year)
      );
    }

    // Filter by country
    if (filters.country) {
      results = results.filter(movie =>
        movie.original_language === filters.country.toLowerCase()
      );
    }

    // Sort results
    if (filters.sort) {
      const [sortField, sortOrder] = filters.sort.split('.');
      results.sort((a, b) => {
        if (sortField === 'release_date') {
          return sortOrder === 'asc'
            ? a.release_date.localeCompare(b.release_date)
            : b.release_date.localeCompare(a.release_date);
        } else if (sortField === 'vote_average') {
          return sortOrder === 'asc'
            ? a.vote_average - b.vote_average
            : b.vote_average - a.vote_average;
        } else if (sortField === 'title') {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }

        return 0;
      });
    }

    setFilteredMovies(results);
  };

  const handleMediaAction = (action: string, item: any) => {
    const title = item.title;

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

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-6">Movies</h1>
        <SearchBar
          genres={mockGenres}
          years={years}
          countries={countries}
          expanded={true}
          onSearch={handleSearch}
        />
      </div>

      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h2 className="text-2xl mb-4">No movies found</h2>
          <p className="text-secondary-text mb-6">
            Try adjusting your search criteria to find more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => (
            <MediaCard
              key={movie.id}
              item={movie}
              type="movie"
              onAction={handleMediaAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
