// lib/api.ts - Add the missing endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL || ''; // Add your CMS URL here

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

  async updateCategory(id: string, name: string): Promise<{ message: string; category: Category }> {
    return this.fetchApi(`/category/update-category/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.fetchApi(`/category/delete-category/${id}`, {
      method: 'DELETE',
    });
  }

  // Media endpoints - ALL endpoints
  async getAllMedia(): Promise<MediaResponse> {
    return this.fetchApi('/media/get-all');
  }

  async getMediaById(id: string): Promise<Media> {
    return this.fetchApi(`/media/get-by-id/${id}`);
  }

  async getMediaByCategory(categoryId: string): Promise<Media[]> {
    return this.fetchApi(`/media/get-by-category/${categoryId}`);
  }

  async updateMedia(id: string, updates: Partial<Media>): Promise<{ message: string; media: Media }> {
    return this.fetchApi(`/media/update-media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMedia(id: string): Promise<{ message: string }> {
    return this.fetchApi(`/media/delete-media/${id}`, {
      method: 'DELETE',
    });
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
  // lib/api.ts - Update getMediaUrl method
getMediaUrl(media: Media): string {
  if (!media.filePath) {
    console.warn('No filePath found for media:', media._id);
    return '';
  }

  console.log('Original filePath:', media.filePath);

  // If it's already a full URL, return as is
  if (media.filePath.startsWith('http')) {
    return media.filePath;
  }

  // Handle Windows paths (C:\Users\...)
  if (media.filePath.includes('C:\\')) {
    console.log('Windows path detected');
    // Extract the folder name for HLS files
    if (media.filePath.includes('master.m3u8')) {
      const pathParts = media.filePath.split('\\');
      const masterIndex = pathParts.indexOf('master.m3u8');
      if (masterIndex > 0) {
        const folderName = pathParts[masterIndex - 1];
        return `${API_BASE_URL}/uploads/hls/${folderName}/master.m3u8`;
      }
    }
  }

  // Handle relative paths starting with /uploads/
  if (media.filePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${media.filePath}`;
  }

  // Handle paths that contain uploads/ but don't start with /
  if (media.filePath.includes('uploads/')) {
    // Extract everything after uploads/
    const uploadsIndex = media.filePath.indexOf('uploads/');
    const relativePath = media.filePath.substring(uploadsIndex);
    return `${API_BASE_URL}/${relativePath}`;
  }

  // Default case - just prepend base URL
  return `${API_BASE_URL}/${media.filePath}`;
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
    if (!media.categories) {
      return 'Uncategorized';
    }
    
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

  // CMS URL
  getCMSUrl(): string {
    return CMS_BASE_URL;
  }
}

export const apiService = new ApiService();