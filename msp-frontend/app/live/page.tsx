// app/live/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { liveStreamService, LiveStream } from '../lib/liveStreamApi';

export default function LivePage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const liveStreams = await liveStreamService.searchChristianLiveStreams();
        setStreams(liveStreams);
        if (liveStreams.length > 0) {
          setSelectedStream(liveStreams[0]);
        }
      } catch (err) {
        setError('Failed to load live streams');
        console.error('Error fetching streams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    // Refresh streams every 30 seconds
    const interval = setInterval(fetchStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg h-96"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🔴</div>
          <h1 className="text-2xl font-bold text-white mb-2">Live Streams Unavailable</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔴 Live Streams</h1>
          <p className="text-gray-400">
            Watch Christian services, worship, and teachings live from around the world
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-semibold">LIVE NOW</span>
            </div>
            <span className="text-gray-400">{streams.length} streams active</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream Player */}
          <div className="lg:col-span-2">
            {selectedStream ? (
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                  <iframe
                    src={liveStreamService.getStreamEmbedUrl(selectedStream.id)}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedStream.title}
                      </h2>
                      <p className="text-gray-400 mb-4">{selectedStream.channelTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-semibold">LIVE</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <span>👁️</span>
                      <span>{selectedStream.concurrentViewers} viewers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>Started {new Date(selectedStream.actualStartTime || selectedStream.scheduledStartTime).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">
                    {selectedStream.description || 'Join us for live worship and teaching from the Word of God.'}
                  </p>

                  <div className="flex gap-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                      <span>🔔</span>
                      Get Notified
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                      <span>❤️</span>
                      Like
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                      <span>↗️</span>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Live Streams</h3>
                  <p className="text-gray-400">Check back later for live Christian content</p>
                </div>
              </div>
            )}
          </div>

          {/* Stream List */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Other Live Streams</h3>
            
            {streams.length > 0 ? (
              streams.map((stream) => (
                <div
                  key={stream.id}
                  className={`bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
                    selectedStream?.id === stream.id ? 'ring-2 ring-red-500' : ''
                  }`}
                  onClick={() => setSelectedStream(stream)}
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-20 h-12 rounded object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-red-600 px-1 rounded text-xs text-white">
                        LIVE
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                        {stream.title}
                      </h4>
                      <p className="text-gray-400 text-xs mb-2">
                        {stream.channelTitle}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          {stream.concurrentViewers} watching
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400">No live streams found</p>
              </div>
            )}

            {/* Upcoming Streams */}
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📅</span>
                Upcoming Streams
              </h4>
              <div className="space-y-3">
                {[
                  {
                    title: 'Sunday Morning Service',
                    time: 'Tomorrow, 10:00 AM',
                    channel: 'Global Christian Fellowship'
                  },
                  {
                    title: 'Bible Study Live',
                    time: 'Wednesday, 7:00 PM', 
                    channel: 'Word of Life Church'
                  },
                  {
                    title: 'Youth Worship Night',
                    time: 'Friday, 8:00 PM',
                    channel: 'NextGen Youth'
                  }
                ].map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-blue-800/20 rounded transition-colors">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">{event.title}</p>
                      <p className="text-blue-300 text-xs">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat (Placeholder) */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>💬</span>
                Live Chat
              </h4>
              <div className="bg-gray-800 rounded p-4 text-center">
                <p className="text-gray-400 text-sm mb-3">Live chat will appear here when a stream is selected</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
                  Enable Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Live Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Popular Live Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Sunday Service', icon: '⛪', count: '12+ live' },
              { name: 'Bible Study', icon: '📖', count: '8+ live' },
              { name: 'Worship', icon: '🎵', count: '15+ live' },
              { name: 'Prayer', icon: '🙏', count: '6+ live' }
            ].map((category, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                <p className="text-green-400 text-sm">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}