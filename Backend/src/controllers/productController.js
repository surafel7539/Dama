import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'fullName email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    
    
    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image: req.file.path,
      seller: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};
export const addProductRating = async (req, res) => {
  try {
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Find existing rating from this user
    const existingRating = product.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      product.ratings.push({
        user: req.user.id,
        rating,
      });
    }

    // Update review count
    product.numReviews = product.ratings.length;

    // Calculate average rating
    const totalRating = product.ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    product.averageRating = totalRating / product.numReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: existingRating
        ? "Rating updated successfully."
        : "Rating added successfully.",
      product,
    });

  } catch (error) {
    console.error("Add Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add rating.",
      error: error.message,
    });
  }
};

export const hasRatedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const hasRated = product.ratings.some(
      (r) => r.user.toString() === req.user.id
    );

    res.json({
      hasRated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};