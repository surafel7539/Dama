import express from 'express';
import { getProducts, getProductById, updateProduct, deleteProductRating, deleteProduct,addProductRating, hasRatedProduct,createProduct, getMyProducts } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import Product from '../models/Product.js'
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/', getProducts);
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.json(
      categories.map((category) => ({
        name: category,
      }))
    );
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
router.get(
     "/my-products",
     
    protect,
    getMyProducts
);

router.get('/:id', getProductById);

router.post("/", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:");
      console.dir(err, { depth: null });

      return res.status(500).json({
        message: err.message,
        error: err,
      });
    }

    next();
  });
}, createProduct);
router.delete(
  "/:id/rating",
  protect,
  deleteProductRating
);
router.put(
  "/:id",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("UPLOAD ERROR:");
        console.dir(err, { depth: null });

        return res.status(500).json({
          message: err.message,
          error: err,
        });
      }

      next();
    });
  },
  updateProduct
);
router.delete('/:id',protect, deleteProduct)
router.get(
  "/:id/has-rated",
  protect,
  hasRatedProduct
);
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.json(
      categories.map((category) => ({
        name: category,
      }))
    );
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.post(
  "/:id/rating",
  protect,
  addProductRating
);


export default router;