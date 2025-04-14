import { NextResponse } from 'next/server';
import { apiEndpoints } from '@/lib/tmdb-api';
import { saveGenres, updateTrendingMovies, updateTrendingSeries } from '@/lib/db';

// GET handler for the API route
export async function GET() {
  try {
    // Sync all required data from TMDB
    const results = await syncAllData();
    
    // Return success response
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('API sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync data from TMDB' },
      { status: 500 }
    );
  }
}

// Function to sync all data from TMDB
async function syncAllData() {
  try {
    // Sync genres
    const movieGenresResponse = await apiEndpoints.getMovieGenres();
    const tvGenresResponse = await apiEndpoints.getTVGenres();
    
    // Combine genre lists and remove duplicates
    const allGenres = [
      ...movieGenresResponse.data.genres,
      ...tvGenresResponse.data.genres
    ];
    
    // Use a map to remove duplicates by ID
    const uniqueGenres = Array.from(
      new Map(allGenres.map(genre => [genre.id, genre])).values()
    );
    
    // Save genres to database
    const genresResult = await saveGenres(uniqueGenres);
    
    // Sync trending movies
    const trendingMoviesResponse = await apiEndpoints.getTrendingMovies();
    const trendingMoviesResult = await updateTrendingMovies(trendingMoviesResponse.data.results);
    
    // Sync trending TV series
    const trendingSeriesResponse = await apiEndpoints.getTrendingTVSeries();
    const trendingSeriesResult = await updateTrendingSeries(trendingSeriesResponse.data.results);
    
    // Return combined results
    return {
      success: true,
      genres: genresResult,
      trendingMovies: trendingMoviesResult,
      trendingSeries: trendingSeriesResult
    };
  } catch (error) {
    console.error('Sync data error:', error);
    throw error;
  }
} 