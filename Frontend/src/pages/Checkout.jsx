import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function Checkout({
  navigateTo = () => {},
  cartItems = [],
  setCartItems = () => {},
}) {
  const { user } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
  fullName: user?.fullName || "",
  address: "",
  phone: "",
});
  const [paymentMethod, setPaymentMethod] =
    useState("telebirr");

  const [loading, setLoading] = useState(false);

  // Load user's name when auth finishes loading
  useEffect(() => {
    setShippingInfo((prev) => ({
      ...prev,
      fullName: user?.fullName || "",
    }));
  }, [user]);

  // ==============================
  // PLACE ORDER
  // ==============================
  const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (!cartItems || cartItems.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  if (
    !shippingInfo.fullName.trim() ||
    !shippingInfo.address.trim() ||
    !shippingInfo.phone.trim()
  ) {
    toast.error("Please fill in all shipping details.");
    return;
  }

  setLoading(true);

  const toastId = toast.loading("Processing order...");

  try {
    const orderItems = cartItems.map((item) => ({
      product: item._id || item.id,
      quantity: Number(item.quantity || 1),
    }));

    const totalAmount = cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );

    const response = await apiRequest("/orders", {
  method: "POST",
  body: JSON.stringify({
    items: orderItems,
    totalAmount,
    shippingInfo,
    paymentMethod,
  }),
});

    console.log("Order created:", response);

    toast.dismiss(toastId);
    toast.success("Order placed successfully!");

    setCartItems([]);

    navigateTo("buyer-dashboard");
  } catch (error) {
    toast.dismiss(toastId);

    console.error("Place order error:", error);

    toast.error(
      error.message || "Failed to place order"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl dark:text-white font-bold mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        className="grid dark:text-white md:grid-cols-2 gap-8"
      >
        {/* ==============================
            SHIPPING INFORMATION
        ============================== */}

        <div className="space-y-6 bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3">
            Shipping Details
          </h2>

          <div className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                Full Name
              </label>

              <input
                type="text"
                required
                value={shippingInfo.fullName}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    fullName: e.target.value,
                  })
                }
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                Delivery Address
              </label>

              <input
                type="text"
                required
                placeholder="eg: Bole, Addis Ababa, Ethiopia"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    address: e.target.value,
                  })
                }
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                required
                placeholder="eg: +251 912 345 678"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    phone: e.target.value,
                  })
                }
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
              />
            </div>
          </div>
        </div>

        {/* ==============================
            PAYMENT
        ============================== */}

        <div className="space-y-6 bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-fit">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3">
            Payment Method
          </h2>

          <div className="space-y-3">
            {/* TELEBIRR */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === "telebirr"
                  ? "border-[#c29b57] bg-[#c29b57]/10"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={
                  paymentMethod === "telebirr"
                }
                onChange={() =>
                  setPaymentMethod("telebirr")
                }
              />

              <span className="font-bold text-sm">
                Telebirr / CBE Birr
              </span>
            </label>

            {/* CARD */}
            <label
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === "card"
                  ? "border-[#c29b57] bg-[#c29b57]/10"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={
                  paymentMethod === "card"
                }
                onChange={() =>
                  setPaymentMethod("card")
                }
              />

              <span className="font-bold text-sm">
                Credit / Debit Card
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded-lg font-bold hover:bg-[#a88548] transition-colors mt-6 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}