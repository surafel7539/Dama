import express from 'express';
import { createOrder, getBuyerOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getBuyerOrders);

export default router;