'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv-shows', label: 'TV Shows' },
    { id: 'action', label: 'Action' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'drama', label: 'Drama' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'documentary', label: 'Documentary' },
  ];

  const genres = [
    'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary'
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Movie Streaming Platform Home">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MSP</span>
              </div>
              <span className="text-white font-bold text-xl">Media Streaming Platform</span>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            
          </div>

          {/* Right Section - Search, Filter and Profile */}
          <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <Link 
                href="/" 
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"

              >
                Home
              </Link>
            </nav>
            {/* Filter Button */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
                aria-label="Open filters"
                // aria-expanded={isFilterOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm hidden sm:block">Filters</span>
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div 
                  className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-64 py-3 max-h-96 overflow-y-auto"
                  // role="menu"
                  // aria-orientation="vertical"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Filter by Genre</h3>
                  </div>
                  
                  <div className="py-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                        // role="menuitem"
                        onClick={() => {
                          setActiveFilter(genre.toLowerCase());
                          setIsFilterOpen(false);
                        }}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors text-sm"
                      // role="menuitem"
                      onClick={() => {
                        setActiveFilter('all');
                        setIsFilterOpen(false);
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-black/80 border border-gray-700 rounded-lg px-3 py-2">
                  <label htmlFor="search-input" className="sr-only">
                    Search movies and TV shows
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search movies, TV shows..."
                    className="bg-transparent border-none outline-none text-white w-64 px-2"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close search"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  aria-label="Open search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Notifications */}
            <button 
              className="text-gray-400 hover:text-white transition-colors p-2 relative"
              aria-label="View notifications"
            >
              {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-1.17-1.17 5.97 5.97 0 01-7.5 4.66 1 1 0 00-1.17 1.17 5.97 5.97 0 014.66 7.5 1 1 0 001.17 1.17 5.97 5.97 0 017.5-4.66 1 1 0 001.17-1.17z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span> */}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Open user menu"
                // aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-48 py-2"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white font-medium">Username</p>
                    <p className="text-gray-400 text-sm">user@example.com</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link 
                    href="/help" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Help Center
                  </Link>
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Display & Mobile Navigation */}
        <div className="mt-4">
          {/* Active Filter Display */}
          {activeFilter !== 'all' && (
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-gray-400 text-sm">Active filter:</span>
              <div className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full">
                <span className="text-white text-sm capitalize">{activeFilter}</span>
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="text-white hover:text-gray-200 text-sm"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Mobile Navigation & Filters */}
          <nav className="flex items-center gap-2 overflow-x-auto pb-2" aria-label="Content categories">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter(filter.id)}
                aria-label={`Filter by ${filter.label}`}
                // aria-pressed={activeFilter === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}