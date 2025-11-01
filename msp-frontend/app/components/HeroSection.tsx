// components/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiService, Media } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedMedia = async () => {
      try {
        const featured = await apiService.getFeaturedMedia();
        if (featured.length > 0) {
          setFeaturedMedia(featured[0]);
        }
      } catch (error) {
        console.error('Error fetching featured media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMedia();
  }, []);

  const handlePlayMedia = () => {
    if (featuredMedia) {
      console.log('Playing featured media:', featuredMedia.title);
      console.log('Media URL:', apiService.getMediaUrl(featuredMedia));
      
      // Use Next.js router for navigation
      router.push(`/watch/${featuredMedia._id}`);
    } else {
      console.log('No featured media to play');
    }
  };

  const handleAddToList = () => {
    if (featuredMedia) {
      try {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (!watchlist.includes(featuredMedia._id)) {
          watchlist.push(featuredMedia._id);
          localStorage.setItem('watchlist', JSON.stringify(watchlist));
          console.log('Added to local watchlist:', featuredMedia._id);
          alert('Added to watchlist!');
        } else {
          alert('Already in watchlist!');
        }
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
  };

  if (loading) {
    return (
      <section className="relative h-[70vh] bg-gray-900 animate-pulse">
        <div className="relative z-20 h-full flex items-center justify-start px-6">
          <div className="max-w-2xl w-full">
            <div className="h-6 bg-gray-800 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-6"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-800 rounded w-32"></div>
              <div className="h-12 bg-gray-800 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const backgroundImageUrl = featuredMedia ? apiService.getVideoThumbnail(featuredMedia) : "https://via.placeholder.com/1920x1080/1F2937/FFFFFF?text=Media+Streaming+Platform";

  return (
    <section 
      className="relative h-[70vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Gradient overlay for visual enhancement */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-15" />
      
      <div className="relative z-20 h-full flex items-center justify-start px-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium">
              {featuredMedia ? apiService.getCategoryName(featuredMedia) : 'Featured'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-semibold">{featuredMedia?.numberOfViews || '0'} views</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {featuredMedia?.title || 'Welcome to Media Streaming Platform'}
          </h1>
          
          <p className="text-gray-300 text-lg mb-6 max-w-lg">
            {featuredMedia?.description || 'Stream your favorite videos and audio content in high quality.'}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePlayMedia}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              aria-label={`Play ${featuredMedia?.title || 'Featured Media'}`}
            >
              <span aria-hidden="true">▶</span> Play
            </button>
            {/* <button 
              onClick={handleAddToList}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              aria-label={`Add ${featuredMedia?.title || 'Featured Media'} to My List`}
            >
              <span aria-hidden="true">+</span> My List
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}