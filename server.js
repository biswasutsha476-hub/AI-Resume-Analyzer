import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RESUMEUP AI Resume Analyzer API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/resumes/health',
      authRegister: 'POST /api/auth/register',
      authLogin: 'POST /api/auth/login',
      authMe: 'GET /api/auth/me',
      analyze: 'POST /api/resumes/analyze',
      upload: 'POST /api/resumes/upload',
      getAll: 'GET /api/resumes',
      getById: 'GET /api/resumes/:id',
      delete: 'DELETE /api/resumes/:id',
      improveBullet: 'POST /api/resumes/improve-bullet'
    }
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`RESUMEUP Server running on http://localhost:${PORT}`);
  });

  connectDB().catch(err => {
    console.warn('MongoDB initial connection attempt error:', err.message);
  });
};

startServer();
