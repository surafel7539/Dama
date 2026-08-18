import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Store,
  Plus,
  Edit2,
  Package,
  DollarSign,
  TrendingUp,
  Trash2,
  Upload,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { apiRequest } from "../services/api";

export default function SellerDashboard({
  myProducts = [],
  setMyProducts = () => {},
}) {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sellerOrders, setSellerOrders] = useState([]);
const [revenue, setRevenue] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
    description: "",
    stock: "",
  });

  // ==============================
  // LOAD SELLER'S PRODUCTS
  // ==============================
  useEffect(() => {
  const loadSellerOrders = async () => {
    try {
      setLoadingOrders(true);

      const data = await apiRequest(
        "/orders/seller-orders"
      );

      setSellerOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );

      setRevenue(
        Number(data.revenue || 0)
      );

      console.log("Seller orders:", data.orders);
      console.log("Seller revenue:", data.revenue);
    } catch (error) {
      console.error(
        "Load seller orders error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load seller orders"
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  loadSellerOrders();
}, []);

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        setLoadingProducts(true);

        const data = await apiRequest("/products/my-products");

        const products = Array.isArray(data)
          ? data
          : data.products || [];

        setMyProducts(products);
      } catch (error) {
        console.error("Load seller products error:", error);

        toast.error(
          error.message || "Failed to load your products"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadMyProducts();
  }, [setMyProducts]);

  // ==============================
  // ADD PRODUCT
  // ==============================
  
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.image ||
      newProduct.stock === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Adding product...");

    try {
      const formData = new FormData();

      formData.append("title", newProduct.name.trim());
      formData.append(
        "description",
        newProduct.description.trim()
      );
      formData.append("price", Number(newProduct.price));
      formData.append("category", newProduct.category);
      formData.append("stock", Number(newProduct.stock));
      formData.append("image", newProduct.image);

      const createdProduct = await apiRequest("/products", {
        method: "POST",
        body: formData,
      });

      setMyProducts((prev) => [
        createdProduct,
        ...prev,
      ]);

      setNewProduct({
        name: "",
        price: "",
        category: "",
        image: null,
        description: "",
        stock: "",
      });

      setActiveTab("products");

      toast.dismiss(toastId);
      toast.success("Product listed successfully!");
    } catch (error) {
      console.error("Add product error:", error);

      toast.dismiss(toastId);

      toast.error(
        error.message || "Failed to publish product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // START EDITING
  // ==============================

  const startEditing = (product) => {
    setEditingProduct({
      ...product,

      _id: product._id || product.id,

      name:
        product.title ||
        product.name ||
        "",

      price:
        product.price ??
        "",

      category:
        product.category ||
        "",

      description:
        product.description ||
        "",

      stock:
        product.stock ??
        "",

      image: null,

      existingImage:
        product.image ||
        product.imageUrl ||
        "",
    });

    setActiveTab("edit");
  };

  // ==============================
  // EDIT PRODUCT
  // ==============================

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct?._id) {
      toast.error("Product ID is missing");
      return;
    }

    setLoading(true);

    const toastId = toast.loading(
      "Updating product..."
    );

    try {
      const formData = new FormData();

      formData.append(
        "title",
        editingProduct.name.trim()
      );

      formData.append(
        "price",
        Number(editingProduct.price)
      );

      formData.append(
        "category",
        editingProduct.category
      );

      formData.append(
        "description",
        editingProduct.description.trim()
      );

      formData.append(
        "stock",
        Number(editingProduct.stock)
      );

      if (editingProduct.image) {
        formData.append(
          "image",
          editingProduct.image
        );
      }

      const updatedProduct = await apiRequest(
        `/products/${editingProduct._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      setMyProducts((prev) =>
        prev.map((product) =>
          String(product._id || product.id) ===
          String(editingProduct._id)
            ? updatedProduct
            : product
        )
      );

      setEditingProduct(null);
      setActiveTab("products");

      toast.dismiss(toastId);
      toast.success(
        "Product updated successfully!"
      );
    } catch (error) {
      console.error(
        "Edit product error:",
        error
      );

      toast.dismiss(toastId);

      toast.error(
        error.message ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE PRODUCT
  // ==============================

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await apiRequest(
        `/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      setMyProducts((prev) =>
        prev.filter(
          (product) =>
            String(
              product._id || product.id
            ) !== String(productId)
        )
      );

      toast.success(
        "Product deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DASHBOARD STATISTICS
  // ==============================

  const totalProducts = myProducts.length;

  const totalStock = useMemo(() => {
    return myProducts.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );
  }, [myProducts]);

  const averageRating = useMemo(() => {
    const ratedProducts = myProducts.filter(
      (product) =>
        Number(product.numReviews || 0) > 0
    );

    if (!ratedProducts.length) return 0;

    const total = ratedProducts.reduce(
      (sum, product) =>
        sum +
        Number(product.averageRating || 0),
      0
    );

    return total / ratedProducts.length;
  }, [myProducts]);

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0a291f] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">

        <div>
          <div className="flex items-center gap-3">

            <span className="p-3 bg-[#c29b57]/20 text-[#c29b57] rounded-xl">
              <Store size={24} />
            </span>

            <h1 className="text-2xl font-extrabold dark:text-white">
              Seller Hub
            </h1>

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your products, inventory and store performance.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              setActiveTab("products")
            }
            className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
              activeTab === "products"
                ? "bg-[#c29b57] text-[#041c14]"
                : "bg-gray-100 dark:bg-[#041c14] text-gray-600 dark:text-gray-300"
            }`}
          >
            My Products
          </button>

          <button
            onClick={() =>
              setActiveTab("add")
            }
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 ${
              activeTab === "add"
                ? "bg-[#c29b57] text-[#041c14]"
                : "bg-gray-100 dark:bg-[#041c14] text-gray-600 dark:text-gray-300"
            }`}
          >
            <Plus size={16} />
            Add Product
          </button>

        </div>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">

        {/* PRODUCTS */}

        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">

          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
            <Package size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">
              Active Listings
            </p>

            <h3 className="text-xl font-extrabold dark:text-white mt-1">
              {totalProducts}
            </h3>
          </div>

        </div>

        {/* STOCK */}

        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">

                  <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
                    <ShoppingBag size={24} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Total Inventory
                    </p>

                    <h3 className="text-xl font-extrabold dark:text-white mt-1">
                      {totalStock}
                    </h3>
                  </div>

                </div>

                {/* RATING */}
                    <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">

          <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
            <DollarSign size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">
              Total Revenue
            </p>

            <h3 className="text-xl font-extrabold dark:text-white mt-1">
              Br {revenue.toLocaleString()}
            </h3>
          </div>

        </div>
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">

          <div className="p-4 bg-[#c29b57]/10 text-[#c29b57] rounded-xl">
            <TrendingUp size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">
              Store Rating
            </p>

            <h3 className="text-xl font-extrabold dark:text-white mt-1">
              {averageRating
                ? averageRating.toFixed(1)
                : "No ratings"}
            </h3>
          </div>

        </div>

      </div>

      {/* PRODUCTS TAB */}

      {activeTab === "products" && (

        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">

          <h2 className="font-bold text-lg dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
            Your Listings
          </h2>

          {loadingProducts ? (

            <div className="text-center py-12 text-gray-400">
              Loading your products...
            </div>

          ) : myProducts.length === 0 ? (

            <div className="text-center py-12 text-gray-400">

              <Package
                size={45}
                className="mx-auto mb-4 opacity-50"
              />

              <p>
                You haven't listed any products yet.
              </p>

              <button
                onClick={() =>
                  setActiveTab("add")
                }
                className="mt-4 text-[#c29b57] font-bold text-sm hover:underline"
              >
                Create your first product
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {myProducts.map((product) => {

                const productId =
                  product._id ||
                  product.id;

                const name =
                  product.title ||
                  product.name ||
                  "Untitled Product";

                const image =
                  product.image ||
                  product.imageUrl ||
                  "https://placehold.co/200x200?text=No+Image";

                return (

                  <div
                    key={productId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-[#041c14] rounded-2xl border border-gray-200 dark:border-gray-800"
                  >

                    <div className="flex items-center gap-4">

                      <img
                        src={image}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/200x200?text=No+Image";
                        }}
                        className="w-16 h-16 object-contain rounded-xl bg-gray-800 border border-gray-700"
                      />

                      <div>

                        <h3 className="font-bold text-sm dark:text-white">
                          {name}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          {product.category ||
                            "General"}
                        </p>

                        <p className="text-sm font-bold text-[#c29b57] mt-1">
                          Br{" "}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Stock:{" "}
                          {product.stock ?? 0}
                        </p>

                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          startEditing(product)
                        }
                        disabled={loading}
                        className="p-2 text-[#c29b57] hover:bg-[#c29b57]/10 rounded-xl"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteProduct(
                            productId
                          )
                        }
                        disabled={loading}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>
      )}

      {/* ADD PRODUCT */}

      {activeTab === "add" && (

        <form
          onSubmit={handleAddProduct}
          className="bg-white dark:bg-[#0a291f] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 max-w-2xl mx-auto"
        >

          <h2 className="font-bold text-lg dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
            Add New Product
          </h2>

          <div>

            <label className="text-xs font-bold text-gray-400 block mb-1">
              Product Name
            </label>

            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
              className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
              placeholder="e.g. Handmade Leather Bag"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-bold text-gray-400 block mb-1">
                Price (Br)
              </label>

              <input
                type="number"
                min="1"
                required
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
              />

            </div>

            <div>

              <label className="text-xs font-bold text-gray-400 block mb-1">
                Category
              </label>

              <div className="relative">

                <select
                  required
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value,
                    })
                  }
                  className="appearance-none dark:text-gray-300 w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 pr-10 text-sm"
                >
                  <option value="">
                    Select category
                  </option>
                  <option value="Fashion">
                    Fashion
                  </option>
                  <option value="Electronics">
                    Electronics
                  </option>
                  <option value="Home & Living">
                    Home & Living
                  </option>
                  <option value="Beauty">
                    Beauty
                  </option>
                  <option value="Food">
                    Food
                  </option>
                  <option value="Accessories">
                    Accessories
                  </option>
                  <option value="Sports">
                    Sports
                  </option>
                  <option value="Books">
                    Books
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-bold text-gray-400 block mb-1">
                Product Image
              </label>

              <div className="relative">

                <Upload
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      image:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                  className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 pl-10 text-sm"
                />

              </div>

            </div>

            <div>

              <label className="text-xs font-bold text-gray-400 block mb-1">
                Stock
              </label>

              <input
                type="number"
                min="0"
                required
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
                className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
              />

            </div>

          </div>

          <div>

            <label className="text-xs font-bold text-gray-400 block mb-1">
              Description
            </label>

            <textarea
              rows={4}
              required
              minLength={15}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description:
                    e.target.value,
                })
              }
              className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
              placeholder="Describe your product..."
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-3.5 rounded-xl font-bold disabled:opacity-50"
          >
            {loading
              ? "Publishing..."
              : "Publish Product"}
          </button>

        </form>
      )}

      {/* EDIT PRODUCT */}

      {activeTab === "edit" &&
        editingProduct && (

          <form
            onSubmit={handleEditProduct}
            className="bg-white dark:bg-[#0a291f] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 max-w-2xl mx-auto"
          >

            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">

              <h2 className="font-bold text-lg dark:text-white">
                Edit Product
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab("products");
                }}
                className="text-sm text-gray-400"
              >
                Cancel
              </button>

            </div>

            <div>

              <label className="text-xs font-bold text-gray-400 block mb-1">
                Product Name
              </label>

              <input
                type="text"
                required
                value={
                  editingProduct.name
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                min="1"
                required
                value={
                  editingProduct.price
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
              />

              <div className="relative">

                <select
                  required
                  value={
                    editingProduct.category
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category:
                        e.target.value,
                    })
                  }
                  className="appearance-none dark:text-gray-300 w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 pr-10 text-sm"
                >
                  <option value="">
                    Select category
                  </option>
                  <option value="Fashion">
                    Fashion
                  </option>
                  <option value="Electronics">
                    Electronics
                  </option>
                  <option value="Home & Living">
                    Home & Living
                  </option>
                  <option value="Beauty">
                    Beauty
                  </option>
                  <option value="Food">
                    Food
                  </option>
                  <option value="Accessories">
                    Accessories
                  </option>
                  <option value="Sports">
                    Sports
                  </option>
                  <option value="Books">
                    Books
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-bold text-gray-400 block mb-1">
                  Replace Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                  className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
                />

                {editingProduct.existingImage &&
                  !editingProduct.image && (
                    <img
                      src={
                        editingProduct.existingImage
                      }
                      alt="Current"
                      className="w-24 h-24 object-contain mt-3 rounded-xl bg-gray-800"
                    />
                  )}

              </div>

              <div>

                <label className="text-xs font-bold text-gray-400 block mb-1">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={
                    editingProduct.stock
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: e.target.value,
                    })
                  }
                  className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
                />

              </div>

            </div>

            <textarea
              rows={4}
              required
              minLength={15}
              value={
                editingProduct.description
              }
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description:
                    e.target.value,
                })
              }
              className="w-full dark:text-gray-300 bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm"
            />

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab("products");
                }}
                className="w-1/3 bg-gray-200 dark:bg-[#041c14] text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#c29b57] text-[#041c14] py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        )}
    </div>
  );
}