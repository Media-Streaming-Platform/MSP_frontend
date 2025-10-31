"use client";

import { useMemo } from 'react';

interface ContentItem {
  id: string;
  title: string;
  progress?: number;
  duration?: string;
  image?: string;
  rating?: number;
  year?: number;
  genres?: string[];
  quality?: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  showProgress?: boolean;
  showSeeAll?: boolean;
}

// Constants for content data - moved outside component
const CONTENT_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Sci-Fi", 
  "Horror", "Romance", "Thriller", "Fantasy", "Mystery",
  "Crime", "Animation", "Family", "Documentary", "Biography"
];

const QUALITY_TYPES = [
  "HD", "4K", "HDR", "Dolby Vision", "Dolby Atmos"
];

// Pre-generated stable random data
const generateStableCardData = (itemId: string) => {
  // Use the item ID to generate stable "random" values
  let hash = 0;
  for (let i = 0; i < itemId.length; i++) {
    hash = ((hash << 5) - hash) + itemId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to generate stable random values
  const stableRandom = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  const genres = [...CONTENT_GENRES]
    .sort(() => stableRandom() - 0.5)
    .slice(0, 2);

  const quality = QUALITY_TYPES[Math.floor(stableRandom() * QUALITY_TYPES.length)];
  const rating = (7 + stableRandom() * 3).toFixed(1);
  const year = 2015 + Math.floor(stableRandom() * 10);

  return { genres, quality, rating, year };
};

export default function ContentRow({
  title,
  items,
  showProgress = false,
  showSeeAll = false,
}: ContentRowProps) {
  const backgroundImageUrl = "https://image.tmdb.org/t/p/original/kHOfxq7cMTXyLbj0UmdoGhT540O.jpg";

  // Generate stable card data using useMemo
  const cardData = useMemo(() => {
    return items.map(item => ({
      ...item,
      ...generateStableCardData(item.id)
    }));
  }, [items]);

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {showSeeAll && (
          <button 
            type="button"
            className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-1 group"
          >
            See all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {cardData.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-98 group cursor-pointer">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30">
              
              {/* Image Container with Overlay Effects */}
              <div className="relative overflow-hidden">
                <div
                  className="w-full h-64 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-white text-xs font-semibold">{item.rating}</span>
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-semibold">{item.year}</span>
                    </div>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-2xl"
                      aria-label={`Play ${item.title}`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Gradient & Progress */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-3">
                    {showProgress && item.progress && (
                      <div className="mb-2">
                        <div className="text-white text-xs font-medium mb-1 flex justify-between">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full shadow-lg shadow-red-500/25"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4 relative">
                {/* Add to List Button */}
                <button 
                  type="button"
                  className="absolute -top-4 right-4 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg border border-gray-700/50"
                  aria-label={`Add ${item.title} to list`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  {item.duration && (
                    <p className="text-gray-400 text-sm font-medium">{item.duration}</p>
                  )}
                  
                  {/* Quality Badge */}
                  <div className={`px-2 py-1 rounded border ${
                    item.quality === "4K" 
                      ? "bg-purple-500/20 border-purple-500/30" 
                      : item.quality === "HDR" 
                      ? "bg-blue-500/20 border-blue-500/30"
                      : item.quality === "Dolby Vision" 
                      ? "bg-yellow-500/20 border-yellow-500/30"
                      : "bg-green-500/20 border-green-500/30"
                  }`}>
                    <span className={`text-xs font-bold ${
                      item.quality === "4K" 
                        ? "text-purple-400" 
                        : item.quality === "HDR" 
                        ? "text-blue-400"
                        : item.quality === "Dolby Vision" 
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}>
                      {item.quality}
                    </span>
                  </div>
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.genres?.map((genre, index) => (
                    <span 
                      key= {index}
                      className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}