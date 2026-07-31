import React from 'react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';

export default function SearchResults({ searchQuery, navigateTo, addToCart }) {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-sm text-gray-400 mb-8">Showing matching items for "{searchQuery || 'all'}"</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} navigateTo={navigateTo} addToCart={addToCart}  />
        ))}
      </div>
    </div>
  );
}