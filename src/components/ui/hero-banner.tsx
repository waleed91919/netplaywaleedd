'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Movie, Series, getImageUrl, IMAGE_SIZES } from '@/lib/tmdb-api';
import { FaPlay, FaInfoCircle, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface HeroBannerProps {
  items: (Movie | Series)[];
  onPlay?: (item: Movie | Series) => void;
}

export function HeroBanner({ items, onPlay }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fix for hydration issue - only load/render on the client side
  useEffect(() => {
    setIsClient(true);
    setIsLoaded(true);
  }, []);

  // Banner auto-rotation
  useEffect(() => {
    if (!isClient) return;

    const startRotation = () => {
      if (items.length > 1) {
        intervalRef.current = setInterval(() => {
          goToNext();
        }, 8000); // Change banner every 8 seconds
      }
    };

    startRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items.length, isClient, currentIndex]);

  // Reset interval on manual navigation
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(goToNext, 8000);
    }
  };

  const goToNext = () => {
    setDirection('next');
    setIsTransitioning(true);
    setIsLoaded(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 100);
    }, 300);
  };

  const goToPrev = () => {
    setDirection('prev');
    setIsTransitioning(true);
    setIsLoaded(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 100);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setIsLoaded(false);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 100);
    }, 300);
    
    resetInterval();
  };

  if (!items.length) {
    return null;
  }

  // Always use first item for server-side rendering to prevent hydration mismatch
  // Client will take over after hydration completes
  const currentItem = isClient ? items[currentIndex] : items[0];
  const title = 'title' in currentItem ? currentItem.title : currentItem.name;
  const overview = currentItem.overview;
  const backdropPath = currentItem.backdrop_path;
  const releaseDate = 'release_date' in currentItem ? currentItem.release_date : currentItem.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = currentItem.vote_average.toFixed(1);
  const itemType = 'title' in currentItem ? 'movie' : 'tv';
  const detailPath = itemType === 'movie' ? `/movie/${currentItem.id}` : `/series/${currentItem.id}`;

  const handlePlay = () => {
    if (onPlay) {
      onPlay(currentItem);
    }
  };

  const imageUrl = getImageUrl(backdropPath, IMAGE_SIZES.backdrop.original);

  // Server side rendering with just the placeholder for initial load
  if (!isClient) {
    return (
      <section className="relative h-[80vh] md:h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/90"></div>
        <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-end pb-16">
          <div className="max-w-2xl animate-pulse">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent-color/30 backdrop-blur-sm mb-2">
              <div className="h-4 w-12 bg-gray-300 rounded"></div>
            </div>
            <div className="h-12 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-6"></div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-accent-color rounded"></div>
              <div className="h-10 w-28 bg-gray-500/50 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] md:h-[75vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black">
        <div 
          className={`w-full h-full transition-all duration-700 transform ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${
            direction === 'next' ? 'origin-left' : 'origin-right'
          }`}
        >
          {imageUrl.startsWith('https') ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background from-5% via-background/80 via-30% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 from-0% via-background/50 via-20% to-transparent"></div>
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-60 hover:opacity-100"
            aria-label="Previous banner"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <button 
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-60 hover:opacity-100"
            aria-label="Next banner"
          >
            <FaChevronRight className="text-lg" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-end pb-16">
        <div 
          className={`max-w-2xl transition-all duration-700 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Rating badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-color/30 backdrop-blur-sm mb-3">
            <FaStar className="text-rating-color mr-2" />
            <span className="text-sm font-medium text-white">{rating}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-4 text-white">{title}</h1>

          <div className="flex items-center gap-4 mb-4 text-sm md:text-base text-white/80">
            <span className="font-medium">{year}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-white text-xs font-medium uppercase">
              {itemType}
            </span>
          </div>

          <p className="text-sm md:text-base mb-8 line-clamp-3 text-white/80 max-w-xl">
            {overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              className="flex items-center gap-2 bg-button-bg hover:bg-button-hover text-white px-6 py-6 transition-transform hover:scale-105 shadow-md"
              onClick={handlePlay}
              size="lg"
            >
              <FaPlay className="text-sm" /> Play now
            </Button>
            <Link href={detailPath}>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-button-secondary-bg hover:bg-button-secondary-hover border-none text-white px-6 py-6 transition-transform hover:scale-105 shadow-md"
                size="lg"
              >
                <FaInfoCircle className="text-base" /> More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Banner indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-1 transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 bg-accent-color' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              aria-label={`Show banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
