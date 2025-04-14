import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch trending series with their details and genres
    const trendingSeries = await prisma.trendingSeries.findMany({
      include: {
        series: {
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
    const formattedSeries = trendingSeries.map((trending) => {
      const series = trending.series;
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
        number_of_episodes: series.numberOfEpisodes,
        trending_rank: trending.rank
      };
    });

    return NextResponse.json(formattedSeries, { status: 200 });
  } catch (error) {
    console.error('Error fetching trending series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending series' },
      { status: 500 }
    );
  }
} 