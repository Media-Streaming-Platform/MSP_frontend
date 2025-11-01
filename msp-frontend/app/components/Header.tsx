// components/Header.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiService, Media, Category } from '../lib/api';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close all menus when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      setIsFilterOpen(false);
    }
  }, [isSearchOpen]);

  // Close all menus when profile menu opens
  useEffect(() => {
    if (isProfileMenuOpen) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setIsFilterOpen(false);
    }
  }, [isProfileMenuOpen]);

  // Close all menus when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
      setIsProfileMenuOpen(false);
      setIsFilterOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsSearchOpen(false);
      setIsProfileMenuOpen(false);
      setIsFilterOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const results = await apiService.searchMedia(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden text-gray-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Media Streaming Platform Home">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MSP</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">Media Streaming Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors p-2">
              Home
            </Link>
            <Link href="/categories" className="text-gray-400 hover:text-white transition-colors p-2">
              Categories
            </Link>
            <Link href="/live" className="text-gray-400 hover:text-white transition-colors p-2">
              Live
            </Link>
          </nav>

          {/* Right Section - Search and Profile */}
          <div className="flex items-center gap-2">
            {/* Filter Button - Hidden on mobile when search is open */}
            {!isSearchOpen && (
              <div className="relative hidden sm:block">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFilterOpen(!isFilterOpen);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
                  aria-label="Open filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm hidden sm:block">Categories</span>
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div 
                    className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-64 py-3 max-h-96 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="text-white font-semibold">Browse by Category</h3>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setActiveFilter('all');
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          activeFilter === 'all'
                            ? 'bg-red-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        All Categories
                      </button>

                      {loading ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Loading categories...</div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => {
                              setActiveFilter(category._id);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              activeFilter === category._id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No categories found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Search Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <div 
                  className="flex items-center bg-black/80 border border-gray-700 rounded-lg px-3 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Search videos, audio..."
                    className="bg-transparent border-none outline-none text-white w-40 sm:w-64 px-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {isSearching && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                  )}
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1 ml-2"
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchOpen(true);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  aria-label="Open search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mt-2 max-h-96 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {searchResults.map((media) => (
                    <Link
                      key={media._id}
                      href={`/watch/${media._id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-b-0"
                      onClick={handleSearchResultClick}
                    >
                      <div 
                        className="w-12 h-16 bg-cover bg-center rounded flex-shrink-0 bg-gray-700"
                        style={{ 
                          backgroundImage: `url('${apiService.getVideoThumbnail(media)}')`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{media.title}</h4>
                        <p className="text-gray-400 text-sm truncate">
                          {apiService.getCategoryName(media)} • {apiService.formatMediaType(media.type)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {isSearchOpen && searchQuery.length > 2 && !isSearching && searchResults.length === 0 && (
                <div 
                  className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mt-2 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-gray-400 text-center">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Open user menu"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-48 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white font-medium">Welcome!</p>
                    <p className="text-gray-400 text-sm">Guest User</p>
                  </div>
                  
                  <Link href="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                    Profile
                  </Link>
                  <Link href="/watchlist" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                    My List
                  </Link>
                  <Link href="/history" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                    Watch History
                  </Link>
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <Link href="/login" className="block px-4 py-2 text-blue-400 hover:bg-gray-800 hover:text-blue-300">
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 rounded-lg mt-3 p-4">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="text-gray-400 hover:text-white transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-400 hover:text-white transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/live" 
                className="text-gray-400 hover:text-white transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Live Streams
              </Link>
              <Link 
                href="/browse" 
                className="text-gray-400 hover:text-white transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse All
              </Link>
            </nav>
          </div>
        )}

        {/* Active Filter Display & Mobile Categories */}
        <div className="mt-4">
          {/* Active Filter Display */}
          {activeFilter !== 'all' && (
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-gray-400 text-sm">Active filter:</span>
              <div className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full">
                <span className="text-white text-sm">
                  {categories.find(cat => cat._id === activeFilter)?.name || 'Unknown'}
                </span>
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="text-white hover:text-gray-200 text-sm ml-1"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Mobile Categories Navigation */}
          <nav className="flex items-center gap-2 overflow-x-auto pb-2" aria-label="Content categories">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>

            {loading ? (
              <div className="text-gray-400 text-sm px-2">Loading...</div>
            ) : (
              categories.slice(0, 6).map((category) => (
                <button
                  key={category._id}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === category._id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveFilter(category._id)}
                >
                  {category.name}
                </button>
              ))
            )}

            {categories.length > 6 && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                More +
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}