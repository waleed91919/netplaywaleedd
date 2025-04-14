import { PrismaClient } from '@prisma/client';
import { Movie as TMDBMovie, Series as TMDBSeries } from './tmdb-api';

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Helper function to convert TMDB Movie to Prisma Movie format
export const tmdbMovieToPrisma = (movie: TMDBMovie) => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview || null,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
    voteAverage: movie.vote_average,
    originalLanguage: movie.original_language,
    runtime: movie.runtime || null,
    popularity: 0, // Set default value
  };
};

// Helper function to convert TMDB Series to Prisma Series format
export const tmdbSeriesToPrisma = (series: TMDBSeries) => {
  return {
    id: series.id,
    name: series.name,
    overview: series.overview || null,
    posterPath: series.poster_path,
    backdropPath: series.backdrop_path,
    firstAirDate: series.first_air_date ? new Date(series.first_air_date) : null,
    voteAverage: series.vote_average,
    originalLanguage: series.original_language,
    numberOfSeasons: null, // Requires additional API call
    numberOfEpisodes: null, // Requires additional API call
    popularity: 0, // Set default value
  };
};

// Function to save movie to database
export async function saveMovie(movie: TMDBMovie) {
  try {
    const movieData = tmdbMovieToPrisma(movie);
    
    // Use upsert to handle both insert and update
    const result = await prisma.movie.upsert({
      where: { id: movie.id },
      update: movieData,
      create: movieData,
    });
    
    // Handle genres if available
    if (movie.genre_ids && movie.genre_ids.length > 0) {
      // Delete existing connections first to avoid duplicates
      await prisma.movieGenre.deleteMany({
        where: { movieId: movie.id },
      });
      
      // Create new connections
      for (const genreId of movie.genre_ids) {
        await prisma.movieGenre.create({
          data: {
            movieId: movie.id,
            genreId: genreId,
          },
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error saving movie:', error);
    throw error;
  }
}

// Function to save series to database
export async function saveSeries(series: TMDBSeries) {
  try {
    const seriesData = tmdbSeriesToPrisma(series);
    
    // Use upsert to handle both insert and update
    const result = await prisma.series.upsert({
      where: { id: series.id },
      update: seriesData,
      create: seriesData,
    });
    
    // Handle genres if available
    if (series.genre_ids && series.genre_ids.length > 0) {
      // Delete existing connections first to avoid duplicates
      await prisma.seriesGenre.deleteMany({
        where: { seriesId: series.id },
      });
      
      // Create new connections
      for (const genreId of series.genre_ids) {
        await prisma.seriesGenre.create({
          data: {
            seriesId: series.id,
            genreId: genreId,
          },
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error saving series:', error);
    throw error;
  }
}

// Function to update trending movies
export async function updateTrendingMovies(movies: TMDBMovie[]) {
  try {
    // First clear all existing trending movies
    await prisma.trendingMovie.deleteMany({});
    
    // Then save each movie and add to trending
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      
      // Save or update the movie first
      await saveMovie(movie);
      
      // Add to trending with rank
      await prisma.trendingMovie.create({
        data: {
          movieId: movie.id,
          rank: i + 1,
        }
      });
    }
    
    return { success: true, count: movies.length };
  } catch (error) {
    console.error('Error updating trending movies:', error);
    throw error;
  }
}

// Function to update trending series
export async function updateTrendingSeries(series: TMDBSeries[]) {
  try {
    // First clear all existing trending series
    await prisma.trendingSeries.deleteMany({});
    
    // Then save each series and add to trending
    for (let i = 0; i < series.length; i++) {
      const show = series[i];
      
      // Save or update the series first
      await saveSeries(show);
      
      // Add to trending with rank
      await prisma.trendingSeries.create({
        data: {
          seriesId: show.id,
          rank: i + 1,
        }
      });
    }
    
    return { success: true, count: series.length };
  } catch (error) {
    console.error('Error updating trending series:', error);
    throw error;
  }
}

// Function to save genres
export async function saveGenres(genres: { id: number, name: string }[]) {
  try {
    for (const genre of genres) {
      await prisma.genre.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: { id: genre.id, name: genre.name },
      });
    }
    
    return { success: true, count: genres.length };
  } catch (error) {
    console.error('Error saving genres:', error);
    throw error;
  }
} 