// components/ContentRow.tsx
"use client";

import { useEffect, useState } from 'react';
import { apiService, Media } from '../lib/api';

interface ContentRowProps {
  title: string;
  category?: 'trending' | 'featured' | 'continue-watching';
  genre?: string;
  showProgress?: boolean;
  showSeeAll?: boolean;
}

export default function ContentRow({
  title,
  category,
  genre,
  showProgress = false,
  showSeeAll = false,
}: ContentRowProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: Media[] = [];

        if (category === 'trending') {
          data = await apiService.getTrendingMedia();
        } else if (category === 'featured') {
          data = await apiService.getFeaturedMedia();
        } else if (category === 'continue-watching') {
          // For now, just show latest videos as "continue watching"
          const response = await apiService.getAllMedia();
          data = response.mediaList
            .filter(item => item.type === 'video' && item.isPublished)
            .slice(0, 5);
        } else if (genre) {
          const categories = await apiService.getAllCategories();
          const categoryObj = categories.find(cat => 
            cat.name.toLowerCase() === genre.toLowerCase()
          );
          if (categoryObj) {
            data = await apiService.getMediaByCategory(categoryObj._id);
          }
        } else {
          const response = await apiService.getAllMedia();
          data = response.mediaList.filter(item => item.type === 'video').slice(0, 10);
        }

        setMedia(data);
      } catch (err) {
        setError('Failed to load media');
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, genre]);

  const handlePlayMedia = (mediaItem: Media, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Log the media URL for debugging
    const mediaUrl = apiService.getMediaUrl(mediaItem);
    console.log('Playing media:', {
      title: mediaItem.title,
      filePath: mediaItem.filePath,
      generatedUrl: mediaUrl,
      type: mediaItem.type
    });
    
    // Simply navigate to watch page
    window.location.href = `/watch/${mediaItem._id}`;
  };

  const handleAddToList = (mediaId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Simple local storage implementation for demo
    try {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      if (!watchlist.includes(mediaId)) {
        watchlist.push(mediaId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log('Added to local watchlist:', mediaId);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  if (loading) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {showSeeAll && (
            <button className="text-gray-400 hover:text-white transition-colors font-medium">
              See all
            </button>
          )}
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-98 animate-pulse">
              <div className="bg-gray-800 rounded-xl w-98 h-80"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-8">
        <div className="text-center text-red-400">
          {error}
        </div>
      </section>
    );
  }

  if (media.length === 0) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="text-center text-gray-400 py-8">
          No media found in this category.
        </div>
      </section>
    );
  }

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
        {media.map((mediaItem) => (
          <div 
            key={mediaItem._id} 
            className="flex-shrink-0 w-98 group cursor-pointer"
            onClick={(e) => handlePlayMedia(mediaItem, e)}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700/50 hover:border-red-500/30">
              
              {/* Image Container with Overlay Effects */}
              <div className="relative overflow-hidden">
                <div
                  className="w-full h-64 bg-cover bg-center relative bg-gray-800"
                  style={{ 
                    backgroundImage: `url('${apiService.getVideoThumbnail(mediaItem)}')`
                  }}
                >
                  {/* Fallback for missing thumbnails */}
                  {!mediaItem.thumbnail && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                      <div className="text-center p-4">
                        <div className="text-white text-lg font-semibold mb-2 line-clamp-2">
                          {mediaItem.title}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {apiService.formatMediaType(mediaItem.type)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-semibold">
                        {apiService.formatMediaType(mediaItem.type)}
                      </span>
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-semibold">
                        {mediaItem.numberOfViews} views
                      </span>
                    </div>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-2xl"
                      aria-label={`Play ${mediaItem.title}`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Gradient & Progress */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-3">
                    {showProgress && (
                      <div className="mb-2">
                        <div className="text-white text-xs font-medium mb-1 flex justify-between">
                          <span>Progress</span>
                          <span>{apiService.getProgress(mediaItem._id)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full shadow-lg shadow-red-500/25"
                            style={{ width: `${apiService.getProgress(mediaItem._id)}%` }}
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
                  onClick={(e) => handleAddToList(mediaItem._id, e)}
                  className="absolute -top-4 right-4 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg border border-gray-700/50"
                  aria-label={`Add ${mediaItem.title} to list`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
                  {mediaItem.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {mediaItem.description || 'No description available'}
                </p>

                {/* Category Tag */}
                <div className="flex items-center justify-between">
                  <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                    {apiService.getCategoryName(mediaItem)}
                  </span>
                  
                  {/* Quality Badge */}
                  <div className="bg-green-500/20 border border-green-500/30 px-2 py-1 rounded">
                    <span className="text-green-400 text-xs font-bold">HLS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}