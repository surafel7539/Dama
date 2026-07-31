import React from 'react';

export default function About({ navigateTo, t }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 text-center space-y-8">
      <h1 className="text-4xl font-serif text-[#c29b57]">About</h1>
      <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Dama Marketplace is Ethiopia's premier e-commerce platform connecting buyers and sellers with trust, quality, and exceptional service.
      </p>
      <button onClick={() => navigateTo('marketplace')} className="bg-[#c29b57] text-[#041c14] px-8 py-3 rounded font-bold hover:bg-[#a88548] transition-colors">
        MarketPlace
      </button>
    </div>
  );
}