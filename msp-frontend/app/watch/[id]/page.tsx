// app/watch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Media } from '../../lib/api';
import HLSVideoPlayer from '../../components/HLSVideoPlayer';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const mediaId = params.id as string;
  
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedMedia, setRelatedMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const mediaData = await apiService.getMediaById(mediaId);
        setMedia(mediaData);
        
        // Fetch related media from the same category
        if (mediaData.categories && typeof mediaData.categories === 'object') {
          const related = await apiService.getMediaByCategory(mediaData.categories._id);
          setRelatedMedia(related.filter(item => item._id !== mediaId).slice(0, 6));
        }
        
      } catch (err) {
        setError('Failed to load media');
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mediaId) {
      fetchMedia();
    }
  }, [mediaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-800 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-800 rounded-lg"></div>
                <div className="h-32 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The media you are looking for does not exist.'}</p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = apiService.getMediaUrl(media);
  const thumbnailUrl = apiService.getVideoThumbnail(media);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        
        {/* Video Player Section */}
        <section className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {videoUrl ? (
              <HLSVideoPlayer 
                src={videoUrl}
                poster={thumbnailUrl}
                className="w-full aspect-video"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-gray-400 text-lg">Video stream not available</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content - 3/4 width on desktop */}
          <div className="lg:col-span-3">
            
            {/* Title and Actions */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  {media.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {apiService.formatMediaType(media.type)}
                  </span>
                  <span>⭐ {media.numberOfViews} views</span>
                  <span>📅 {new Date(media.createdAt).toLocaleDateString()}</span>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {apiService.getCategoryName(media)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg">
                  <span className="text-lg">▶</span>
                  Play Now
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-all duration-300 hover:scale-105">
                  <span className="text-lg">+</span>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-all duration-300 hover:scale-105">
                  <span className="text-lg">⭢</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-red-500">📖</span>
                About this content
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {media.description || 'No description available for this content.'}
              </p>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/30">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-purple-400">🎯</span>
                  Content Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Format:</span>
                    <span className="text-white font-medium">HLS Streaming</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Quality:</span>
                    <span className="text-green-400 font-medium">Adaptive HD</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Status:</span>
                    <span className="text-green-400 font-medium">{media.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-700/30">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-orange-400">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Download Transcript
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Share Content
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/4 width on desktop */}
          <div className="lg:col-span-1">
            
            {/* Related Content */}
            <div className="sticky top-24">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-blue-400">🎬</span>
                  Related Content
                </h3>
                
                <div className="space-y-4">
                  {relatedMedia.length > 0 ? (
                    relatedMedia.map((item) => (
                      <Link
                        key={item._id}
                        href={`/watch/${item._id}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group-hover:scale-105 border border-gray-600/30 group-hover:border-gray-500/50">
                          <div 
                            className="w-16 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{ 
                              backgroundImage: `url('${apiService.getVideoThumbnail(item)}')`
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {apiService.formatMediaType(item.type)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🎯</div>
                      <p className="text-gray-400 text-sm">No related content found</p>
                    </div>
                  )}
                </div>

                {/* View All Button */}
                {relatedMedia.length > 0 && (
                  <Link
                    href="/categories"
                    className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-3 rounded-xl mt-4 font-medium transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    View All Related
                  </Link>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30 mt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-400">📊</span>
                  Content Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Views</span>
                    <span className="text-white font-bold">{media.numberOfViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Published</span>
                    <span className="text-white font-bold">{new Date(media.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Duration</span>
                    <span className="text-white font-bold">Adaptive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 via-red-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Enjoying this content?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Discover more inspiring content in our library. New videos added regularly to help you grow in faith and knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/categories" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Browse All Categories
              </Link>
              <Link 
                href="/live" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Watch Live Streams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}