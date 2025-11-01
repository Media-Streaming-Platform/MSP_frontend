// app/watch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Media } from '../../lib/api';
import HLSVideoPlayer from '../../components/HLSVideoPlayer';

export default function WatchPage() {
  const params = useParams();
  const mediaId = params.id as string;
  
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const mediaData = await apiService.getMediaById(mediaId);
        setMedia(mediaData);
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
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-red-400">{error || 'Media not found'}</div>
      </div>
    );
  }

  const videoUrl = apiService.getMediaUrl(media);
  const thumbnailUrl = apiService.getVideoThumbnail(media);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* HLS Video Player */}
        <div className="mb-8">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <HLSVideoPlayer 
              src={videoUrl}
              poster={thumbnailUrl}
              className="max-h-[70vh]"
            />
          </div>
        </div>

        {/* Media Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">{media.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400">{media.numberOfViews} views</span>
              <span className="text-gray-400">{apiService.formatMediaType(media.type)}</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">HLS</span>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">HD</span>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300">{media.description || 'No description available.'}</p>
            </div>

            {/* <div className="flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                <span>▶</span> Play
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                <span>+</span> Add to List
              </button>
            </div> */}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Stream Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-white">HLS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-white">Adaptive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{apiService.getCategoryName(media)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uploaded:</span>
                  <span className="text-white">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* HLS Info Box */}
            <div className="bg-blue-900 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Streaming Info</h3>
              <p className="text-blue-200 text-sm">
                This video is streamed using HLS (HTTP Live Streaming) technology, 
                which provides adaptive bitrate streaming for the best viewing experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}