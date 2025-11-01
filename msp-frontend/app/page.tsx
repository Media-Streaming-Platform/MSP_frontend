// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import ContentRow from './components/ContentRow';
import { apiService, Category, Media } from './lib/api';
import { useFilter } from './context/FilterContext';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeFilter, selectedCategory } = useFilter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, mediaResponse] = await Promise.all([
          apiService.getAllCategories(),
          apiService.getAllMedia()
        ]);
        
        setCategories(categoriesData);
        setMedia(mediaResponse.mediaList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get categories that actually have content - FIXED VERSION
  const getCategoriesWithContent = () => {
    return categories.filter(category => 
      media.some(item => {
        // Check if categories exists and is an object with _id
        if (item.categories && typeof item.categories === 'object' && item.categories._id) {
          return item.categories._id === category._id;
        }
        return false;
      })
    );
  };

  if (loading) {
    return (
      <main className="pb-20">
        <HeroSection />
        <div className="space-y-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="px-6 py-8">
              <div className="h-8 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
              <div className="flex gap-6 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-98 animate-pulse">
                    <div className="bg-gray-800 rounded-xl w-98 h-80"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const categoriesWithContent = getCategoriesWithContent();

  return (
    <main className="pb-20">
      <HeroSection />
      
      {/* Show filter status */}
      {activeFilter !== 'all' && (
        <div className="px-6 py-4 bg-gray-900 mx-6 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Showing:</span>
              <span className="text-white font-semibold">
                {selectedCategory || 'Selected Category'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Always show these sections */}
      {/* <ContentRow 
        title={activeFilter === 'all' ? "Continue Watching" : `Continue Watching - ${selectedCategory}`}
        category="continue-watching"
        showProgress={true}
        filter={activeFilter}
      />
      
      <ContentRow 
        title={activeFilter === 'all' ? "Trending Now" : `Trending - ${selectedCategory}`}
        category="trending"
        showSeeAll={true}
        filter={activeFilter}
      />

      <ContentRow 
        title={activeFilter === 'all' ? "Featured Videos" : `Featured - ${selectedCategory}`}
        category="featured"
        showSeeAll={true}
        filter={activeFilter}
      /> */}

      {/* Show all categories when no filter is active */}
      {activeFilter === 'all' && categoriesWithContent.slice(0, 3).map((category) => {
        const categoryMediaCount = media.filter(item => {
          // Safe check for categories
          if (item.categories && typeof item.categories === 'object' && item.categories._id) {
            return item.categories._id === category._id;
          }
          return false;
        }).length;

        return (
          <ContentRow 
            key={category._id}
            title={`${category.name} (${categoryMediaCount})`}
            genre={category.name}
            showSeeAll={true}
          />
        );
      })}

      {/* All content section */}
      <ContentRow 
        title={activeFilter === 'all' ? "All Content" : `All ${selectedCategory} Content`}
        showSeeAll={true}
        filter={activeFilter}
      />
    </main>
  );
}