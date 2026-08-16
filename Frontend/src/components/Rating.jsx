import React, { useState } from "react";
import { Star } from "lucide-react";

export default function Rating({
  onSubmit,
  initialRating = 0,
  loading = false,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  const handleMouseMove = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const isHalf = mouseX < rect.width / 2;

    setHoverRating(isHalf ? star - 0.5 : star);
  };

  const handleClick = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const isHalf = mouseX < rect.width / 2;

    const selectedRating = isHalf
      ? star - 0.5
      : star;

    setRating(selectedRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = () => {
    if (!rating || rating < 1) return;

    onSubmit(rating);
  };

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const full = displayRating >= star;
          const half =
            displayRating >= star - 0.5 &&
            displayRating < star;

          return (
            <div
              key={star}
              className="relative cursor-pointer"
              onMouseMove={(e) =>
                handleMouseMove(e, star)
              }
              onClick={(e) =>
                handleClick(e, star)
              }
              onMouseLeave={handleMouseLeave}
            >

              {/* Empty star */}
              <Star
                size={32}
                className="text-gray-500"
              />

              {/* Filled star / half star */}
              {(full || half) && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{
                    width: full ? "100%" : "50%",
                  }}
                >
                  <Star
                    size={32}
                    className="text-[#c29b57] fill-[#c29b57]"
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-400">
        {displayRating > 0
          ? `${displayRating} / 5`
          : "Select a rating"}
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || rating < 1}
        className="bg-[#c29b57] text-[#041c14] px-6 py-2 rounded-xl font-bold disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialRating
          ? "Update Rating"
          : "Submit Rating"}
      </button>

    </div>
  );
}