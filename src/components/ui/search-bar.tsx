'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';
import { Genre } from '@/lib/tmdb-api';

interface SearchBarProps {
  genres?: Genre[];
  years?: string[];
  countries?: { code: string; name: string }[];
  expanded?: boolean;
  defaultQuery?: string;
  onSearch?: (query: string, filters: SearchFilters) => void;
}

export interface SearchFilters {
  genre?: string;
  year?: string;
  country?: string;
  sort?: string;
}

export function SearchBar({
  genres = [],
  years = [],
  countries = [],
  expanded = false,
  defaultQuery = '',
  onSearch
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [query, setQuery] = useState(defaultQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (onSearch) {
      onSearch(query, filters);
    } else {
      // Default behavior: Navigate to search page with query params
      const searchParams = new URLSearchParams();

      if (query) searchParams.set('q', query);
      if (filters.genre) searchParams.set('genre', filters.genre);
      if (filters.year) searchParams.set('year', filters.year);
      if (filters.country) searchParams.set('country', filters.country);
      if (filters.sort) searchParams.set('sort', filters.sort);

      router.push(`/search?${searchParams.toString()}`);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value !== 'all' ? value : undefined }));
  };

  return (
    <div className={`bg-secondary-bg px-4 py-3 transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}>
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 mb-3">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Suche nach Filmen, Serien, Anime..."
            className="bg-primary-bg border-border text-primary-text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-accent-color hover:bg-hover-color text-white p-2 rounded-md"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <select
                className="w-full bg-primary-bg border border-border text-primary-text rounded-md p-2"
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                value={filters.genre || 'all'}
              >
                <option value="all">Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="w-full bg-primary-bg border border-border text-primary-text rounded-md p-2"
                onChange={(e) => handleFilterChange('year', e.target.value)}
                value={filters.year || 'all'}
              >
                <option value="all">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="w-full bg-primary-bg border border-border text-primary-text rounded-md p-2"
                onChange={(e) => handleFilterChange('country', e.target.value)}
                value={filters.country || 'all'}
              >
                <option value="all">Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="w-full bg-primary-bg border border-border text-primary-text rounded-md p-2"
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                value={filters.sort || 'popularity.desc'}
              >
                <option value="popularity.desc">Sort by: Popularity</option>
                <option value="vote_average.desc">Sort by: Rating</option>
                <option value="release_date.desc">Sort by: Newest</option>
                <option value="release_date.asc">Sort by: Oldest</option>
                <option value="original_title.asc">Sort by: A-Z</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
