import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';

export default function ProductDetails({ productId, addToCart, navigateTo}) {
  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
      <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden p-6 flex items-center justify-center">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs text-[#c29b57] uppercase font-bold tracking-wider">{product.category}</span>
            <h1 className="text-3xl font-bold mt-1 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-400 mb-4">Sold by: <span className="text-white font-medium">{product.seller}</span></p>
            
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Star className="text-[#c29b57] fill-current" size={18} />
              <span className="font-bold">{product.rating}</span>
              <span className="text-gray-400">(128 reviews)</span>
            </div>

            <div className="text-3xl font-bold text-[#c29b57] mb-6">
              Br {product.price}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed mb-6">
              Handcrafted with exceptional quality and care. Authentic luxury crafted to perfection, meeting high standards of durability and style.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product)} 
              className="flex-1 bg-[#041c14] dark:bg-[#072a1f] border border-[#c29b57]/40 text-white py-3.5 rounded-lg font-bold hover:bg-[#c29b57] hover:text-[#041c14] transition-all"
            >
              addToCart
            </button>
            <button 
              onClick={() => { addToCart(product); navigateTo('checkout'); }} 
              className="flex-1 bg-[#c29b57] text-[#041c14] py-3.5 rounded-lg font-bold hover:bg-[#a88548] transition-all"
            >
              buyNow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}