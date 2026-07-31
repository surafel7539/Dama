import React from 'react';

export default function Footer({ navigateTo, t }) {
  return (
    <footer className="bg-[#041c14] text-white border-t border-[#0a291f] pt-12 pb-8 px-6 md:px-12 text-sm">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#c29b57] mb-2">DAMA MARKETPLACE</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Authentic luxury and trusted commerce platform across Ethiopia.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase text-[#c29b57] mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><button onClick={() => navigateTo('home')} className="hover:text-[#c29b57]">home</button></li>
            <li><button onClick={() => navigateTo('marketplace')} className="hover:text-[#c29b57]">marketplace</button></li>
            <li><button onClick={() => navigateTo('categories')} className="hover:text-[#c29b57]">categories</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase text-[#c29b57] mb-3">Support</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><button onClick={() => navigateTo('about')} className="hover:text-[#c29b57]">about</button></li>
            <li><button onClick={() => navigateTo('contact')} className="hover:text-[#c29b57]">contact</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase text-[#c29b57] mb-3">Contact Us</h4>
          <p className="text-xs text-gray-400">Bole, Addis Ababa, Ethiopia</p>
          <p className="text-xs text-gray-400 mt-1">+251 911 000 000</p>
        </div>
      </div>
      <div className="border-t border-[#0a291f] pt-6 text-center text-xs text-gray-500">
        © 2026 Dama Marketplace. All rights reserved.
      </div>
    </footer>
  );
}