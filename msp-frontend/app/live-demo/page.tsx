// app/live-demo/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function LiveDemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);
  const [stallCount, setStallCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('⏳ Connecting to stream...');
  const [lastPlaybackTime, setLastPlaybackTime] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(1247);
  const [reactions, setReactions] = useState<{ type: string; id: number }[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const reactionCounterRef = useRef(0);

  // Low-latency HLS stream URL
  const m3u8Url = "https://pub-e0bdd32b9eeb4a6d8a15fb9bf208a93e.r2.dev/live_stream/index.m3u8";

  // Initialize HLS player with low-latency configuration
  const initPlayer = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Initializing low-latency HLS stream:', m3u8Url);

    if (Hls.isSupported()) {
      // Destroy existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,  // Use worker for better performance
        lowLatencyMode: true,
        backBufferLength: 1,  // Reduced buffer
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        maxBufferSize: 10 * 1000 * 1000, // 10MB
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 1,
        nudgeOffset: 0.05,
        nudgeMaxRetry: 1,
        maxFragLookUpTolerance: 0.1,
        liveSyncDurationCount: 2,  // Reduced from default
        liveMaxLatencyDurationCount: 3,
        liveDurationInfinity: false,
        maxLiveSyncPlaybackRate: 1.1,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 500,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 3,
        levelLoadingRetryDelay: 500,
        fragLoadingTimeOut: 12000,
        fragLoadingMaxRetry: 3,
        fragLoadingRetryDelay: 500,
      });

      hlsRef.current = hls;

      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully');
        setConnectionStatus('🎥 Live stream connected');
        setIsLoading(false);
        setError(null);
        video.play().catch(e => {
          console.log('Autoplay failed:', e);
          setIsPlaying(false);
        });
        startStatsMonitoring();
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log('Level loaded, live sync:', hls.liveSyncPosition);
        setIsPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setConnectionStatus('🔁 Network error, reloading...');
              setError('Network error - attempting to reconnect...');
              setTimeout(() => reloadStream(), 1000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setConnectionStatus('🔁 Media error, recovering...');
              setError('Media error - attempting to recover...');
              hls.recoverMediaError();
              break;
            default:
              reloadStream();
              break;
          }
        }
      });

      // Monitor buffering state
      const handleWaiting = () => {
        setStallCount(prev => prev + 1);
        setConnectionStatus('⏳ Buffering...');
      };

      const handlePlaying = () => {
        setConnectionStatus('🎥 Live');
        setIsPlaying(true);
      };

      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);

      return () => {
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
      };

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      console.log('Using native HLS support');
      video.src = m3u8Url;
      setConnectionStatus('🎥 Using native HLS');
      setIsLoading(false);
      setError(null);
      setIsPlaying(true);
      
      video.addEventListener('loadeddata', () => {
        setIsLoading(false);
        setError(null);
        setIsPlaying(true);
      });
      
      video.addEventListener('error', () => {
        setError('Failed to load live stream');
        setIsLoading(false);
      });
    } else {
      setError('Your browser does not support HLS streaming');
      setIsLoading(false);
    }
  };

  // Stats monitoring for latency and stall detection
  const startStatsMonitoring = () => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    statsIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.seeking || video.paused) return;

      // Detect stalls
      if (video.currentTime === lastPlaybackTime) {
        setStallCount(prev => {
          const newCount = prev + 1;
          if (newCount > 3) {
            console.log('Stream stalled, reloading...');
            reloadStream();
            return 0;
          }
          return newCount;
        });
      } else {
        setStallCount(0);
      }
      setLastPlaybackTime(video.currentTime);

      // Estimate latency
      if (hlsRef.current && hlsRef.current.liveSyncPosition) {
        const currentLatency = hlsRef.current.liveSyncPosition - video.currentTime;
        setLatency(currentLatency);
      }
    }, 1000);
  };

  const reloadStream = () => {
    console.log('Reloading stream...');
    setConnectionStatus('🔁 Reloading stream...');
    setError(null);
    setIsLoading(true);
    initPlayer();
  };

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 10) - 3;
        return Math.max(1000, prev + change);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Add reaction
  const addReaction = (type: string) => {
    const id = reactionCounterRef.current++;
    setReactions(prev => [...prev, { type, id }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  // Initialize player on component mount
  useEffect(() => {
    initPlayer();

    // Auto-reload if page becomes visible after being hidden
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!document.hidden && video && (video.paused || video.ended)) {
        reloadStream();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-semibold tracking-wider">LOW LATENCY DEMO</span>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Low-Latency Live Stream
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Testing ultra-low latency HLS streaming with real-time monitoring
          </p>
        </div>

        {/* Video Player Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
              {/* Video Container */}
              <div className="relative">
                <video
                  ref={videoRef}
                  controls={false}
                  className="w-full h-auto max-h-[70vh]"
                  muted
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Floating Reactions */}
                <div className="absolute top-4 right-4 space-y-2">
                  {reactions.map((reaction, index) => (
                    <div
                      key={reaction.id}
                      className="animate-bounce text-2xl"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {reaction.type}
                    </div>
                  ))}
                </div>
                
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-red-600/30 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-white text-lg mt-4 font-semibold">Initializing Low-Latency Stream</p>
                      <p className="text-gray-400 text-sm mt-2">{connectionStatus}</p>
                    </div>
                  </div>
                )}
                
                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md">
                      <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                      </div>
                      <p className="text-white text-xl font-semibold mb-4">Stream Issue Detected</p>
                      <p className="text-gray-300 mb-6">{error}</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={reloadStream}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                          🔄 Retry Connection
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Live Badge */}
                {isPlaying && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <span className="font-bold tracking-wider">LIVE</span>
                      <div className="w-px h-4 bg-white/30"></div>
                      <span className="text-sm font-medium">{viewerCount.toLocaleString()} watching</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Controls Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all transform hover:scale-110 backdrop-blur-sm"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                      
                      <div className="text-white font-semibold bg-black/40 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {currentTime.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Quick Reactions */}
                      <div className="flex gap-2 bg-black/40 rounded-full p-1 backdrop-blur-sm">
                        {['🙏', '❤️', '🔥', '⭐'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(emoji)}
                            className="hover:scale-125 transform transition-all p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleFullscreen}
                        className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all transform hover:scale-110 backdrop-blur-sm"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stream Info */}
              <div className="p-6 border-t border-gray-700/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Low-Latency HLS Stream Demo</h2>
                    <p className="text-gray-400">Testing ultra-low latency configuration</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={reloadStream}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      <span>🔄</span> Restart Stream
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-sm">
                  <div className={`text-center p-3 rounded-lg ${
                    connectionStatus.includes('Live') ? 'bg-green-600/20' : 
                    connectionStatus.includes('Buffering') ? 'bg-yellow-600/20' : 
                    'bg-red-600/20'
                  }`}>
                    <div className="text-gray-400">Status</div>
                    <div className={`font-semibold ${
                      connectionStatus.includes('Live') ? 'text-green-400' : 
                      connectionStatus.includes('Buffering') ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {connectionStatus}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Latency</div>
                    <div className="text-white font-semibold">
                      {latency !== null ? `${latency.toFixed(1)}s` : '--'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Stalls</div>
                    <div className="text-white font-semibold">{stallCount}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Format</div>
                    <div className="text-white font-semibold">Low-Latency HLS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Toggle Chat Button for Mobile */}
            <button 
              onClick={() => setShowChat(!showChat)}
              className="lg:hidden bg-gray-800 text-white p-3 rounded-lg w-full flex items-center justify-center gap-2"
            >
              <span>{showChat ? 'Hide' : 'Show'} Info</span>
              <span>💬</span>
            </button>

            <div className={`space-y-6 ${showChat ? 'block' : 'hidden lg:block'}`}>
              {/* Stream Stats Card */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>📊</span> Live Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Viewers</span>
                    <span className="text-white font-bold text-lg">{viewerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Latency</span>
                    <span className="text-white font-bold">
                      {latency !== null ? `${latency.toFixed(1)}s` : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stalls</span>
                    <span className="text-white font-bold">{stallCount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, 100 - (stallCount * 20))}%`,
                        backgroundColor: stallCount === 0 ? '#10B981' : stallCount < 3 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Technical Info */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>⚙️</span> Technical Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buffer Size</span>
                    <span className="text-white">1-10s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sync Duration</span>
                    <span className="text-white">2 segments</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Worker</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Low Latency</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={reloadStream}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all text-sm font-semibold"
                  >
                    🔄 Restart
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all text-sm font-semibold"
                  >
                    🔃 Full Reload
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    📊 Stats
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    🎛️ Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-red-600 rounded-full"></div>
              Low-Latency Configuration
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              This demo uses optimized HLS.js settings for ultra-low latency streaming:
              reduced buffer sizes, faster segment loading, and real-time latency monitoring.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">backBufferLength: 1</span>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">liveSyncDurationCount: 2</span>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">enableWorker: true</span>
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">lowLatencyMode: true</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              Performance Monitoring
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Real-time monitoring detects stalls and automatically recovers the stream.
              Latency is calculated by comparing playback position with live edge.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400">📊</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Auto-Recovery</p>
                  <p className="text-gray-400 text-sm">Automatically restarts on stall detection</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400">⚡</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Latency Tracking</p>
                  <p className="text-gray-400 text-sm">Real-time latency measurement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}