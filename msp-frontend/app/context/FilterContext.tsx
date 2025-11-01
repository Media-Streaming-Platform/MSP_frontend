// context/FilterContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <FilterContext.Provider value={{
      activeFilter,
      setActiveFilter,
      selectedCategory,
      setSelectedCategory
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}