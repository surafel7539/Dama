import React from 'react';
import { MOCK_CATEGORIES } from '../data/mockData';

export default function Categories({ categories, navigateTo = () => {} }) {
  // Use passed categories from API, or fallback to MOCK_CATEGORIES
  const categoryList = MOCK_CATEGORIES;
  const safeCategoryList = Array.isArray(categoryList)
  ? categoryList
  : [];

  return (
    <div className="max-w-[1600px] dark:text-white text-gray-800 mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl  font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeCategoryList.map(c => {
          const categoryId = c._id || c.id;
          const categoryName = c.name || c.title || 'Category';
          const itemCount = c.count ?? c.itemCount ?? 0;
          const categoryIcon = c.icon || '📦';

          return (
            <div 
              key={categoryId} 
              onClick={() => navigateTo('marketplace', categoryName)} 
              className="p-8 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-600 dark:border-gray-800 hover:border-[#c29b57] cursor-pointer transition-all flex items-center gap-6"
            >
              <span className="text-5xl">{categoryIcon}</span>
              <div>
                <h3 className="text-lg font-bold">{categoryName}</h3>
                <p className="text-xs text-gray-700">{itemCount} Items Available</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}