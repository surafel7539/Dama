import { protect } from '../middleware/auth.js';
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "fullName email")
      .populate("ratings.user", "fullName");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteProductRating = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const ratingIndex = product.ratings.findIndex(
      (rating) =>
        rating.user.toString() === req.user.id.toString()
    );

    if (ratingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "You have not rated this product",
      });
    }

    product.ratings.splice(ratingIndex, 1);

    const totalRating = product.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    product.numReviews = product.ratings.length;

    product.averageRating =
      product.numReviews > 0
        ? totalRating / product.numReviews
        : 0;

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("seller", "fullName email")
      .populate("ratings.user", "fullName");

    res.status(200).json({
      success: true,
      message: "Rating deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Delete rating error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete rating",
      error: error.message,
    });
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
      .populate("seller", "fullName email")
      .populate("ratings.user", "fullName");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
    const { rating, comment } = req.body;

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5 ||
      numericRating * 2 !== Math.round(numericRating * 2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 in 0.5 increments.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const existingRating = product.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (existingRating) {
      existingRating.rating = numericRating;
      existingRating.comment = comment?.trim() || "";
    } else {
      product.ratings.push({
        user: req.user.id,
        rating: numericRating,
        comment: comment?.trim() || "",
      });
    }

    const totalRating = product.ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    product.numReviews = product.ratings.length;

    product.averageRating =
      product.numReviews > 0
        ? totalRating / product.numReviews
        : 0;

    await product.save();

    await product.populate([
      {
        path: "ratings.user",
        select: "fullName name username",
      },
      {
        path: "seller",
        select: "fullName email",
      },
    ]);

    res.status(200).json({
      success: true,
      message: existingRating
        ? "Review updated successfully."
        : "Review added successfully.",
      product,
    });
  } catch (error) {
    console.error("Add Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add review.",
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

    const existingRating = product.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    res.json({
      hasRated: !!existingRating,
      rating: existingRating ? existingRating.rating : null,
    });

  } catch (error) {
    console.error("Check rating error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user._id || req.user.id 
        }).populate("seller", "fullName email");
        
        console.log(req.user);
        
        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 🔒 Make sure the logged-in seller owns this product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this product",
      });
    }

    // Update text fields
    product.title = req.body.title ?? product.title;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;

    // Update image only if a new one was uploaded
    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
