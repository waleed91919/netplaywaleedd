'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Movie, Series, getImageUrl, IMAGE_SIZES } from '@/lib/tmdb-api';
import { FaStar, FaPlay, FaPlus, FaMinus, FaTrash, FaInfoCircle } from 'react-icons/fa';

interface MediaCardProps {
  item: Movie | Series;
  type: 'movie' | 'tv' | 'history' | 'watchlist';
  onAction?: (action: 'play' | 'add' | 'remove' | 'info', item: Movie | Series) => void;
  featured?: boolean;
  index?: number; // Add index for staggered animations
}

export function MediaCard({ item, type, onAction, featured = false, index = 0 }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // For animated entrance
  useEffect(() => {
    // Simple delay based on index for staggered animation
    const timer = setTimeout(() => setIsInView(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = item.vote_average.toFixed(1);
  const posterPath = item.poster_path;
  const id = item.id;

  // Route based on item type
  const detailPath = type === 'movie'
    ? `/movie/${id}`
    : type === 'tv'
      ? `/series/${id}`
      : 'title' in item ? `/movie/${id}` : `/series/${id}`;

  const handleAction = (action: 'play' | 'add' | 'remove' | 'info') => {
    if (onAction) {
      onAction(action, item);
    }
  };

  const imageUrl = getImageUrl(posterPath, IMAGE_SIZES.poster.medium);

  return (
    <div 
      className={`transform transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Card
        className={`overflow-hidden border-none rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 ${
          featured ? 'scale-105 shadow-lg' : ''
        }`}
      >
        <div
          className="relative card-hover-effect"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-2 left-2 z-20 bg-accent-color text-white px-2 py-1 text-xs rounded-full animate-pulse-custom">
              Featured
            </div>
          )}

          {/* Main Content Link */}
          <Link href={detailPath} className="block relative aspect-[2/3] w-full overflow-hidden">
            {/* Image with zoom effect */}
            <div className="w-full h-full overflow-hidden">
              {imageUrl.startsWith('https') ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>
              )}
            </div>

            {/* Placeholder while loading */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-card">
                <div className="skeleton-loading w-full h-full"></div>
              </div>
            )}

            {/* Overlay gradient always present at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

            {/* Hover action overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/50 transition-all duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('play');
                }}
                className="bg-accent-color hover:bg-hover-color text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 duration-300"
                aria-label="Play"
              >
                <FaPlay className="text-sm" />
              </button>

              {(type === 'movie' || type === 'tv') && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction('add');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 duration-300"
                  aria-label="Add to watchlist"
                >
                  <FaPlus className="text-sm" />
                </button>
              )}

              {type === 'watchlist' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction('remove');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 duration-300"
                  aria-label="Remove from watchlist"
                >
                  <FaMinus className="text-sm" />
                </button>
              )}

              {type === 'history' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAction('remove');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 duration-300"
                  aria-label="Remove from history"
                >
                  <FaTrash className="text-sm" />
                </button>
              )}
            </div>

            {/* Info that appears on hover at the bottom */}
            <div 
              className={`absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-500 ${
                isHovered ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <h3 className="font-bold text-base text-white truncate">{title}</h3>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center text-sm text-white">
                  <FaStar className="text-rating-color mr-1" />
                  <span>{rating}</span>
                </div>
                <div className="text-sm text-white/80">
                  {year}
                </div>
              </div>
            </div>
          </Link>

          {/* Title - only visible when not hovered */}
          <div 
            className={`p-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <h3 className="font-medium text-sm truncate" title={title}>
              {title}
            </h3>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <FaStar className="text-rating-color text-[10px] mr-1" />
                <span>{rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {year}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
