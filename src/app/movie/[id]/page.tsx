import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { apiEndpoints, getImageUrl, IMAGE_SIZES } from '@/lib/tmdb-api';
import { MediaCarousel } from '@/components/ui/media-carousel';

interface MoviePageProps {
  params: {
    id: string;
  };
}

async function getMovieData(id: string) {
  try {
    const movieId = parseInt(id);
    const [movieDetails, similarMovies] = await Promise.all([
      apiEndpoints.getMovieById(movieId),
      apiEndpoints.getMoviesByGenre(movieDetails?.data?.genres?.[0]?.id || 0),
    ]);

    return {
      movie: movieDetails.data,
      similarMovies: similarMovies.data.results.filter(m => m.id !== movieId).slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return { movie: null, similarMovies: [] };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movie, similarMovies } = await getMovieData(params.id);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl mb-4">Movie not found</h1>
        <Link href="/movie">
          <Button variant="secondary" className="flex items-center gap-2">
            <FaArrowLeft /> Go back to movies
          </Button>
        </Link>
      </div>
    );
  }

  // Format runtime (in minutes) to hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] mb-8">
        {/* Backdrop Image */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Image
            src={getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.original)}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Poster */}
          <div className="shrink-0 w-[200px] md:w-[300px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(movie.poster_path, IMAGE_SIZES.poster.large)}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full h-auto"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center md:justify-start">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-secondary-text text-lg italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>

              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}

              {movie.runtime && (
                <span>{formatRuntime(movie.runtime)}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map(genre => (
                <Link
                  key={genre.id}
                  href={`/movie?genre=${genre.id}`}
                  className="px-3 py-1 bg-secondary-bg rounded-full text-sm hover:bg-card-bg transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <p className="text-base mb-6">{movie.overview}</p>

            <div className="flex flex-wrap gap-3">
              <Button
                className="flex items-center gap-2 bg-accent-color hover:bg-hover-color text-white"
              >
                <FaPlay /> Play now
              </Button>
              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white"
              >
                <FaPlus /> Add to watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4">
          <MediaCarousel
            title="Similar Movies"
            items={similarMovies}
            type="movie"
          />
        </div>
      )}
    </div>
  );
}
