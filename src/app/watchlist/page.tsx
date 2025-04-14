'use client';

import { useState, useEffect } from 'react';
import { MediaCard } from '@/components/ui/media-card';
import { Button } from '@/components/ui/button';
import { Movie, Series } from '@/lib/tmdb-api';
import { toast } from 'sonner';

// Mock data for demonstration
const mockWatchlistItems: (Movie | Series)[] = [
  {
    id: 638507,
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
    id: 134224,
    name: 'Shōgun',
    overview: 'An English navigator becomes a samurai in feudal Japan.',
    poster_path: '/A2U4dFGUHtfDxbmT1nh05dJeG6c.jpg',
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
  },
];

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<(Movie | Series)[]>([]);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        setWatchlistItems(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error parsing watchlist:', error);
        setWatchlistItems(mockWatchlistItems);
      }
    } else {
      // Use mock data for demo
      setWatchlistItems(mockWatchlistItems);
    }
  }, []);

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    if (watchlistItems.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlistItems));
    }
  }, [watchlistItems]);

  const handleMediaAction = (action: string, item: Movie | Series) => {
    const title = 'title' in item ? item.title : item.name;

    if (action === 'play') {
      toast.info(`Playing ${title}`);
    } else if (action === 'remove') {
      setWatchlistItems(prev => prev.filter(i => i.id !== item.id));
      toast.success(`Removed ${title} from watchlist`);
    }
  };

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      setWatchlistItems([]);
      localStorage.removeItem('watchlist');
      toast.success('Watchlist cleared');
    }
  };

  return (
    <div>
      <div className="page-header mb-8 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">My Watchlist</h1>

        {watchlistItems.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearWatchlist}
          >
            Clear Watchlist
          </Button>
        )}
      </div>

      {watchlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h2 className="text-2xl mb-4">Your watchlist is empty</h2>
          <p className="text-secondary-text mb-6">
            Add movies and TV shows to your watchlist to keep track of what you want to watch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlistItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              type="watchlist"
              onAction={handleMediaAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
