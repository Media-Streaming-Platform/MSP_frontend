// components/Header.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Add useCallback
import Link from "next/link";
import { apiService, Media, Category } from "../lib/api";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Move performSearch inside useCallback to fix dependency issue
  const performSearch = useCallback(async () => {
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
  }, [searchQuery]); // Add searchQuery as dependency

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  const handleFilterSelect = (categoryId: string, categoryName: string) => {
    setActiveFilter(categoryId);
    setIsFilterOpen(false);
    // You can navigate to category page or filter content
    console.log(`Filter by: ${categoryName}`);
  };

  const clearFilter = () => {
    setActiveFilter("all");
    setIsFilterOpen(false);
  };

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Get active filter name for display
  const getActiveFilterName = () => {
    if (activeFilter === "all") return "All";
    const category = categories.find((cat) => cat._id === activeFilter);
    return category?.name || "Unknown";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Media Streaming Platform Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MSP</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                Media Streaming Platform
              </span>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
              >
                Browse
              </Link>
              <Link
                href="/categories"
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
              >
                Categories
              </Link>
            </nav>
          </div>

          {/* Right Section - Search, Filter and Profile */}
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-1"
                aria-label="Open filters"
                aria-expanded={isFilterOpen}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm hidden sm:block">Categories</span>
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div
                  className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-64 py-3 max-h-96 overflow-y-auto"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-white font-semibold">
                      Browse by Category
                    </h3>
                  </div>

                  <div className="py-2">
                    {/* All Categories Option */}
                    <button
                      onClick={clearFilter}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeFilter === "all"
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      role="menuitem"
                    >
                      All Categories
                    </button>

                    {/* Category List */}
                    {loading ? (
                      <div className="px-4 py-2 text-gray-400 text-sm">
                        Loading categories...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() =>
                            handleFilterSelect(category._id, category.name)
                          }
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            activeFilter === category._id
                              ? "bg-red-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                          role="menuitem"
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-sm">
                        No categories found
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-700 pt-2">
                    <Link
                      href="/categories"
                      className="block w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-800 hover:text-blue-300 transition-colors text-sm"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-black/80 border border-gray-700 rounded-lg px-3 py-2">
                  <label htmlFor="search-input" className="sr-only">
                    Search media content
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search videos, audio..."
                    className="bg-transparent border-none outline-none text-white w-64 px-2"
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
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1 ml-2"
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mt-2 max-h-96 overflow-y-auto">
                  {searchResults.map((media) => (
                    <Link
                      key={media._id}
                      href={`/watch/${media._id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-b-0"
                      onClick={handleSearchResultClick}
                    >
                      <div
                        className="w-12 h-16 bg-cover bg-center rounded flex-shrink-0"
                        style={{
                          backgroundImage: `url('${apiService.getThumbnailUrl(
                            media
                          )}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {media.title}
                        </h4>
                        <p className="text-gray-400 text-sm truncate">
                          {media.categories?.name} •{" "}
                          {apiService.formatMediaType(media.type)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {media.numberOfViews} views
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {isSearchOpen &&
                searchQuery.length > 2 &&
                !isSearching &&
                searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mt-2 p-4">
                    <p className="text-gray-400 text-center">
                      No results found for &quot;{searchQuery}&quot;
                    </p>
                  </div>
                )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Open user menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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
                    <p className="text-white font-medium">Welcome!</p>
                    <p className="text-gray-400 text-sm">Guest User</p>
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
                    href="/watchlist"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    My List
                  </Link>
                  <Link
                    href="/history"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Watch History
                  </Link>

                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-blue-400 hover:bg-gray-800 hover:text-blue-300 transition-colors"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Display & Mobile Navigation */}
        <div className="mt-4">
          {/* Active Filter Display */}
          {activeFilter !== "all" && (
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-gray-400 text-sm">Active filter:</span>
              <div className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full">
                <span className="text-white text-sm">
                  {getActiveFilterName()}
                </span>
                <button
                  onClick={clearFilter}
                  className="text-white hover:text-gray-200 text-sm ml-1"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Mobile Navigation & Filters */}
          <nav
            className="flex items-center gap-2 overflow-x-auto pb-2"
            aria-label="Content categories"
          >
            {/* All Categories Button */}
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={clearFilter}
            >
              All
            </button>

            {/* Category Buttons */}
            {loading ? (
              <div className="text-gray-400 text-sm">Loading categories...</div>
            ) : (
              categories.slice(0, 6).map((category) => (
                <button
                  key={category._id}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === category._id
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    handleFilterSelect(category._id, category.name)
                  }
                >
                  {category.name}
                </button>
              ))
            )}

            {/* More Categories Button */}
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
