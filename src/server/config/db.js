import mongoose from "mongoose";
import "../models/User.js";
import "../models/Product.js";
import "../models/Order.js";

const cache = globalThis;

if (!cache._mongoose) {
  cache._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cache._mongoose.conn) return cache._mongoose.conn;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not set");
  }

  if (!cache._mongoose.promise) {
    cache._mongoose.promise = mongoose.connect(process.env.MONGO_URL);
  }

  cache._mongoose.conn = await cache._mongoose.promise;
  return cache._mongoose.conn;
};

export default connectDB;
