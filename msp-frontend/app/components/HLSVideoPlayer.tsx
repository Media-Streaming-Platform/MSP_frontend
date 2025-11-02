// components/HLSVideoPlayer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function HLSVideoPlayer({ src, poster, className = '' }: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    const video = videoRef.current;
    const isHls = src.endsWith(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hlsInstance = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed");
        setIsLoading(false);
        setError(null);
        video.play().catch(e => console.log('Autoplay failed:', e));
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - attempting to reconnect...');
              hlsInstance.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hlsInstance.recoverMediaError();
              break;
            default:
              setError('Stream error - please try again later');
              setIsLoading(false);
              break;
          }
        }
      });

      hlsRef.current = hlsInstance;

      return () => {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      };
    } else {
      // For Safari and other browsers that support native HLS
      video.src = src;
      video.addEventListener('loadeddata', () => {
        setIsLoading(false);
        setError(null);
      });
      video.addEventListener('error', () => {
        setError('Failed to load video stream');
        setIsLoading(false);
      });
    }
  }, [src]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        poster={poster}
        controls
        className={`w-full h-auto ${className}`}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading stream...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-red-400 text-lg mb-2">❌</div>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}