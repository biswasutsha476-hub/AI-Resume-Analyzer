import express from 'express';
import multer from 'multer';
import {
  analyzeResumeText,
  uploadResumeFile,
  getAllResumes,
  getResumeById,
  deleteResume,
  improveBullet,
  getHealth
} from '../controllers/resumeController.js';

import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Setup Multer for in-memory handling of PDF and text files (up to 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'application/octet-stream'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(file.mimetype) || ['pdf', 'txt', 'md'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are supported'));
    }
  }
});

// REST API Endpoints
router.get('/health', getHealth);
router.post('/analyze', optionalAuth, analyzeResumeText);
router.post('/upload', optionalAuth, upload.single('resume'), uploadResumeFile);
router.get('/', optionalAuth, getAllResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);
router.post('/improve-bullet', improveBullet);

export default router;
