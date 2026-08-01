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
const allowedOrigins = [
  'http://localhost:5173',                  // Local Vite development
  'https://dama-ach4-alpha.vercel.app'      // 🚨 CRITICAL FIX: Removed trailing slash
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allows sending cookies & authorization headers
}));

app.use(express.json());

// Security Middleware (Arcjet)
// app.use(securityCheck); // Keep commented out temporarily until CORS is verified working

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dama Marketplace API is live and secure!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});