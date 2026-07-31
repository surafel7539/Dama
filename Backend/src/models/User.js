import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);