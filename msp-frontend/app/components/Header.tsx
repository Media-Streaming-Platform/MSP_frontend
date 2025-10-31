'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="StreamFlux Home">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-white font-bold text-xl">StreamFlux</span>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <Link 
                href="/" 
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/tv-shows" 
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                TV Shows
              </Link>
              <Link 
                href="/movies" 
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Movies
              </Link>
              <Link 
                href="/new" 
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                New & Popular
              </Link>
              <Link 
                href="/my-list" 
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                My List
              </Link>
            </nav>
          </div>

          {/* Right Section - Search and Profile */}
          <div className="flex items-center gap-4">
            
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
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-1.17-1.17 5.97 5.97 0 01-7.5 4.66 1 1 0 00-1.17 1.17 5.97 5.97 0 014.66 7.5 1 1 0 001.17 1.17 5.97 5.97 0 017.5-4.66 1 1 0 001.17-1.17z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                // aria-label="User menu"
                // aria-expanded={isProfileMenuOpen}
                // aria-haspopup="true"
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
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <Link 
                    href="/help" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                  >
                    Help Center
                  </Link>
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <nav className="flex items-center justify-between overflow-x-auto pb-2" aria-label="Content categories">
            <button className="text-white px-3 py-1 bg-red-600 rounded-full text-sm font-medium whitespace-nowrap">
              All
            </button>
            <button className="text-gray-400 px-3 py-1 rounded-full text-sm font-medium hover:text-white whitespace-nowrap">
              Movies
            </button>
            <button className="text-gray-400 px-3 py-1 rounded-full text-sm font-medium hover:text-white whitespace-nowrap">
              TV Shows
            </button>
            <button className="text-gray-400 px-3 py-1 rounded-full text-sm font-medium hover:text-white whitespace-nowrap">
              Anime
            </button>
            <button className="text-gray-400 px-3 py-1 rounded-full text-sm font-medium hover:text-white whitespace-nowrap">
              Documentary
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}