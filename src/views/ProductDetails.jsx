import React, { useState, useEffect } from "react";
import { Star, ArrowLeft, Trash2, Heart, Minus, Plus } from "lucide-react";
import Rating from "../components/Rating";
import {
  apiRequest,
  addProductRating,
  deleteProductRating,
} from "../services/api";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import {
  productId,
  productName,
  categoryName,
  sellerName,
  stockOf,
  formatPrice,
  ratingOf,
} from "../utils/product";

export default function ProductDetails({
  productId: selectedId,
  products = [],
  productsLoading = false,
  addToCart,
  navigateTo,
  saved = false,
  onToggleWishlist,
  wishlistIds = [],
}) {
  const product = products.find(
    (p) => String(productId(p)) === String(selectedId)
  );

  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(product?.ratings || []);
  const [currentUser, setCurrentUser] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await apiRequest("/auth/profile");
        setCurrentUser(data.user || data);
      } catch (error) {
        console.log("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    setQty(1);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    const checkRating = async () => {
      try {
        const data = await apiRequest(
          `/products/${selectedId}/has-rated`
        );

        setHasRated(data.hasRated);

        if (data.rating) {
          setUserRating(data.rating);
        }
      } catch (error) {
        console.log("Rating check error:", error);
      }
    };

    checkRating();
  }, [selectedId]);

  useEffect(() => {
    if (product?.ratings) {
      setReviews(product.ratings);
    }
  }, [product]);

  if (!product) {
    if (productsLoading) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
          Loading product...
        </div>
      );
    }

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

  const stock = stockOf(product);
  const outOfStock = stock !== null && stock <= 0;
  const maxQty = stock === null ? 20 : Math.max(stock, 1);

  const related = products
    .filter((item) => {
      if (String(productId(item)) === String(selectedId)) return false;
      const sameCategory =
        categoryName(item.category) &&
        categoryName(item.category) === categoryName(product.category);
      return sameCategory;
    })
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    const added = addToCart(product, qty);
    if (added) navigateTo("checkout");
  };

  const submitRating = async (rating) => {
    if (ratingLoading) return;

    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    try {
      setRatingLoading(true);

      const response = await addProductRating(
        product._id || product.id,
        {
          rating,
          comment: comment.trim(),
        }
      );

      if (response?.product) {
        product.averageRating = response.product.averageRating;
        product.numReviews = response.product.numReviews;
        product.ratings = response.product.ratings;

        setReviews(response.product.ratings || []);
      }

      setHasRated(true);
      setUserRating(rating);
      setComment("");

      toast.success(
        hasRated
          ? "Your review has been updated!"
          : "Thanks for reviewing this product!"
      );
    } catch (error) {
      console.error("Rating error:", error);

      toast.error(
        error.message || "Failed to submit review"
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (ratingLoading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    try {
      setRatingLoading(true);

      const response = await deleteProductRating(
        product._id || product.id
      );

      if (response?.product) {
        product.averageRating = response.product.averageRating;
        product.numReviews = response.product.numReviews;
        product.ratings = response.product.ratings;

        setReviews(response.product.ratings || []);
      } else {
        setReviews(
          reviews.filter(
            (review) =>
              String(review.user?._id) !==
              String(currentUser?._id)
          )
        );
      }

      setHasRated(false);
      setUserRating(null);

      toast.success("Your review was deleted.");
    } catch (error) {
      console.error("Delete rating error:", error);

      toast.error(
        error.message || "Failed to delete review"
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const isOwnReview = (review) => {
    if (!currentUser || !review.user) return false;

    const reviewUserId =
      typeof review.user === "object"
        ? review.user._id
        : review.user;

    const currentUserId =
      currentUser._id || currentUser.id;

    return (
      String(reviewUserId) === String(currentUserId)
    );
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

        <div className="aspect-square bg-[#f4f5f7] dark:bg-[#041c14] rounded-xl p-6 flex items-center justify-center border border-gray-200 dark:border-[#17382d]">
          <img
            src={product.image || product.imageUrl}
            alt={productName(product)}
            className="w-full h-full object-contain"
            onError={(event) => {
              event.target.onerror = null;
              event.target.src =
                "https://placehold.co/800x800/f4f5f7/041c14?text=No+Image";
            }}
          />
        </div>

        <div>

          {categoryName(product.category) && (
            <p className="text-xs font-bold uppercase tracking-widest text-[#c29b57]">
              {categoryName(product.category)}
            </p>
          )}

          <h1 className="text-3xl font-bold mt-2 text-[#041c14] dark:text-white">
            {productName(product)}
          </h1>

          <p className="mt-4 text-[#8ba39a]">
            Sold by:
            <span className="ml-2 text-[#041c14] dark:text-white font-semibold">
              {sellerName(product.seller)}
            </span>
          </p>

          <div className="flex items-center gap-2 mt-5">

            <Star
              className="text-[#c29b57] fill-current"
              size={20}
            />

            <span className="font-bold">
              {ratingOf(product) !== null
                ? ratingOf(product).toFixed(1)
                : "No rating"}
            </span>

            <span className="text-gray-400">
              ({product.numReviews || 0} reviews)
            </span>

          </div>

          <h2 className="text-3xl font-bold text-[#c29b57] mt-6">
            {formatPrice(product.price)}
          </h2>

          <p className={`text-sm font-bold mt-3 ${outOfStock ? "text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {stock === null
              ? "Available"
              : outOfStock
              ? "Out of stock"
              : `${stock} in stock`}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-sm font-bold text-[#8ba39a]">Quantity</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="p-2 rounded-lg bg-[#f4f5f7] dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d]"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold min-w-6 text-center">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(maxQty, value + 1))}
              disabled={qty >= maxQty}
              className="p-2 rounded-lg bg-[#f4f5f7] dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d] disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>

          <p className="mt-5 text-gray-400">
            {product.description ||
              "High quality product crafted with care."}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] gap-3">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`px-4 py-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                  saved
                    ? "bg-[#c29b57] text-[#041c14] border-[#c29b57]"
                    : "border-gray-200 dark:border-[#17382d] hover:border-[#c29b57]"
                }`}
              >
                <Heart size={18} className={saved ? "fill-current" : ""} />
                {saved ? "Saved" : "Save"}
              </button>
            )}

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="w-full bg-transparent border-2 border-[#c29b57] text-[#c29b57] py-3 rounded-xl font-bold hover:bg-[#c29b57]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {outOfStock ? "Out of Stock" : "Add To Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded-xl font-bold hover:bg-[#a88548] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

          </div>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-[#0a291f] rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-[#041c14] dark:text-white">
          Customer Reviews
        </h2>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">

          <h3 className="text-lg font-bold mb-4">
            {hasRated
              ? "Update your review"
              : "Rate this product"}
          </h3>

          {hasRated && userRating && (
            <p className="text-sm text-gray-400 mb-4">
              Your current rating:
              <span className="text-[#c29b57] font-bold ml-2">
                {userRating}/5
              </span>
            </p>
          )}

          <Rating
            onSubmit={submitRating}
            initialRating={userRating || 0}
            loading={ratingLoading}
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            maxLength={500}
            className="w-full mt-5 p-4 rounded-xl bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
          />

          <div className="text-right text-xs text-gray-400 mt-1">
            {comment.length}/500
          </div>

        </div>

        <div className="mt-8 space-y-6">

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="border-b border-gray-200 dark:border-gray-700 pb-6"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-bold">
                      {review.user?.fullName ||
                        review.user?.name ||
                        "Dama Customer"}
                    </p>

                    <div className="flex items-center gap-1 mt-1">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? "text-[#c29b57] fill-[#c29b57]"
                              : "text-gray-400"
                          }
                        />
                      ))}

                      <span className="ml-2 text-sm text-gray-400">
                        {review.rating}/5
                      </span>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    {review.createdAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </span>
                    )}

                    {isOwnReview(review) && (
                      <button
                        onClick={handleDeleteRating}
                        disabled={ratingLoading}
                        className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    )}

                  </div>

                </div>

                {review.comment && (
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                )}

              </div>
            ))
          )}

        </div>

      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-[#041c14] dark:text-white">
            More in {categoryName(product.category) || "this category"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => {
              const id = String(productId(item));
              return (
                <ProductCard
                  key={id}
                  product={item}
                  navigateTo={navigateTo}
                  addToCart={addToCart}
                  saved={wishlistIds.includes(id)}
                  onToggleWishlist={onToggleWishlist}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}