import React from "react";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import {
  productId,
  productName,
  productImage,
  sellerName,
  parsePrice,
  formatPrice,
  stockOf,
} from "../utils/product";

const FALLBACK_IMAGE =
  "https://placehold.co/160x160/f4f5f7/041c14?text=No+Image";

export default function Cart({ cartItems, setCartItems, navigateTo }) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * (item.qty || 1);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  const updateQty = (id, nextQty) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (productId(item) !== id) return item;
          const stock = stockOf(item);
          if (stock !== null && nextQty > stock) return item;
          return { ...item, qty: nextQty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => productId(item) !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-12">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
            Bag
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#041c14] dark:text-white">
            Cart
          </h1>
          <p className="text-sm text-[#8ba39a] mt-2">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Remove every item from your cart?")) {
                setCartItems([]);
              }
            }}
            className="text-sm font-bold text-red-400 hover:text-red-300"
          >
            Clear cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a291f] rounded-3xl border border-gray-200 dark:border-[#17382d]">
          <ShoppingBag size={40} className="mx-auto text-[#c29b57] mb-4" />
          <h2 className="font-bold text-lg text-[#041c14] dark:text-white">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#8ba39a] mt-2 mb-6">
            Add a product and it will show up here.
          </p>
          <button
            onClick={() => navigateTo("marketplace")}
            className="bg-[#c29b57] text-[#041c14] px-6 py-3 rounded-xl font-bold hover:bg-[#a88548]"
          >
            Browse marketplace
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemId = productId(item);
              const name = productName(item);
              const image = productImage(item) || FALLBACK_IMAGE;
              const stock = stockOf(item);
              const atMax = stock !== null && (item.qty || 1) >= stock;

              return (
                <div
                  key={itemId}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <button
                    onClick={() => navigateTo("product-details", itemId)}
                    className="shrink-0"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-24 h-24 object-contain rounded-xl bg-[#f4f5f7] dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d]"
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigateTo("product-details", itemId)}
                      className="font-bold text-[#041c14] dark:text-white text-left hover:text-[#c29b57]"
                    >
                      {name}
                    </button>
                    <p className="text-xs text-[#8ba39a] mt-1">{sellerName(item.seller)}</p>
                    <p className="text-sm font-bold text-[#c29b57] mt-2">
                      {formatPrice(item.price)}
                    </p>
                    {stock !== null && (
                      <p className="text-xs text-[#8ba39a] mt-1">{stock} in stock</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(itemId, (item.qty || 1) - 1)}
                      className="p-2 rounded-lg bg-[#f4f5f7] dark:bg-[#041c14] text-[#041c14] dark:text-white hover:text-[#c29b57]"
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-bold min-w-8 text-center text-[#041c14] dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(itemId, (item.qty || 1) + 1)}
                      disabled={atMax}
                      className="p-2 rounded-lg bg-[#f4f5f7] dark:bg-[#041c14] text-[#041c14] dark:text-white hover:text-[#c29b57] disabled:opacity-40"
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(itemId)}
                      className="p-2 text-red-400 hover:text-red-300 ml-1"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] h-fit space-y-4">
            <h2 className="font-bold text-lg text-[#041c14] dark:text-white border-b border-gray-200 dark:border-[#17382d] pb-3">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-[#8ba39a]">Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8ba39a]">Shipping</span>
              <span className="font-bold text-green-600 dark:text-green-400">Free</span>
            </div>
            <div className="border-t border-gray-200 dark:border-[#17382d] pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#c29b57]">{formatPrice(subtotal)}</span>
            </div>
            <button
              onClick={() => navigateTo("checkout")}
              className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded-xl font-bold hover:bg-[#a88548] transition-colors"
            >
              Proceed To Checkout
            </button>
            <button
              onClick={() => navigateTo("marketplace")}
              className="w-full border border-gray-200 dark:border-[#17382d] py-3 rounded-xl font-bold text-sm hover:border-[#c29b57] hover:text-[#c29b57]"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
