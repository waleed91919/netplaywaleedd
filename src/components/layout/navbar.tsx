'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { SearchBar } from '../ui/search-bar';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '../ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Listen for scroll to add background/shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const NavItem = ({ path, label, isMobile = false }: { path: string; label: string; isMobile?: boolean }) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);

    return (
      <li className={`relative ${isMobile ? 'w-full' : ''}`}>
        <Link
          href={path}
          className={`${isMobile ? 'block w-full py-3 text-center' : 'text-sm font-semibold'} 
            hover:text-accent-color transition-colors duration-300 
            ${isActive ? 'text-nav-active' : 'text-foreground'}`}
        >
          {label}
        </Link>
        {isActive && (
          <span className={`absolute ${isMobile ? '-left-2 top-0 h-full w-[3px]' : '-bottom-[10px] left-0 w-full h-[3px]'} bg-nav-active`}></span>
        )}
      </li>
    );
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];

    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year.toString());
    }

    return years;
  };

  const countries = [
    { code: 'US', name: 'USA' },
    { code: 'DE', name: 'Germany' },
    { code: 'GB', name: 'UK' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'Korea' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-gradient-to-b from-background/80 to-transparent'}`}>
      <nav className="flex justify-between items-center px-4 md:px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-accent-color flex items-center space-x-2 group">
          <span className="transform transition-transform group-hover:scale-110 duration-300">Net</span>
          <span className="transform transition-transform group-hover:rotate-3 duration-300">play</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 overflow-x-auto hide-scrollbar">
          <NavItem path="/" label="HOME" />
          <li className="relative">
            <button
              onClick={toggleSearch}
              className={`flex items-center text-sm font-semibold hover:text-accent-color transition-colors ${
                searchOpen ? 'text-nav-active' : 'text-foreground'
              }`}
            >
              <FaSearch className="mr-2" />
              SEARCH
            </button>
            {searchOpen && (
              <span className="absolute -bottom-[10px] left-0 w-full h-[3px] bg-nav-active"></span>
            )}
          </li>
          <NavItem path="/movie" label="MOVIE" />
          <NavItem path="/series" label="SERIES" />
          <NavItem path="/anime" label="ANIME" />
          <NavItem path="/history" label="HISTORY" />
          <NavItem path="/watchlist" label="WATCHLIST" />
        </ul>

        {/* Mobile navigation toggle & theme toggle */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-muted/20 hover:bg-muted/40 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <FaSun className="h-4 w-4 text-yellow-400" />
            ) : (
              <FaMoon className="h-4 w-4 text-slate-700" />
            )}
          </Button>

          {/* Mobile search toggle */}
          <button
            onClick={toggleSearch}
            className="md:hidden bg-muted/20 hover:bg-muted/40 p-2 rounded-full transition-colors"
            aria-label="Toggle search"
          >
            <FaSearch className="h-4 w-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center bg-muted/20 hover:bg-muted/40 p-2 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border">
          <ul className="flex flex-col items-start py-4 px-6 space-y-2">
            <NavItem path="/" label="HOME" isMobile />
            <NavItem path="/movie" label="MOVIE" isMobile />
            <NavItem path="/series" label="SERIES" isMobile />
            <NavItem path="/anime" label="ANIME" isMobile />
            <NavItem path="/history" label="HISTORY" isMobile />
            <NavItem path="/watchlist" label="WATCHLIST" isMobile />
          </ul>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <SearchBar
          expanded={true}
          years={generateYears()}
          countries={countries}
        />
      )}
    </header>
  );
}
