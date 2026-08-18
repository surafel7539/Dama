import express from "express";
import {
  createOrder,
  getBuyerOrders,
  getBuyerOrderById,
  getSellerOrders
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getBuyerOrders);
router.get(
  "/seller-orders",
  protect,
  getSellerOrders
);
router.get("/:id", protect, getBuyerOrderById);


export default router;