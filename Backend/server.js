import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { securityCheck } from './src/middleware/arcjet.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

dotenv.config();
import connectDB from './src/config/db.js';

// Connect Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true // Allows sending cookies & authorization headers
}));
app.use(express.json());

// Security Middleware (Arcjet)


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dama Marketplace API is live and secure!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});