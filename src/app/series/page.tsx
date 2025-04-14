'use client';

import { useState, useEffect, Suspense } from 'react';
import { MediaCard } from '@/components/ui/media-card';
import { SearchBar } from '@/components/ui/search-bar';
import { toast } from 'sonner';
import { Series, Genre } from '@/lib/tmdb-api';

async function getDataClientSide(): Promise<{ series: Series[]; genres: Genre[] }> {
  try {
    const [seriesRes, genresRes] = await Promise.all([
      fetch('/api/series'),
      fetch('/api/genres?type=tv')
    ]);

    if (!seriesRes.ok || !genresRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const series = await seriesRes.json();
    const genres = await genresRes.json();
    return { series, genres };

  } catch (error) {
    console.error("Error fetching data client-side:", error);
    toast.error('Fehler beim Laden der Serien.');
    return { series: [], genres: [] };
  }
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { series: fetchedSeries, genres: fetchedGenres } = await getDataClientSide();
      setSeries(fetchedSeries);
      setGenres(fetchedGenres);
      setFilteredSeries(fetchedSeries);
      setLoading(false);
    }
    loadData();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

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

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    toast.info('Filter werden angewendet...');
    let results = series;
    if (filters.query) {
        const queryLower = filters.query.toLowerCase();
        results = results.filter(s => s.name.toLowerCase().includes(queryLower));
    }
    setFilteredSeries(results);
  };

  const handleMediaAction = (action: string, item: Series) => {
    const title = item.name;
    if (action === 'play') {
      toast.info(`Playing ${title}...`);
    } else if (action === 'add') {
      toast.success(`${title} zur Watchlist hinzugefügt!`);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 pt-24">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-6">Serien</h1>
        <SearchBar
          genres={genres}
          years={years}
          countries={countries}
          onSearch={handleSearch}
          expanded={true}
        />
      </div>

      {loading ? (
        <p className="text-center">Lade Serien...</p>
      ) : (
         <>
          {filteredSeries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredSeries.map((show) => (
                    <MediaCard
                      key={show.id}
                      item={show}
                      type="tv"
                      onAction={handleMediaAction}
                    />
                  ))}
              </div>
          ) : (
              <p className="text-center text-muted-foreground">Keine Serien gefunden, die den Kriterien entsprechen.</p>
          )}
         </>
      )}
    </main>
  );
}
