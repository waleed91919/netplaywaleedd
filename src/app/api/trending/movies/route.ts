import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch trending movies with their details and genres
    const trendingMovies = await prisma.trendingMovie.findMany({
      include: {
        movie: {
          include: {
            genres: {
              include: {
                genre: true
              }
            }
          }
        }
      },
      orderBy: {
        rank: 'asc'
      }
    });

    // Transform the data to match the expected format
    const formattedMovies = trendingMovies.map((trending) => {
      const movie = trending.movie;
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.posterPath,
        backdrop_path: movie.backdropPath,
        release_date: movie.releaseDate ? movie.releaseDate.toISOString().split('T')[0] : null,
        vote_average: movie.voteAverage,
        genres: movie.genres.map((mg) => ({
          id: mg.genre.id,
          name: mg.genre.name
        })),
        original_language: movie.originalLanguage,
        runtime: movie.runtime,
        trending_rank: trending.rank
      };
    });

    return NextResponse.json(formattedMovies, { status: 200 });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
} 