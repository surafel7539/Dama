import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function BuyerDashboard({ navigateTo }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [profile, setProfile] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);

        const data = await apiRequest("/orders/my-orders");

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.error(error.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Saving changes...");

    try {
      await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: profile.name,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      toast.dismiss(toastId);
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    const toastId = toast.loading("Updating password...");

    try {
      await apiRequest("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });

      toast.dismiss(toastId);
      toast.success("Password updated successfully!");

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to update password");
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "text-green-500 bg-green-500/10";
    }

    if (status === "In Transit") {
      return "text-blue-500 bg-blue-500/10";
    }

    return "text-amber-500 bg-amber-500/10";
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10 flex  flex-col gap-8">
      <h1 className="text-2xl font-bold dark:text-white text-[#041c14] mb-6">
        Buyer Dashboard
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">

        <div className="space-y-2">
          <button
            onClick={() => {setActiveTab("orders")
                  }
            }
            className={`w-full text-left p-3 rounded font-bold text-sm transition-colors ${
              activeTab === "orders"
                ? "bg-[#c29b57] text-[#041c14]"
                : "dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            My Orders
          </button>

          <button
            onClick={() =>{ navigateTo("profile") 
              setActiveTab("profile")}}
            className={`w-full text-left p-3 rounded text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-[#c29b57] text-[#041c14] font-bold"
                : "dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Profile
          </button>

          
        </div>

        <div className="lg:col-span-3 space-y-6">

          {activeTab === "orders" && (
            <div className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    Total Orders
                  </span>

                  <p className="text-2xl dark:text-white text-[#041c14] font-bold mt-2">
                    {totalOrders}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    Pending Orders
                  </span>

                  <p className="text-2xl font-bold text-[#c29b57] mt-2">
                    {pendingOrders}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    Total Spent
                  </span>

                  <p className="text-2xl dark:text-white text-[#041c14] font-bold mt-2">
                    Br {totalSpent.toLocaleString()}
                  </p>
                </div>

              </div>

              <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">

                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold dark:text-white text-[#041c14]">
                    My Orders
                  </h3>

                  <button
                    onClick={() => navigateTo("marketplace")}
                    className="text-sm text-[#c29b57] font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-gray-400">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-400 mb-4">
                      You haven't placed any orders yet.
                    </p>

                    <button
                      onClick={() => navigateTo("marketplace")}
                      className="bg-[#c29b57] text-[#041c14] px-5 py-2.5 rounded-lg font-bold text-sm"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">

                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                          <div>
                            <p className="font-bold dark:text-white text-[#041c14]">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">

                            <span className="font-bold text-[#c29b57]">
                              Br {Number(
                                order.totalAmount || 0
                              ).toLocaleString()}
                            </span>

                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>

                          </div>

                        </div>

                        <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">

                          <div className="space-y-2">

                            {order.items?.map((item, index) => (
                              <div
                                key={`${order._id}-${index}`}
                                className="flex justify-between text-sm"
                              >

                                <span className="dark:text-gray-300 text-gray-600">
                                  {item.title} × {item.quantity}
                                </span>

                                <span className="font-medium dark:text-white text-[#041c14]">
                                  Br {(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 0)
                                  ).toLocaleString()}
                                </span>

                              </div>
                            ))}

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6"
            >

              <h3 className="font-bold text-lg dark:text-white text-[#041c14]">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-white text-[#041c14] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                    Delivery Address
                  </label>

                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="bg-[#c29b57] text-[#041c14] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a88548] transition-colors"
              >
                Save Changes
              </button>

            </form>
          )}

          {activeTab === "settings" && (
            <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">

              <h3 className="font-bold text-lg dark:text-white text-[#041c14]">
                Account Settings
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-sm dark:text-white text-[#041c14]">
                      Email Notifications
                    </h4>

                    <p className="text-xs text-gray-400">
                      Receive order updates and promotions via email
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c29b57] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-sm dark:text-white text-[#041c14]">
                      SMS Alerts
                    </h4>

                    <p className="text-xs text-gray-400">
                      Receive real-time tracking SMS updates
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c29b57] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="pt-2">

                  <h4 className="font-bold text-sm dark:text-white text-[#041c14] mb-3">
                    Change Password
                  </h4>

                  <form
                    onSubmit={handlePasswordUpdate}
                    className="space-y-3 max-w-md"
                  >

                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] text-sm focus:outline-none focus:border-[#c29b57]"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] text-sm focus:outline-none focus:border-[#c29b57]"
                    />

                    <button
                      type="submit"
                      className="bg-[#c29b57] text-[#041c14] px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#a88548] transition-colors"
                    >
                      Update Password
                    </button>

                  </form>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}