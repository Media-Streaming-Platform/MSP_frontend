// components/Header.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { apiService, Media, Category } from "../lib/api";
import { useFilter } from "../context/FilterContext";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const {
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
  } = useFilter();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close all menus when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      setIsFilterOpen(false);
    }
  }, [isSearchOpen]);

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      setIsProfileMenuOpen(false);
      setIsFilterOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = useCallback(async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await apiService.searchMedia(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleFilterSelect = (categoryId: string, categoryName: string) => {
    setActiveFilter(categoryId);
    setSelectedCategory(categoryName);
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    setActiveFilter("all");
    setSelectedCategory(null);
    setIsFilterOpen(false);
  };

  const handleSearchButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchOpen(true);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCloseSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10" 
        : "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-lg"
    }`}>
      <div className="container mx-auto px-6 py-4">
        {/* Main Header Row - Enhanced for Desktop */}
        <div className="flex items-center justify-between">
          {/* Left Section - Enhanced Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Enhanced Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Faith Stream"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">FS</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Faith Stream
                </span>
                <span className="text-xs text-gray-400 font-medium">Divine Inspiration</span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              <Link
                href="/"
                className="relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Home
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-purple-600/10 rounded-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
              </Link>

              <Link
                href="/live"
                className="relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-purple-600/10 rounded-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
              </Link>
            </nav>
          </div>

          {/* Center Section - Enhanced Search */}
          <div className="hidden xl:block flex-1 max-w-2xl mx-8">
            <div className="relative" ref={searchContainerRef}>
              {isSearchOpen ? (
                <div
                  className="flex items-center bg-black/40 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-2xl"
                  onClick={handleSearchInputClick}
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search sermons, teachings, videos..."
                    className="bg-transparent border-none outline-none text-white w-full px-2 placeholder-gray-500 text-lg"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                  />
                  {isSearching && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent mr-3"></div>
                  )}
                  <button
                    onClick={handleCloseSearch}
                    className="text-gray-400 hover:text-white transition-colors p-1 ml-2 bg-white/10 rounded-lg hover:bg-white/20"
                    aria-label="Close search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchButtonClick}
                  className="w-full flex items-center gap-4 bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                  aria-label="Open search"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-left flex-1">Search sermons, teachings, videos...</span>
                  <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-sans bg-white/10 rounded border border-white/20 text-gray-400">
                    ⌘K
                  </kbd>
                </button>
              )}

              {/* Enhanced Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mt-3 max-h-96 overflow-y-auto z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold text-lg">Search Results</h3>
                  </div>
                  {searchResults.map((media) => (
                    <Link
                      key={media._id}
                      href={`/watch/${media._id}`}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 last:border-b-0 group"
                      onClick={handleSearchResultClick}
                    >
                      <div
                        className="w-16 h-20 bg-cover bg-center rounded-xl flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        style={{
                          backgroundImage: `url('${apiService.getVideoThumbnail(media)}')`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-lg truncate group-hover:text-red-400 transition-colors duration-300">
                          {media.title}
                        </h4>
                        <p className="text-gray-400 text-sm truncate mt-1">
                          {apiService.getCategoryName(media)} • {apiService.formatMediaType(media.type)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-600/30">
                            {media.type}
                          </span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Enhanced Actions */}
          <div className="flex items-center gap-4">
            {/* Enhanced Filter Button */}
            {!isSearchOpen && (
              <div className="relative hidden xl:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFilterOpen(!isFilterOpen);
                  }}
                  className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                  aria-label="Open filters"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="font-medium">Categories</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Filter Dropdown */}
                {isFilterOpen && (
                  <div
                    className="absolute right-0 top-16 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-80 py-4 max-h-96 overflow-y-auto z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-6 py-3 border-b border-white/10">
                      <h3 className="text-white font-semibold text-lg">Browse Categories</h3>
                      <p className="text-gray-400 text-sm mt-1">Filter by content type</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={clearFilter}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300 group ${
                          activeFilter === "all"
                            ? "bg-gradient-to-r from-red-600/20 to-purple-600/20 border-r-4 border-red-500 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeFilter === "all" ? "bg-red-500" : "bg-gray-500 group-hover:bg-red-400"}`}></div>
                        <span className="font-medium">All Categories</span>
                        <span className="ml-auto text-gray-400 text-sm bg-white/10 px-2 py-1 rounded-full">
                          {categories.length}
                        </span>
                      </button>

                      {loading ? (
                        <div className="px-6 py-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                          <p className="text-gray-400 mt-3">Loading categories...</p>
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => handleFilterSelect(category._id, category.name)}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300 group ${
                              activeFilter === category._id
                                ? "bg-gradient-to-r from-red-600/20 to-purple-600/20 border-r-4 border-red-500 text-white"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${activeFilter === category._id ? "bg-red-500" : "bg-gray-500 group-hover:bg-red-400"}`}></div>
                            <span className="font-medium">{category.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-6 py-8 text-center">
                          <p className="text-gray-400">No categories available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Search Button */}
            <button
              onClick={handleSearchButtonClick}
              className="xl:hidden text-gray-400 hover:text-white transition-colors p-3 bg-white/5 rounded-xl hover:bg-white/10"
              aria-label="Open search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Enhanced Profile Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                aria-label="Open user menu"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-white font-medium text-sm">Welcome!</p>
                  <p className="text-gray-400 text-xs">User Account</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Enhanced Profile Dropdown */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-16 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-64 py-4 z-50"
                  /* onClick={(e) => e.stopPropagation()} */
                >
                  <div className="px-6 py-3 border-b border-white/10">
                    <p className="text-white font-semibold">User Account</p>
                    <p className="text-gray-400 text-sm mt-1">Welcome to Faith Stream</p>
                  </div>

                  <div className="py-2">
                    <a
                      href={apiService.getCMSUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 text-blue-400 hover:bg-white/5 hover:text-blue-300 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Content Management
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      
      </div>
    </header>
  );
}