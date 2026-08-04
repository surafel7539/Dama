import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Store, Plus,Edit2Icon, Package, DollarSign, TrendingUp, Trash2, UploadIcon } from 'lucide-react';

import { apiRequest } from '../services/api';

export default function SellerDashboard({ products = [], setProducts = () => {} }) {
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
  name: '',
  price: '',
  category: '',
  image: null,
  description: '',
  stock:''
});
  const [loading, setLoading] = useState(false);

  // Handle adding a new product listing
 const handleEditProduct = (product) => {
    setNewProduct({
        name: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: null,
    });

    setEditingProduct(product);
    setActiveTab("add");
};
 const handleAddProduct = async (e) => {
  e.preventDefault();

  if (
    !newProduct.name ||
    !newProduct.price ||
    !newProduct.category ||
    !newProduct.image ||
    !newProduct.stock
  ) {
    toast.error("Please fill in all required fields");
    return;
  }

  setLoading(true);
  const toastId = toast.loading("Adding product...");

  try {
    const formData = new FormData();

    formData.append("title", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock);
    formData.append("image", newProduct.image);

    const createdProduct = await apiRequest("/products", {
      method: "POST",
      body: formData,
    });
    if (editingProduct) {

    await apiRequest(`/products/${editingProduct._id}`, {
        method: "PUT",
        body: formData,
    });

} else {

    await apiRequest("/products", {
        method: "POST",
        body: formData,
    });

}

    if (typeof setProducts === "function") {
      setProducts((prev) => [createdProduct, ...prev]);
    }

    toast.dismiss(toastId);
    toast.success("Product listed successfully!");

    setNewProduct({
      name: "",
      price: "",
      category: "",
      image: null,
      description: "",
      stock:""
    });

    setActiveTab("products");

  } catch (error) {
    toast.dismiss(toastId);
    toast.error(error.message || "Failed to publish product");
  } finally {
    setLoading(false);
  }
};

  // Handle product deletion
 // Handle product deletion
const handleDeleteProduct = async (id) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });

    if (typeof setProducts === "function") {
      setProducts((prev) =>
        prev.filter((p) => (p._id || p.id) !== id)
      );
    }

    toast.success("Product deleted successfully");

  } catch (error) {
    console.error("Delete product error:", error);
    toast.error(error.message || "Failed to delete product");
  }
};

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-8">
      
      {/* Dashboard Header & Stats Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0a291f] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-[#c29b57]/20 text-[#c29b57] rounded-xl">
              <Store size={24} />
            </span>
            <h1 className="text-2xl font-extrabold dark:text-white">Seller Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your active listings, earnings, and store performance.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'products' 
                ? 'bg-[#c29b57] text-[#041c14]' 
                : 'bg-gray-100 dark:bg-[#041c14] text-gray-600 dark:text-gray-300'
            }`}
          >
            My Products
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'add' 
                ? 'bg-[#c29b57] text-[#041c14]' 
                : 'bg-gray-100 dark:bg-[#041c14] text-gray-600 dark:text-gray-300'
            }`}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Active Listings</p>
            <h3 className="text-xl font-extrabold dark:text-white mt-1">{products.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Total Revenue</p>
            <h3 className="text-xl font-extrabold dark:text-white mt-1">Br 24,500</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-[#c29b57]/10 text-[#c29b57] rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Store Rating</p>
            <h3 className="text-xl font-extrabold dark:text-white mt-1">4.9 / 5.0</h3>
          </div>
        </div>
      </div>

      {/* Conditional Tabs: Product List vs Add Product Form */}
      {activeTab === 'products' ? (
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h2 className="font-bold text-lg dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">Your Listings</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>You haven't listed any products yet.</p>
              <button onClick={() => setActiveTab('add')} className="mt-4 text-[#c29b57] font-bold text-sm hover:underline">
                + Create your first product
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(p => {
               const pId = p._id || p.id;
                const pName = p.title || p.name || "Untitled Product";
                const pImage =
                  p.image ||
                  "https://placehold.co/200x200?text=No+Image";
                const pPrice = Number(p.price || 0).toLocaleString();

                return (
                  <div key={pId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#041c14] rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <img
                        src={pImage}
                        alt={pName}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200x200?text=No+Image";
                        }}
                        className="w-16 h-16 object-contain rounded-xl bg-gray-800 border border-gray-700"
                      />
                      <div>
                        <h3 className="font-bold text-sm dark:text-white">{pName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{p.category || 'General'}</p>
                        <p className="text-sm font-bold text-[#c29b57] mt-1">Br {pPrice}</p>
                      </div>
                    </div>
                    <div className='flex gap-4 justify-center align-center'>
                    <button
                        onClick={() => handleEditProduct(p)}
                        className="text-blue-500 hover:bg-blue-600/10 p-2 rounded-xl"
                    >
                        <Edit2Icon size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.Id || p._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete Listing"
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
      ) : (
        <form onSubmit={handleAddProduct} className="bg-white dark:bg-[#0a291f] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 max-w-2xl mx-auto">
          <h2 className="font-bold text-lg dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">Add New Product Listing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Product Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Handmade Leather Bag"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
              />
            </div>
          </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Price (Br)</label>
                <input 
                  type="text" 
                  required
                  min={1}
                  placeholder="e.g. 2,500"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Category</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fashion"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 ' >
              <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                Product Image
              </label>

              <div className="relative">
                <UploadIcon
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />

                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      image: e.target.files[0],
                    })
                  }
                  className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
                />
              </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                Stock Amount
              </label>
                <input 
                type="number"  
                placeholder='How much of this product will you sell'
                 onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                 className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                Description
              </label>

              <textarea
                rows={3}
                placeholder="Describe your product..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
              />
            </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-3.5 rounded-xl font-bold hover:bg-[#a88548] transition-colors disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </form>
      )}

    </div>
    
  );}
