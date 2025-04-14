import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const genreId = searchParams.get('genreId') ? Number(searchParams.get('genreId')) : undefined;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build query filters
    const where = genreId ? {
      genres: {
        some: {
          genreId
        }
      }
    } : {};
    
    // Fetch movies with pagination
    const movies = await prisma.movie.findMany({
      where,
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: {
        popularity: 'desc'
      },
      skip,
      take: limit
    });
    
    // Get total count for pagination
    const total = await prisma.movie.count({ where });
    
    // Transform the data to match the expected format
    const formattedMovies = movies.map((movie) => {
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
        runtime: movie.runtime
      };
    });
    
    return NextResponse.json({
      results: formattedMovies,
      page,
      total_pages: Math.ceil(total / limit),
      total_results: total
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
} 