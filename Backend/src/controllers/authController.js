import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js'

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Cookie configuration options
const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks (JS cannot read the cookie)
  secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if(password.length < 8){
      return res.status(400).json({message:"Password must be longer than 7 letters"})
    }
    // Role Whitelisting (prevents unauthorized admin role injection)
    
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      
    });

    const token = generateToken(user._id);

    // Set HTTP-Only Cookie
    res.cookie('jwt', token, cookieOptions);

    res.status(201).json({
      token, // Sending in body as well for flexible frontend usage
      user: { id: user._id, fullName: user.fullName, email: user.email,  }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
     if(password.length < 8){
      return res.status(400).json({message:"Password must be longer than 7 letters"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Set HTTP-Only Cookie
    res.cookie('jwt', token, cookieOptions);

    res.json({
      token, // Sending in body as well for flexible frontend usage
      user: { id: user._id, fullName: user.fullName, email: user.email}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  // Clear the cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  return res.status(200).json({ message: 'User logged out successfully' });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Profile Details (Full Name)
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) {
      user.fullName = fullName;
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ==============================
// DELETE ACCOUNT
// ==============================

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Make sure the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete all products/listings belonging to this user
    const deletedProducts = await Product.deleteMany({
      seller: userId,
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Clear authentication cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Account and all listings deleted successfully",
      deletedListings: deletedProducts.deletedCount,
    });

  } catch (error) {
    console.error("Delete account error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    // 1. Fetch user including password field
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     if(newPassword.length < 8){
      return res.status(400).json({message:"Password must be longer than 7 letters"})
    }
    // 2. Verify current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }
    
    // 3. Hash and set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};