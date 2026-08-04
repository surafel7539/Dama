import express from 'express';
import { getProducts, getProductById, deleteProduct,addProductRating, hasRatedProduct,createProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/', getProducts);

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
router.delete('/:id', deleteProduct)
router.get(
  "/:id/has-rated",
  protect,
  hasRatedProduct
);

router.post(
  "/:id/rating",
  protect,
  addProductRating
);

export default router;