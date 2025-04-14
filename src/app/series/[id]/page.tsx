'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { apiEndpoints, getImageUrl, IMAGE_SIZES, Series } from '@/lib/tmdb-api';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { toast } from 'sonner';

interface SeriesPageProps {
  params: {
    id: string;
  };
}

async function fetchSeriesData(id: string): Promise<{ series: Series | null; similarSeries: Series[] }> {
  try {
    const seriesId = parseInt(id);
    const seriesDetailsResponse = await apiEndpoints.getTVSeriesById(seriesId);
    const seriesData = seriesDetailsResponse.data;

    let similarSeriesResponse = { data: { results: [] } };
    if (seriesData && seriesData.genres && seriesData.genres.length > 0) {
      const firstGenreId = seriesData.genres[0].id;
      similarSeriesResponse = await apiEndpoints.getTVSeriesByGenre(firstGenreId, 1);
    }

    return {
      series: seriesData,
      similarSeries: similarSeriesResponse.data.results
        .filter((s: Series) => s.id !== seriesId)
        .slice(0, 10),
    };
  } catch (error: any) {
    console.error(`Error fetching series data for ID ${id}:`, error.message);
    if (error.response && error.response.status === 404) {
      console.warn(`Series with ID ${id} not found.`);
      toast.error('Serie nicht gefunden.');
    } else {
      toast.error('Fehler beim Laden der Seriendetails.');
    }
    return { series: null, similarSeries: [] };
  }
}

export default function SeriesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [series, setSeries] = useState<Series | null>(null);
  const [similarSeries, setSimilarSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSeriesData(id).then(data => {
        setSeries(data.series);
        setSimilarSeries(data.similarSeries);
        setLoading(false);
      });
    }
  }, [id]);

  const handlePlay = () => {
    if (!series) return;
    toast.info(`Playing ${series.name}...`, { position: 'bottom-center' });
  };

  const handleAddToWatchlist = () => {
    if (!series) return;
    toast.success(`${series.name} added to watchlist!`, { position: 'bottom-center' });
  };

  const handleMediaAction = (action: string, item: Series) => {
    const title = item.name;
    if (action === 'play') {
      toast.info(`Playing ${title}`, { position: 'bottom-center' });
    } else if (action === 'add') {
      toast.success(`Added ${title} to watchlist`, { position: 'bottom-center' });
    }
  };

  const formatRuntime = (minutesArray?: number[]): string => {
    if (!minutesArray || minutesArray.length === 0) return '';
    const minutes = minutesArray[0];
    if (typeof minutes !== 'number' || minutes <= 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Lade Seriendetails...</p></div>;
  }

  if (!series) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
        <h1 className="text-2xl mb-4">Serie nicht gefunden</h1>
        <Button variant="secondary" onClick={() => router.push('/series')} className="flex items-center gap-2">
          <FaArrowLeft /> Zurück zur Serienübersicht
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[70vh] mb-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {series.backdrop_path && (
            <Image
              src={getImageUrl(series.backdrop_path, IMAGE_SIZES.backdrop.original)}
              alt={`${series.name} backdrop`}
              fill
              priority
              className="object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent md:bg-gradient-to-r md:from-background md:via-background/70 md:to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="shrink-0 w-[180px] sm:w-[220px] md:w-[280px] lg:w-[300px] rounded-lg overflow-hidden shadow-2xl -mb-20 md:mb-0">
            {series.poster_path && (
              <Image
                src={getImageUrl(series.poster_path, IMAGE_SIZES.poster.large)}
                alt={`${series.name} poster`}
                width={300}
                height={450}
                className="w-full h-auto"
              />
            )}
          </div>

          <div className="flex-1 flex flex-col text-center md:text-left pt-8 md:pt-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-primary-text">{series.name}</h1>

            {series.tagline && (
              <p className="text-secondary-text text-lg italic mb-4">{series.tagline}</p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mb-4 text-secondary-text text-sm">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="text-primary-text font-semibold">{series.vote_average?.toFixed(1) ?? 'N/A'}</span>
              </div>

              {series.first_air_date && (
                <span>{new Date(series.first_air_date).getFullYear()}</span>
              )}

              {formatRuntime(series.episode_run_time) && (
                <span>{formatRuntime(series.episode_run_time)} / Episode</span>
              )}

              {series.number_of_seasons != null && (
                <span>{series.number_of_seasons} {series.number_of_seasons === 1 ? 'Staffel' : 'Staffeln'}</span>
              )}
            </div>

            {series.genres && series.genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {series.genres.map(genre => (
                  <Link
                    key={genre.id}
                    href={`/series?genre=${genre.id}`}
                    className="px-3 py-1 bg-secondary-bg rounded-full text-xs text-secondary-text hover:bg-card-bg hover:text-primary-text transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            <p className="text-base text-primary-text mb-6 line-clamp-3 md:line-clamp-4">{series.overview}</p>

            <div className="flex justify-center md:justify-start flex-wrap gap-3">
              <Button onClick={handlePlay} className="flex items-center gap-2 bg-accent-color hover:bg-hover-color text-white">
                <FaPlay /> Jetzt ansehen
              </Button>
              <Button onClick={handleAddToWatchlist} variant="secondary" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white">
                <FaPlus /> Zur Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {similarSeries.length > 0 && (
          <MediaCarousel
            title="Ähnliche Serien"
            items={similarSeries}
            type="tv"
            onAction={handleMediaAction}
          />
        )}
      </div>
    </>
  );
}
