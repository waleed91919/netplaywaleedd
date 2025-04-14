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
    
    // Fetch series with pagination
    const seriesList = await prisma.series.findMany({
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
    const total = await prisma.series.count({ where });
    
    // Transform the data to match the expected format
    const formattedSeries = seriesList.map((series) => {
      return {
        id: series.id,
        name: series.name,
        overview: series.overview,
        poster_path: series.posterPath,
        backdrop_path: series.backdropPath,
        first_air_date: series.firstAirDate ? series.firstAirDate.toISOString().split('T')[0] : null,
        vote_average: series.voteAverage,
        genres: series.genres.map((sg) => ({
          id: sg.genre.id,
          name: sg.genre.name
        })),
        original_language: series.originalLanguage,
        number_of_seasons: series.numberOfSeasons,
        number_of_episodes: series.numberOfEpisodes
      };
    });
    
    return NextResponse.json({
      results: formattedSeries,
      page,
      total_pages: Math.ceil(total / limit),
      total_results: total
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
} 