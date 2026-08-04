import React from 'react';
import { Star } from 'lucide-react';

export default function ProductCard({ 
  product, 
  navigateTo = () => {}, 
  addToCart = () => {} 
}) {
  

  if (!product) return null;

  // Handles both MongoDB '_id' and mock data 'id'
  const productId = product._id || product.id;

  // Handles both string sellers and populated MongoDB user objects
  const sellerName = typeof product.seller === 'object' && product.seller !== null
    ? product.seller.fullName || product.seller.email
    : (product.seller || 'Verified Seller');

  // Handles name/title and image fallback
  const productName = product.name || product.title || 'Product';
  const productImage = product.image || product.imageUrl || 'https://via.placeholder.com/300?text=No+Image';

  return (
    <div className="bg-white dark:bg-[#0a291f] text-gray-900 dark:text-white rounded-xl overflow-hidden border border-gray-900 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Product Image Container */}
      <div 
        onClick={() => navigateTo('product-details', product._id || product.id)}
        className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-800/50 p-4 cursor-pointer overflow-hidden flex items-center justify-center"
      >
        <img 
          src={productImage} 
          alt={productName} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300?text=Image+Unavailable";
          }}
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 
          onClick={() => navigateTo('product-details', productId)}
          className="font-bold text-base cursor-pointer hover:text-[#c29b57] dark:hover:text-[#c29b57] transition-colors line-clamp-1"
        >
          {productName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{sellerName}</p>

        <div className="flex justify-between items-center mb-4 mt-auto">
          <span className="font-bold text-lg text-gray-900 dark:text-white">Br {product.price}</span>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
            <Star size={14} className="text-[#c29b57] fill-current mr-1" />
            <span>{product.rating || 5.0}</span>
          </div>
        </div>

        <button 
          onClick={() => addToCart(product)} 
          className="w-full bg-[#041c14]  hover:text-[#c29b57] dark:bg-[#c29b57] dark:hover:bg-[#c29b57] dark:hover:text-[#041c14] border border-[#c29b57]/40 text-white py-2.5 rounded font-semibold text-xs transition-colors"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}