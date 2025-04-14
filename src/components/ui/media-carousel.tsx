'use client';

import { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Movie, Series } from '@/lib/tmdb-api';
import { MediaCard } from './media-card';

interface MediaCarouselProps {
  title: string;
  items: (Movie | Series)[];
  type: 'movie' | 'tv' | 'history' | 'watchlist';
  onAction?: (action: 'play' | 'add' | 'remove' | 'info', item: Movie | Series) => void;
  featured?: boolean; // Highlight the first item as featured
}

export function MediaCarousel({ title, items, type, onAction, featured = false }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // For entrance animation and recalculating sizes
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update maxScroll when window resizes or items change
  useEffect(() => {
    const updateScrollData = () => {
      if (carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    updateScrollData();
    window.addEventListener('resize', updateScrollData);
    
    return () => {
      window.removeEventListener('resize', updateScrollData);
    };
  }, [items]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const position = carouselRef.current.scrollLeft;
      setScrollPosition(position);
      setShowLeftArrow(position > 0);
      setShowRightArrow(position < maxScroll - 5); // 5px buffer for browser rounding errors
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      const itemWidth = containerWidth > 768 ? containerWidth / 5 : containerWidth / 2.5; // Show 5 items on desktop, 2.5 on mobile
      const scrollAmount = Math.floor(itemWidth * (direction === 'left' ? -1 : 1));
      
      // Use the scroll animation
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <section 
      className={`px-4 md:px-6 mb-10 md:mb-16 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        transitionDelay: isVisible ? '100ms' : '0ms' 
      }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                showLeftArrow
                  ? 'bg-muted hover:bg-accent-color hover:text-white opacity-100'
                  : 'opacity-0 cursor-default'
              }`}
              aria-label="Scroll left"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                showRightArrow
                  ? 'bg-muted hover:bg-accent-color hover:text-white opacity-100'
                  : 'opacity-0 cursor-default'
              }`}
              aria-label="Scroll right"
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="relative flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {items.map((item, index) => (
            <div
              key={`${type}-${item.id}`}
              className={`${
                featured && index === 0 
                  ? 'min-w-[280px] md:min-w-[340px]' 
                  : 'min-w-[180px] md:min-w-[220px]'
              } snap-start`}
            >
              <MediaCard 
                item={item} 
                type={type} 
                onAction={onAction} 
                featured={featured && index === 0}
                index={index}
              />
            </div>
          ))}
          
          {/* Gradient fade at the end indicating more content */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          )}
        </div>
        
        {/* Scroll progress indicator */}
        {maxScroll > 0 && (
          <div className="mt-2 h-0.5 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-color transition-all duration-300 rounded-full"
              style={{ 
                width: `${maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0}%` 
              }}
            ></div>
          </div>
        )}
      </div>
    </section>
  );
}
