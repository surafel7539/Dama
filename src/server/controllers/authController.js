import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';

// ==============================
// JWT
// ==============================

const generateToken = (id, role, isPremium) => {
  return jwt.sign(
    {
      id,
      role,
      isPremium,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// ==============================
// COOKIE
// ==============================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ==============================
// REGISTER
// ==============================

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Please provide full name, email and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check password
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // New users are NOT premium by default
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isPremium: false,
    });

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role,
      user.isPremium
    );

    // Set HTTP-only cookie
    res.cookie(
      'jwt',
      token,
      cookieOptions
    );

    res.status(201).json({
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// LOGIN
// ==============================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: 'User Doesnt Exist',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    // Generate JWT with premium status
    const token = generateToken(
      user._id,
      user.role,
      user.isPremium
    );

    // Set HTTP-only cookie
    res.cookie(
      'jwt',
      token,
      cookieOptions
    );

    res.json({
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// LOGOUT
// ==============================

export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.status(200).json({
    message: 'User logged out successfully',
  });
};

// ==============================
// GET PROFILE
// ==============================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// UPDATE PROFILE
// ==============================

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (fullName) {
      user.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',

      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        isPremium: updatedUser.isPremium,
      },
    });

  } catch (error) {
    console.error('Update profile error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// DELETE ACCOUNT
// ==============================

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Delete all listings created by this seller
    const deletedProducts =
      await Product.deleteMany({
        seller: userId,
      });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear authentication cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({
      message:
        'Account and all listings deleted successfully',

      deletedListings:
        deletedProducts.deletedCount,
    });

  } catch (error) {
    console.error(
      'Delete account error:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// CHANGE PASSWORD
// ==============================

export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          'Please provide both current and new password',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters',
      });
    }

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          'Incorrect current password',
      });
    }

    // Hash new password
    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    await user.save();

    res.json({
      message:
        'Password updated successfully',
    });

  } catch (error) {
    console.error(
      'Change password error:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};