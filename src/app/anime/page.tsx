'use client';

import { useState, useEffect } from 'react';
import { MediaCard } from '@/components/ui/media-card';
import { SearchBar } from '@/components/ui/search-bar';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { toast } from 'sonner';

// Mock-Daten für Anime
const mockPopularAnime = [
  {
    id: 94605,
    name: 'Arcane',
    overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war.',
    poster_path: '/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    backdrop_path: '/q54qEgagGOYCq5D1903eBVMNkbo.jpg',
    first_air_date: '2021-11-06',
    vote_average: 8.7,
    genre_ids: [16, 10765, 10759, 18],
    original_language: 'en'
  },
  {
    id: 85271,
    name: 'Attack on Titan',
    overview: 'Humans are nearly extinct after giant humanoid Titans appeared and began to feast on human flesh. Those who survived built three enormous walls to keep the Titans out.',
    poster_path: '/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    backdrop_path: '/2G5w4P0DZ6Zt6uJEJl6s4pZ5gqt.jpg',
    first_air_date: '2013-04-07',
    vote_average: 8.6,
    genre_ids: [16, 10759, 10765, 18],
    original_language: 'ja'
  },
  {
    id: 57911,
    name: 'One Punch Man',
    overview: `Saitama is a hero who only became a hero for fun. After three years of "special" training, though, he's become so strong that he's practically invincible.`,
    poster_path: '/iE3s0lG5QVdEHOEZnoAxjmMtvne.jpg',
    backdrop_path: '/s0w8JbuNNxL1YgaHeDWih12C3jG.jpg',
    first_air_date: '2015-10-04',
    vote_average: 8.4,
    genre_ids: [16, 10759, 35],
    original_language: 'ja'
  },
  {
    id: 1429,
    name: 'Dragon Ball Z',
    overview: 'Five years have passed since the fight with Piccolo Jr., and Goku now has a son, Gohan. The peace is interrupted when an alien named Raditz arrives on Earth in a spacecraft.',
    poster_path: '/f2zhRLqwRLrKhEMeIM7Z5buWFQ8.jpg',
    backdrop_path: '/5mVcAbbsjS8wX1p4DHUQicpRzR1.jpg',
    first_air_date: '1989-04-26',
    vote_average: 8.2,
    genre_ids: [16, 10759, 10765],
    original_language: 'ja'
  },
  {
    id: 37854,
    name: 'My Hero Academia',
    overview: 'In a world where eighty percent of the population has some kind of super-powered Quirk, Izuku was unlucky enough to be born completely normal.',
    poster_path: '/ivOLM47yJt90P19RH1NvJrAJz9F.jpg',
    backdrop_path: '/9vYiQyJjn24wxvxX7VMP0KS52Vt.jpg',
    first_air_date: '2016-04-03',
    vote_average: 8.7,
    genre_ids: [16, 10759, 10765],
    original_language: 'ja'
  },
  {
    id: 1704,
    name: 'Naruto Shippūden',
    overview: 'Naruto Shippuuden is the continuation of the original animated TV series Naruto.',
    poster_path: '/q0VhCO7OQSIjPj8lMK9PTvEVQl2.jpg',
    backdrop_path: '/jbRXEMnJYCRFsKRJ5pfz54xPrTI.jpg',
    first_air_date: '2007-02-15',
    vote_average: 8.6,
    genre_ids: [16, 10759, 10765],
    original_language: 'ja'
  }
];

const mockTrendingAnime = [
  {
    id: 2778,
    name: 'Jujutsu Kaisen',
    overview: 'A boy fights... for "the right death." Hardship, regret, shame: the negative feelings that humans feel become Curses that lurk in our everyday lives.',
    poster_path: '/fHoPoPLJQrgxaKTH8L3nkGxBB0Y.jpg',
    backdrop_path: '/6pRYHUNKbsGCnCQ44J0zh9m6Jxr.jpg',
    first_air_date: '2020-10-03',
    vote_average: 8.6,
    genre_ids: [16, 10759, 10765, 9648],
    original_language: 'ja'
  },
  {
    id: 65930,
    name: 'Demon Slayer: Kimetsu no Yaiba',
    overview: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon.',
    poster_path: '/hnbXJI1MRT1I4c7huNbxXxZ6fiQ.jpg',
    backdrop_path: '/m3dH4G2KxlYNhQ4vJYWvUASkGBj.jpg',
    first_air_date: '2019-04-06',
    vote_average: 8.6,
    genre_ids: [16, 10759, 10765],
    original_language: 'ja'
  },
  {
    id: 114410,
    name: 'Tokyo Revengers',
    overview: `Takemichi Hanagaki is a freelancer that's reached the absolute pits of despair in his life.`,
    poster_path: '/70GrWaiAbFefGLvdXCva3kqgVk8.jpg',
    backdrop_path: '/piGiXqPtILHIkMzQlFyzszcspEc.jpg',
    first_air_date: '2021-04-11',
    vote_average: 8.5,
    genre_ids: [16, 10759, 18],
    original_language: 'ja'
  },
  {
    id: 210945,
    name: 'Frieren: Beyond Journey\'s End',
    overview: 'The adventurer party of Frieren the Mage, Hero Himmel, Warrior Eisen, and Priest Heiter go on a quest to defeat the Demon King, which they accomplish.',
    poster_path: '/kSBz5hm4BTw4XcQV7azKbDKqNE2.jpg',
    backdrop_path: '/rnDNHQgKuCr96EHfKRCvRQ2VfCF.jpg',
    first_air_date: '2023-09-29',
    vote_average: 8.3,
    genre_ids: [16, 10765, 10759],
    original_language: 'ja'
  }
];

const mockClassicAnime = [
  {
    id: 30984,
    name: 'Neon Genesis Evangelion',
    overview: 'At the turn of the century, the Angels returned to Earth, seeking to wipe out humanity in an apocalyptic fury. Only NERV, a special United Nations agency equipped with giant biomechanical mechas called Evangelions, can stop them.',
    poster_path: '/z7J2pfqwQKhRoUlSKe4dIZFB6E3.jpg',
    backdrop_path: '/ueJszyFeDJixeWtCwj3nDQGBZrp.jpg',
    first_air_date: '1995-10-04',
    vote_average: 8.5,
    genre_ids: [16, 10765, 18],
    original_language: 'ja'
  },
  {
    id: 33,
    name: 'Cowboy Bebop',
    overview: 'In 2071, roughly fifty years after an accident with a hyperspace gateway made the Earth almost uninhabitable, humanity has colonized most of the rocky planets and moons of the Solar System.',
    poster_path: '/kWe6MZdcKcGiWyZUXSsYLM15LDw.jpg',
    backdrop_path: '/sNNFLEcAuy4C3RyXCnKoArn7Aty.jpg',
    first_air_date: '1998-04-03',
    vote_average: 8.6,
    genre_ids: [16, 10759, 10765, 18],
    original_language: 'ja'
  },
  {
    id: 1691,
    name: 'Fullmetal Alchemist: Brotherhood',
    overview: 'Edward and Alphonse Elric are two brothers gifted with the ability of alchemy. After trying to revive their dead mother, Edward lost his arm and leg, and Al lost his entire body.',
    poster_path: '/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg',
    backdrop_path: '/2XS0xFGGRQOvmpK7zZZL0jhXtA4.jpg',
    first_air_date: '2009-04-05',
    vote_average: 8.8,
    genre_ids: [16, 10759, 10765, 18],
    original_language: 'ja'
  },
  {
    id: 37716,
    name: 'Death Note',
    overview: `Light Yagami is an ace student with great prospects—and he's bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god.`,
    poster_path: '/g8hHbsRmHYbPh2nKyhJLH2zXxEW.jpg',
    backdrop_path: '/4VFkbr2znwP0gA9Q9RKZmIuUL4Z.jpg',
    first_air_date: '2006-10-04',
    vote_average: 8.5,
    genre_ids: [16, 9648, 10765, 80],
    original_language: 'ja'
  }
];

// Anime genres for filter
const animeGenres = [
  { id: 16, name: 'Animation' },
  { id: 10759, name: 'Action & Adventure' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 18, name: 'Drama' },
  { id: 35, name: 'Comedy' },
  { id: 9648, name: 'Mystery' },
  { id: 80, name: 'Crime' },
  { id: 10768, name: 'War & Politics' },
];

export default function AnimePage() {
  const [initialized, setInitialized] = useState(false);
  const [filteredAnime, setFilteredAnime] = useState([...mockPopularAnime, ...mockTrendingAnime, ...mockClassicAnime]);

  // Only run this effect on the client side to prevent hydration mismatch
  useEffect(() => {
    setInitialized(true);
  }, []);
  
  // Generate years for filter
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => (currentYear - i).toString());

  // For anime, we focus on Japanese content
  const countries = [
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'Korea' },
    { code: 'CN', name: 'China' },
    { code: 'US', name: 'USA' },
  ];

  // Anime-specific formats
  const formats = [
    { id: 'tv', name: 'TV Series' },
    { id: 'movie', name: 'Movie' },
    { id: 'ova', name: 'OVA' },
    { id: 'special', name: 'Special' },
  ];

  const handleSearch = (filters: any) => {
    // In a real app, we would make API calls here with the filters
    // For this demo, we'll just log the filters and show a toast
    console.log('Search filters:', filters);
    toast.info('Suche mit Filtern...');
    
    // Simulate filtering - in real app this would be server-side
    let results = [...mockPopularAnime, ...mockTrendingAnime, ...mockClassicAnime];
    
    // Simple client-side filtering for demo
    if (filters.query) {
      const searchTerms = filters.query.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerms) || 
        (item.overview && item.overview.toLowerCase().includes(searchTerms))
      );
    }
    
    setFilteredAnime(results.length > 0 ? results : [...mockPopularAnime]);
  };

  const handleMediaAction = (action: string, item: any) => {
    const title = item.name;
    
    if (action === 'play') {
      toast.info(`Playing ${title}`, {
        position: 'bottom-center',
        duration: 3000,
      });
    } else if (action === 'add') {
      toast.success(`Added ${title} to watchlist`, {
        position: 'bottom-center',
        duration: 3000,
      });
    }
  };

  return (
    <>
      {initialized && (
        <main className="pb-20 pt-20">
          <div className="px-4 md:px-6">
            <div className="max-w-screen-2xl mx-auto">
              {/* Header with title and search */}
              <div className="flex flex-col mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Anime</h1>
                <SearchBar
                  genres={animeGenres}
                  years={years}
                  countries={countries}
                  onSearch={handleSearch}
                  expanded={true}
                />
              </div>

              {/* Content Sections */}
              <div className="mt-8 space-y-12 md:space-y-16">
                {/* Trending Anime - Client Komponente Wrapper hinzufügen */}
                <ClientMediaCarousel
                  title="Trending Anime"
                  items={mockTrendingAnime}
                  type="tv"
                  onAction={handleMediaAction}
                  featured={true}
                />

                {/* Popular Anime */}
                <ClientMediaCarousel
                  title="Beliebte Anime"
                  items={mockPopularAnime}
                  type="tv"
                  onAction={handleMediaAction}
                />

                {/* Classic Anime */}
                <ClientMediaCarousel
                  title="Klassische Anime"
                  items={mockClassicAnime}
                  type="tv"
                  onAction={handleMediaAction}
                />
              </div>

              {/* Browse All Section */}
              <div className="mt-16">
                <h2 className="section-title mb-8">Alle Anime</h2>
                
                {filteredAnime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredAnime.map((show, index) => (
                      <ClientMediaCard
                        key={`all-${show.id}`}
                        item={show}
                        type="tv"
                        onAction={handleMediaAction}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">Keine Anime mit diesen Filterkriterien gefunden.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

// Client Wrappers für unsere Komponenten
const ClientMediaCard = ({ item, type, onAction, index }: any) => {
  return (
    <MediaCard 
      item={item}
      type={type}
      onAction={onAction}
      index={index}
    />
  );
};

const ClientMediaCarousel = ({ title, items, type, onAction, featured = false }: any) => {
  return (
    <MediaCarousel
      title={title}
      items={items}
      type={type}
      onAction={onAction}
      featured={featured}
    />
  );
};
