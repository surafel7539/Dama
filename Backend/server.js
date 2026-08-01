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
// Replace the allowedOrigins array and app.use(cors(...)) with this:

const allowedOrigins = [
  'http://localhost:5173',
  'https://dama-ach4-alpha.vercel.app' 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this line directly underneath to force preflight checks to pass
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

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