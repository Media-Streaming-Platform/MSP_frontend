// components/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiService, Media } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
          // Show success notification
          showNotification('Added to watchlist!');
        } else {
          showNotification('Already in watchlist!');
        }
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
  };

  const showNotification = (message: string) => {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 transform translate-x-0 opacity-100 transition-all duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (loading) {
    return (
      <section className="relative h-[80vh] bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-20 h-full flex items-center justify-start px-6 lg:px-12">
          <div className="max-w-2xl w-full">
            <div className="h-6 bg-gray-700/50 rounded-lg w-32 mb-6 animate-pulse"></div>
            <div className="h-16 bg-gray-700/50 rounded-lg w-3/4 mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded-lg w-full mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded-lg w-2/3 mb-8 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-14 bg-gray-700/50 rounded-xl w-36 animate-pulse"></div>
              <div className="h-14 bg-gray-700/50 rounded-xl w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const backgroundImageUrl = featuredMedia ? apiService.getVideoThumbnail(featuredMedia) : "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

  return (
    <section 
      className="relative h-[80vh] lg:h-[85vh] bg-cover bg-center bg-no-repeat overflow-hidden group"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-15" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <div className={`absolute -top-20 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl transition-all duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transition-all duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/3 rounded-full blur-2xl transition-all duration-1000 ${isHovered ? 'scale-125' : 'scale-100'}`}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-8">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Loading Spinner for Image */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-25 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-600/30 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white mt-4 font-semibold">Loading Featured Content...</p>
          </div>
        </div>
      )}

      {/* Preload image */}
      <img 
        src={backgroundImageUrl} 
        alt="" 
        className="hidden" 
        onLoad={handleImageLoad}
      />

      <div className="relative z-20 h-full flex items-center justify-start px-6 lg:px-12 xl:px-20">
        <div className="max-w-2xl lg:max-w-3xl transform transition-all duration-700 ease-out">
          {/* Enhanced Category Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl px-4 py-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">
                {featuredMedia ? apiService.getCategoryName(featuredMedia) : 'Featured'}
              </span>
            </div>
            
        

            
          </div>
          
          {/* Enhanced Title */}
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {featuredMedia?.title || 'Divine Inspiration'}
            </span>
          </h1>
          
          {/* Enhanced Description */}
          <p className="text-gray-200 text-xl lg:text-2xl mb-8 max-w-2xl leading-relaxed font-light">
            {featuredMedia?.description || 'Experience transformative messages and uplifting worship in stunning high definition. Join our community of believers.'}
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
            <button 
              onClick={handlePlayMedia}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
              aria-label={`Play ${featuredMedia?.title || 'Featured Media'}`}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-lg transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm ml-0.5">▶</span>
                </div>
              </div>
              <span>Watch Now</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10"></div>
            </button>

           

           
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-6 mt-8 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-green-400">HD</span>
              <span>•</span>
              <span>4K Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎧</span>
              <span>Audio Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>Multi-Device</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm font-medium">Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
}