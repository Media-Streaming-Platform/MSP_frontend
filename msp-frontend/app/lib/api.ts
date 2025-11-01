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
// lib/api.ts - Updated getMediaUrl method
getMediaUrl(media: Media): string {
  if (media.filePath) {
    console.log('Original filePath:', media.filePath);
    
    // Handle Windows paths (C:\Users\...)
    if (media.filePath.includes('C:\\')) {
      console.log('Windows path detected');
      // Extract just the folder name from Windows path for HLS
      const pathParts = media.filePath.split('\\');
      const hlsFolder = pathParts.find(part => part.includes('hls'));
      const masterIndex = pathParts.indexOf('master.m3u8');
      
      if (masterIndex > 0) {
        const folderName = pathParts[masterIndex - 1];
        return `${API_BASE_URL}/uploads/hls/${folderName}/master.m3u8`;
      }
    }
    
    // Handle Linux paths starting with /uploads/hls/
    if (media.filePath.includes('/uploads/hls/')) {
      console.log('Linux HLS path detected');
      // Extract path after /uploads/hls/
      const pathAfterUploads = media.filePath.split('/uploads/hls/')[1];
      if (pathAfterUploads) {
        return `${API_BASE_URL}/uploads/hls/${pathAfterUploads}`;
      }
    }
    
    // Handle relative paths that start with /uploads/
    if (media.filePath.startsWith('/uploads/')) {
      console.log('Relative uploads path detected');
      return `${API_BASE_URL}${media.filePath}`;
    }
    
    // If it's already a full URL, return as is
    if (media.filePath.startsWith('http')) {
      console.log('Full URL detected');
      return media.filePath;
    }
    
    console.log('Default path handling');
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