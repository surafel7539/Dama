import React from 'react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';

export default function Marketplace({ navigateTo, addToCart,searchQuery = '', products = [] }) {
const allProducts = products?.length > 0 
  ? products 
  :  MOCK_PRODUCTS;
  const filteredProducts = products.filter(p => {
    const name = (p.name || p.title || '').toLowerCase();

    const category = (
      typeof p.category === 'object'
        ? p.category?.name
        : p.category || ''
    ).toLowerCase();

    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) ||
      category.includes(query)
    );
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Marketplace {searchQuery && `for "${searchQuery}"`}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-400 py-12 text-center">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
  key={p._id || p.id}
  product={p}
  navigateTo={navigateTo}
  addToCart={addToCart}
/>
          ))}
        </div>
      )}
    </div>
  );
}