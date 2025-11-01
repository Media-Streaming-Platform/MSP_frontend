// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://msp-backend-kxj1.onrender.com';

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Media {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'audio';
  categories: string | Category;
  filePath: string;
  numberOfViews: number;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MediaResponse {
  mediaList: Media[];
  audioCount: number;
  videoCount: number;
}

class ApiService {
  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // Category endpoints
  async getAllCategories(): Promise<Category[]> {
    return this.fetchApi('/category/get-all-categories');
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.fetchApi(`/category/get-by-id/${id}`);
  }

  async createCategory(name: string): Promise<{ message: string; category: Category }> {
    return this.fetchApi('/category/create-category', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Media endpoints
  async getAllMedia(): Promise<MediaResponse> {
    return this.fetchApi('/media/get-all');
  }

  async getMediaById(id: string): Promise<Media> {
    return this.fetchApi(`/media/get-by-id/${id}`);
  }

  async getMediaByCategory(categoryId: string): Promise<Media[]> {
    return this.fetchApi(`/media/get-by-category/${categoryId}`);
  }

  async getFeaturedMedia(): Promise<Media[]> {
    try {
      const response = await this.getAllMedia();
      return response.mediaList
        .filter(media => media.type === 'video' && media.isPublished)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting featured media:', error);
      return [];
    }
  }

  async getTrendingMedia(): Promise<Media[]> {
    try {
      const response = await this.getAllMedia();
      return response.mediaList
        .filter(media => media.type === 'video' && media.isPublished)
        .sort((a, b) => b.numberOfViews - a.numberOfViews)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting trending media:', error);
      return [];
    }
  }

  async getContinueWatching(): Promise<Media[]> {
    try {
      const response = await this.getAllMedia();
      return response.mediaList
        .filter(media => media.type === 'video' && media.isPublished)
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting continue watching:', error);
      return [];
    }
  }

  async searchMedia(query: string): Promise<Media[]> {
    try {
      const response = await this.getAllMedia();
      return response.mediaList.filter(media => 
        media.title.toLowerCase().includes(query.toLowerCase()) ||
        media.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching media:', error);
      return [];
    }
  }

  // Utility methods
 // In lib/api.ts - update getMediaUrl method
getMediaUrl(media: Media): string {
  if (media.filePath) {
    console.log('Original filePath:', media.filePath);
    
    // Handle HLS master playlist path
    if (media.filePath.includes('master.m3u8')) {
      // For paths like: /uploads/hls/1761985012020-765946606/master.m3u8
      // Extract the relative path and build full URL
      const pathParts = media.filePath.split('uploads/hls/');
      if (pathParts.length > 1) {
        const hlsUrl = `${API_BASE_URL}/uploads/hls/${pathParts[1]}`;
        console.log('Generated HLS URL:', hlsUrl);
        return hlsUrl;
      }
    }
    
    // If it's already a full URL, return as is
    if (media.filePath.startsWith('http')) {
      return media.filePath;
    }
    
    // For relative paths starting with /
    if (media.filePath.startsWith('/')) {
      return `${API_BASE_URL}${media.filePath}`;
    }
    
    // Default case
    return `${API_BASE_URL}/${media.filePath}`;
  }
  
  console.warn('No filePath found for media:', media._id);
  return '';
}

  getThumbnailUrl(media: Media): string {
    // If thumbnail exists in database
    if (media.thumbnail) {
      if (media.thumbnail.startsWith('http')) {
        return media.thumbnail;
      }
      return `${API_BASE_URL}${media.thumbnail}`;
    }
    
    // Generate dynamic placeholder based on media content
    const placeholderText = encodeURIComponent(media.title || 'Media');
    const backgroundColor = media.type === 'video' ? '4F46E5' : 'DC2626';
    const textColor = 'FFFFFF';
    
    return `https://via.placeholder.com/300x169/${backgroundColor}/${textColor}?text=${placeholderText}`;
  }

  getVideoThumbnail(media: Media): string {
    if (media.thumbnail) {
      return this.getThumbnailUrl(media);
    }
    
    // Better placeholder for videos
    const placeholderText = encodeURIComponent(media.title?.substring(0, 20) || 'Video');
    const type = media.type === 'video' ? 'VIDEO' : 'AUDIO';
    return `https://via.placeholder.com/300x169/1F2937/FFFFFF?text=${placeholderText}+%5B${type}%5D`;
  }

  formatMediaType(type: string): string {
    return type === 'video' ? 'Video' : 'Audio';
  }

  getCategoryName(media: Media): string {
    if (typeof media.categories === 'string') {
      return 'Unknown Category';
    }
    return media.categories?.name || 'Uncategorized';
  }

  getProgress(mediaId: string): number {
    const hash = mediaId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 80 + 10;
  }
}

export const apiService = new ApiService();