'use client';

import { useState, useEffect } from 'react';
import { MediaCard } from '@/components/ui/media-card';
import { Button } from '@/components/ui/button';
import { Movie, Series } from '@/lib/tmdb-api';
import { toast } from 'sonner';

// In a real application, this would come from a database or API
// For demo purposes, we'll use mock data and localStorage
const mockHistoryItems: (Movie | Series)[] = [
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
];

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<(Movie | Series)[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('watchHistory');
    if (savedHistory) {
      try {
        setHistoryItems(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing watch history:', error);
        setHistoryItems(mockHistoryItems);
      }
    } else {
      // Use mock data for demo
      setHistoryItems(mockHistoryItems);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (historyItems.length > 0) {
      localStorage.setItem('watchHistory', JSON.stringify(historyItems));
    }
  }, [historyItems]);

  const handleMediaAction = (action: string, item: Movie | Series) => {
    const title = 'title' in item ? item.title : item.name;

    if (action === 'play') {
      toast.info(`Playing ${title}`);
    } else if (action === 'remove') {
      setHistoryItems(prev => prev.filter(i => i.id !== item.id));
      toast.success(`Removed ${title} from history`);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      setHistoryItems([]);
      localStorage.removeItem('watchHistory');
      toast.success('Watch history cleared');
    }
  };

  return (
    <div>
      <div className="page-header mb-8 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Watch History</h1>

        <div className="flex gap-2">
          <Button
            variant={!editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(false)}
            className={!editMode ? 'bg-accent-color hover:bg-hover-color' : ''}
          >
            All
          </Button>
          <Button
            variant={editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(true)}
            className={editMode ? 'bg-accent-color hover:bg-hover-color' : ''}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={clearHistory}
          >
            Delete all
          </Button>
        </div>
      </div>

      {historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h2 className="text-2xl mb-4">Your watch history is empty</h2>
          <p className="text-secondary-text mb-6">
            When you watch movies or TV shows, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {historyItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              type="history"
              onAction={handleMediaAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
