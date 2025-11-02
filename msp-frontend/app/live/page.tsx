// app/live/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const reactionCounterRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(1247);
  const [reactions, setReactions] = useState<{ type: string; id: number }[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
//   const [reactionDelays, setReactionDelays] = useState<number[]>([]);
  // Instead of using useEffect, initialize the state directly




  // Your HLS stream URL
  const m3u8Url = "https://462dx4mlqj3o-hls-live.wmncdn.net/jnvisiontv/0e1fd802947a734b3af7787436f11588.sdp/chunks.m3u8";

  // Initialize reaction delays after component mounts (client-side only)
 
  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 3);
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

  // Get delay for reaction animation - FIXED: Use predetermined delays
  const getReactionDelay = (index: number) => {
    return reactionDelays[index % reactionDelays.length] || 0;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Initializing HLS stream:', m3u8Url);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
        debug: false,
      });
      
      hlsRef.current = hls;

      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully');
        setIsLoading(false);
        setError(null);
        video.play().catch(e => {
          console.log('Autoplay failed:', e);
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        setIsPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              setError('Network error - attempting to reconnect...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, recovering...');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error, cannot recover');
              setError('Stream error - please try again later');
              setIsLoading(false);
              break;
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      console.log('Using native HLS support');
      video.src = m3u8Url;
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
  }, [m3u8Url]);

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
            <span className="text-red-400 font-semibold tracking-wider">LIVE NOW</span>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Sunday Worship Service
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join our live Christian streaming service with messages of hope and worship
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
                  poster="/live-poster.jpg"
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
                        animationDelay: `${getReactionDelay(index)}s` // FIXED: Use predetermined delays
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
                      <p className="text-white text-lg mt-4 font-semibold">Loading Live Stream</p>
                      <p className="text-gray-400 text-sm mt-2">Connecting to server...</p>
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
                          onClick={() => window.location.reload()}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                          🔄 Retry Connection
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                          📞 Get Help
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
                    <h2 className="text-2xl font-bold text-white mb-2">Sunday Worship Service - Live</h2>
                    <p className="text-gray-400">With Pastor John Smith • Matthew 5:1-12</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2">
                      <span>❤️</span> Like
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2">
                      <span>🔗</span> Share
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-sm">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Status</div>
                    <div className={`font-semibold ${isPlaying ? 'text-green-400' : isLoading ? 'text-yellow-400' : 'text-red-400'}`}>
                      {isPlaying ? '● Streaming' : isLoading ? '● Connecting...' : '● Offline'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Quality</div>
                    <div className="text-white font-semibold">Auto (HD Ready)</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Latency</div>
                    <div className="text-white font-semibold">~3.2s</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <div className="text-gray-400">Format</div>
                    <div className="text-white font-semibold">HLS Stream</div>
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
              <span>{showChat ? 'Hide' : 'Show'} Chat & Info</span>
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
                    <span className="text-gray-400">Peak Today</span>
                    <span className="text-white font-bold">1,842</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white font-bold">327</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>📅</span> Upcoming Events
                </h3>
                <div className="space-y-4">
                  {[
                    { time: 'Tomorrow, 10:00 AM', title: 'Morning Service', type: 'Worship', live: true },
                    { time: 'Wednesday, 7:00 PM', title: 'Bible Study', type: 'Teaching', live: false },
                    { time: 'Friday, 8:00 PM', title: 'Youth Night', type: 'Fellowship', live: true }
                  ].map((event, index) => (
                    <div key={index} className="p-3 bg-gray-700/30 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white font-medium">{event.title}</p>
                        {event.live && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">LIVE</span>}
                      </div>
                      <p className="text-gray-400 text-sm">{event.time}</p>
                      <span className="text-red-400 text-xs font-medium">{event.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    📖 Open Bible
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    💬 Prayer Request
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    🎵 Worship Songs
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-all text-sm font-semibold">
                    📱 Get App
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
              About This Service
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Join us for an uplifting Sunday worship experience featuring powerful messages from Scripture, 
              inspiring worship music, and meaningful community fellowship. Today&apos;s message focuses on the 
              Beatitudes from Matthew 5.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">Worship</span>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">Teaching</span>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">Community</span>
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">Prayer</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              Need Assistance?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Having trouble with the stream? We&apos;re here to help you get the best viewing experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400">🔄</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Refresh Connection</p>
                  <p className="text-gray-400 text-sm">Try reloading the page if stream stops</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400">📞</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Technical Support</p>
                  <p className="text-gray-400 text-sm">Contact our support team for help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}