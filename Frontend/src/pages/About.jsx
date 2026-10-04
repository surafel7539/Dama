import React from "react";
import { ShieldCheck, Truck, Store, HeartHandshake } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Buyer protection",
    text: "Payments and orders stay tied to your account, so you can shop with a clear record.",
  },
  {
    icon: Truck,
    title: "Local delivery",
    text: "Sellers ship across Ethiopia, with Addis Ababa addresses and phone numbers collected at checkout.",
  },
  {
    icon: Store,
    title: "Seller tools",
    text: "Premium sellers list products, track stock, and see the orders placed on their items.",
  },
  {
    icon: HeartHandshake,
    title: "Reviews you can trust",
    text: "Buyers rate products after purchase and can update or remove their own review.",
  },
];

export default function About({ navigateTo }) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
      <div className="text-center">
        <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-3">
          Dama Marketplace
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#041c14] dark:text-white">
          Commerce built for Ethiopia
        </h1>
        <p className="text-[#8ba39a] max-w-2xl mx-auto leading-relaxed mt-5">
          Dama connects buyers and sellers with a marketplace that stays readable in daylight and after dark, without changing the green and gold you already know.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-12">
        {POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <div
              key={point.title}
              className="bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-[#c29b57]/10 text-[#c29b57] flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="font-bold text-[#041c14] dark:text-white">{point.title}</h2>
              <p className="text-sm text-[#8ba39a] mt-2 leading-relaxed">{point.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-[#0a291f] rounded-3xl p-8 sm:p-10 text-center border border-[#c29b57]/20">
        <h2 className="text-2xl font-extrabold text-white">Ready to look around?</h2>
        <p className="text-gray-300 mt-2 text-sm">
          Bole, Addis Ababa · +251 911 000 000
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={() => navigateTo("marketplace")}
            className="bg-[#c29b57] text-[#041c14] px-6 py-3 rounded-xl font-bold hover:bg-[#a88548]"
          >
            Marketplace
          </button>
          <button
            onClick={() => navigateTo("seller-dashboard")}
            className="border border-[#c29b57] text-[#c29b57] px-6 py-3 rounded-xl font-bold hover:bg-[#c29b57]/10"
          >
            Start selling
          </button>
        </div>
      </div>
    </div>
  );
}
