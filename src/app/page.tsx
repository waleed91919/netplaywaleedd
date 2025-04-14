'use client';

import { HeroBanner } from '@/components/ui/hero-banner';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock-Daten für die Entwicklung und Demo
const mockTrendingMovies = [
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
  {
    id: 3,
    title: 'Thieves of the Wood',
    overview: 'Charismatic highwayman Jan de Lichte leads the oppressed and downtrodden in a revolt against the corrupt aristocracy of 18th-century Flanders.',
    poster_path: '/jQNOzoiaIQWxJAx8OUighnvnhRA.jpg', // Placeholder path
    backdrop_path: '/uUiIGztTrfDhPfAkQVBQCYcBxjt.jpg', // Placeholder path
    release_date: '2024-03-29',
    vote_average: 6.9,
    genre_ids: [878, 28, 12],
    original_language: 'en',
  },
];

const mockTrendingTVSeries = [
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
  {
    id: 124389,
    name: 'Fallout',
    overview: 'In a retrofuturistic world devastated by nuclear war, a vault dweller emerges into the wasteland.',
    poster_path: '/3Wz8TlfHuFQh7HsZCaqT1OmUvRC.jpg',
    backdrop_path: '/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg',
    first_air_date: '2024-04-11',
    vote_average: 8.2,
    genre_ids: [10765, 18, 10759],
    original_language: 'en',
  }
];

const mockPopularMovies = [
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
];

const mockPopularTVSeries = [
  {
    id: 76479,
    name: 'The Boys',
    overview: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    poster_path: '/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    backdrop_path: '/mGVrXeIjyecj6TKmwPVpHlscEmw.jpg',
    first_air_date: '2019-07-25',
    vote_average: 8.4,
    genre_ids: [10759, 10765],
    original_language: 'en',
  },
  {
    id: 60735,
    name: 'The Flash',
    overview: 'After being struck by lightning, Barry Allen wakes up from his coma to discover he\'s been given the power of super speed.',
    poster_path: '/4N2L2PqKSFVejG9aBuvUU7K6DNj.jpg',
    backdrop_path: '/8X2LC1P7tR6SRkLdQETJDVNIuU2.jpg',
    first_air_date: '2014-10-07',
    vote_average: 7.8,
    genre_ids: [18, 10765],
    original_language: 'en',
  },
  {
    id: 120168,
    name: 'Doctor Who',
    overview: 'The Doctor, a Time Lord from the race whose home planet is Gallifrey, travels through time and space in their ship the TARDIS.',
    poster_path: '/l1fPCGaYQlmCh9OT3Vgu3UNAJq.jpg',
    backdrop_path: '/kXJrECI3DkNX9jLXUU6wXzZXzZZ.jpg',
    first_air_date: '2023-11-25',
    vote_average: 7.2,
    genre_ids: [10759, 10765, 18],
    original_language: 'en',
  },
  {
    id: 215803,
    name: 'House of the Dragon',
    overview: 'The prequel series finds the Targaryen dynasty at the absolute apex of its power.',
    poster_path: '/72J25JvQtVc9i3FiqMoHvDNTF9H.jpg',
    backdrop_path: '/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg',
    first_air_date: '2022-08-21',
    vote_average: 8.4,
    genre_ids: [10765, 18, 10759],
    original_language: 'en',
  },
];

const mockTopRatedMovies = [
  {
    id: 278,
    title: 'The Shawshank Redemption',
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    release_date: '1994-09-23',
    vote_average: 8.7,
    genre_ids: [18, 80],
    original_language: 'en',
  },
  {
    id: 238,
    title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    release_date: '1972-03-14',
    vote_average: 8.7,
    genre_ids: [18, 80],
    original_language: 'en',
  },
  {
    id: 424,
    title: 'Schindler\'s List',
    overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis.',
    poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdrop_path: '/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg',
    release_date: '1993-12-15',
    vote_average: 8.6,
    genre_ids: [18, 36, 10752],
    original_language: 'en',
  },
  {
    id: 240,
    title: 'The Godfather Part II',
    overview: 'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York.',
    poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
    backdrop_path: '/poec6RqOKY9iSiIUmfyfPfiLtvB.jpg',
    release_date: '1974-12-20',
    vote_average: 8.6,
    genre_ids: [18, 80],
    original_language: 'en',
  },
];

// Combine hero items in stable order
const heroItems = [
  mockTrendingMovies[0],  // Dune: Part Two
  mockTrendingTVSeries[0], // Arcane
  mockTrendingMovies[1],  // Civil War
  mockTrendingTVSeries[1], // Shogun
  mockTrendingTVSeries[2], // Fallout
];

export default function Home() {
  const [initialized, setInitialized] = useState(false);

  // Only run this effect on the client side to prevent hydration mismatch
  useEffect(() => {
    setInitialized(true);
    
    // Add some space for the fixed header
    document.body.style.paddingTop = '64px'; 
    
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  const handleMediaAction = (action: string, item: any) => {
    const title = 'title' in item ? item.title : item.name;
    
    if (action === 'play') {
      toast.info(`Playing ${title}`, {
        position: 'bottom-center',
        duration: 3000,
      });
    } else if (action === 'add') {
      // Add to watchlist logic
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
        toast.success(`Added ${title} to watchlist`, {
          position: 'bottom-center',
          duration: 3000,
        });
      } else {
        toast.info(`${title} is already in your watchlist`, {
          position: 'bottom-center',
          duration: 3000,
        });
      }
    }
  };

  return (
    <>
      {initialized && (
        <main className="pb-20">
          {/* Hero Banner */}
          <HeroBanner
            items={heroItems}
            onPlay={(item) => handleMediaAction('play', item)}
          />

          {/* Content Sections */}
          <div className="mt-8 md:mt-12 space-y-12 md:space-y-16">
            {/* Featured Trending Movies Section */}
            <MediaCarousel
              title="Trending Movies"
              items={mockTrendingMovies}
              type="movie"
              onAction={handleMediaAction}
              featured={true}
            />

            {/* Trending TV Shows */}
            <MediaCarousel
              title="Trending TV Shows"
              items={mockTrendingTVSeries}
              type="tv"
              onAction={handleMediaAction}
              featured={true}
            />

            {/* Popular Movies */}
            <MediaCarousel
              title="Popular Movies"
              items={mockPopularMovies}
              type="movie"
              onAction={handleMediaAction}
            />

            {/* Popular TV Shows */}
            <MediaCarousel
              title="Popular TV Shows"
              items={mockPopularTVSeries}
              type="tv"
              onAction={handleMediaAction}
            />

            {/* Top Rated Movies */}
            <MediaCarousel
              title="Top Rated Movies"
              items={mockTopRatedMovies}
              type="movie"
              onAction={handleMediaAction}
            />
          </div>
        </main>
      )}
    </>
  );
}
