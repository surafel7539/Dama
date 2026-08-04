import React, { useState, useEffect } from "react";
import { Star, ArrowLeft } from "lucide-react";
import Rating from "../components/Rating";
import { apiRequest, addProductRating } from "../services/api";
import toast from "react-hot-toast";

export default function ProductDetails({
  productId,
  products = [],
  addToCart,
  navigateTo,
}) {
  const product = products.find(
    (p) => String(p._id || p.id) === String(productId)
  );

  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const checkRating = async () => {
      try {
        const data = await apiRequest(`/products/${productId}/has-rated`);
        setHasRated(data.hasRated);
      } catch (error) {
        console.log(error);
      }
    };

    checkRating();
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          Product not found
        </h1>

        <button
          onClick={() => navigateTo("marketplace")}
          className="flex items-center gap-2 bg-[#c29b57] text-black px-5 py-3 rounded-xl font-bold"
        >
          <ArrowLeft size={18} />
          Back to Marketplace
        </button>
      </div>
    );
  }

  const submitRating = async (rating) => {
    try {
      await addProductRating(product._id || product.id, {
        rating,
      });

      toast.success("Thanks for rating this product!");

      // Hide rating component immediately
      setHasRated(true);

      // Update displayed rating without refreshing
      product.numReviews = (product.numReviews || 0) + 1;
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
      <button
        onClick={() => navigateTo("marketplace")}
        className="flex items-center cursor-pointer gap-2 mb-6 text-[#c29b57] font-bold"
      >
        <ArrowLeft size={22} />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-[#0a291f] p-8 rounded-2xl">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center">
          <img
            src={product.image || product.imageUrl}
            alt={product.title || product.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mt-2">
            {product.title || product.name}
          </h1>

          <p className="mt-4 text-gray-400">
            Sold by:
            <span className="ml-2 text-white">
              {product.seller?.fullName ||
                product.seller ||
                "Unknown"}
            </span>
          </p>

          <div className="flex items-center gap-2 mt-5">
            <Star
              className="text-[#c29b57] fill-current"
              size={20}
            />

            <span>
              {product.averageRating
                ? product.averageRating.toFixed(1)
                : "No rating"}
            </span>

            <span className="text-gray-400">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#c29b57] mt-6">
            Br {product.price}
          </h2>

          <p className="text-lg text-gray-400 mt-2">
            Stock:
            <span className="font-bold ml-2">
              {product.stock || 0}
            </span>
          </p>

          <p className="mt-5 text-gray-400">
            {product.description ||
              "High quality product crafted with care."}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 w-full bg-[#c29b57] text-black py-3 rounded-xl font-bold"
          >
            Add To Cart
          </button>

          {/* Rating Section */}
          <div className="mt-10 border-t border-gray-700 pt-6">
            {!hasRated ? (
              <Rating onSubmit={submitRating} />
            ) : (
              <div className="text-green-500 font-semibold text-center">
                ✅ You have already rated this product.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}