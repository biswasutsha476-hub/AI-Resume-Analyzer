import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import {
  findInMemoryUserByEmail,
  findInMemoryUserById,
  createInMemoryUser
} from '../config/memoryStore.js';

// 1. POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is active
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({
            success: false,
            error: 'An account with this email address already exists. Please sign in.'
          });
        }

        const user = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password
        });

        const token = generateToken(user._id);
        return res.status(201).json({
          success: true,
          message: 'Account created successfully',
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
          }
        });
      } catch (dbErr) {
        console.warn('MongoDB register error, falling back to memory store:', dbErr.message);
      }
    }

    // In-memory fallback (when MongoDB is offline or unreachable)
    const memUserExists = findInMemoryUserByEmail(cleanEmail);
    if (memUserExists) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.'
      });
    }

    const memUser = await createInMemoryUser({
      name: name.trim(),
      email: cleanEmail,
      password
    });

    const token = generateToken(memUser._id);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully (Memory Store)',
      token,
      user: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        createdAt: memUser.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error registering user account'
    });
  }
};

// 2. POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is active
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password');
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              error: 'Invalid email or password'
            });
          }

          const token = generateToken(user._id);
          return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt
            }
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB login error, checking memory store:', dbErr.message);
      }
    }

    // In-memory fallback
    const memUser = findInMemoryUserByEmail(cleanEmail);
    if (!memUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await memUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const token = generateToken(memUser._id);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        createdAt: memUser.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error during login'
    });
  }
};

// 3. GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(req.user._id);
      } catch {
        user = findInMemoryUserById(req.user._id);
      }
    } else {
      user = findInMemoryUserById(req.user._id) || req.user;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching user profile'
    });
  }
};
