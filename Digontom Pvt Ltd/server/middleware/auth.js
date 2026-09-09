import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { findInMemoryUserById } from '../config/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'resumind_ai_super_secret_jwt_key_2025';

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Protect middleware - requires valid JWT
export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (mongoose.connection.readyState === 1) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch {
          req.user = findInMemoryUserById(decoded.id);
        }
      } else {
        req.user = findInMemoryUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User account not found'
        });
      }

      return next();
    } catch (error) {
      console.warn('Auth token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

// Optional auth middleware - attaches user if token exists, otherwise proceeds as guest
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (mongoose.connection.readyState === 1) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch {
          req.user = findInMemoryUserById(decoded.id);
        }
      } else {
        req.user = findInMemoryUserById(decoded.id);
      }
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};
