// lib/liveStreamApi.ts
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  scheduledStartTime: string;
  actualStartTime?: string;
  concurrentViewers: string;
  isLive: boolean;
  chatId?: string;
}

class LiveStreamService {
  async searchChristianLiveStreams(): Promise<LiveStream[]> {
    try {
      // For demo purposes, return mock data
      // In production, you would use the YouTube API
      return this.getMockLiveStreams();
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return this.getMockLiveStreams();
    }
  }

  async getPopularChristianLiveStreams(): Promise<LiveStream[]> {
    return this.searchChristianLiveStreams();
  }

  // Mock data for development
  private getMockLiveStreams(): LiveStream[] {
    return [
      {
        id: 'live1',
        title: 'Sunday Worship Service - Live from Grace Church',
        description: 'Join us for live worship and teaching from the Word of God. Experience the presence of God through powerful worship and anointed preaching.',
        thumbnail: 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Live+Worship',
        channelTitle: 'Grace Church International',
        scheduledStartTime: new Date().toISOString(),
        actualStartTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        concurrentViewers: '1,250',
        isLive: true,
        chatId: 'live1_chat'
      },
      {
        id: 'live2',
        title: 'Bible Study: Book of Romans - Live Teaching',
        description: 'Deep dive into the Book of Romans with Pastor John. Understanding grace, faith, and righteousness through Christ.',
        thumbnail: 'https://via.placeholder.com/320x180/DC2626/FFFFFF?text=Bible+Study',
        channelTitle: 'Faith Bible Church',
        scheduledStartTime: new Date().toISOString(),
        actualStartTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        concurrentViewers: '890',
        isLive: true,
        chatId: 'live2_chat'
      },
      {
        id: 'live3',
        title: 'Morning Prayer Session - Live Intercession',
        description: 'Join our community for morning prayer and intercession. Praying for nations, families, and breakthrough.',
        thumbnail: 'https://via.placeholder.com/320x180/059669/FFFFFF?text=Live+Prayer',
        channelTitle: 'Prayer Tower Ministries',
        scheduledStartTime: new Date().toISOString(),
        actualStartTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        concurrentViewers: '450',
        isLive: true,
        chatId: 'live3_chat'
      },
      {
        id: 'live4',
        title: 'Youth Worship Night - Contemporary Praise',
        description: 'Contemporary worship and message for young adults. Relevant teaching for the next generation.',
        thumbnail: 'https://via.placeholder.com/320x180/7C3AED/FFFFFF?text=Youth+Live',
        channelTitle: 'NextGen Church',
        scheduledStartTime: new Date().toISOString(),
        actualStartTime: new Date().toISOString(),
        concurrentViewers: '320',
        isLive: true,
        chatId: 'live4_chat'
      }
    ];
  }

  // Get stream URL for embedding
  getStreamEmbedUrl(streamId: string): string {
    // For mock data, use a placeholder
    if (streamId.startsWith('live')) {
      return `https://www.youtube.com/embed/dQw4w9WgXcQ`; // Example video
    }
    return `https://www.youtube.com/embed/${streamId}`;
  }

  // Get chat embed URL
  getChatEmbedUrl(chatId: string): string {
    return `https://www.youtube.com/live_chat?v=${chatId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
  }
}

export const liveStreamService = new LiveStreamService();