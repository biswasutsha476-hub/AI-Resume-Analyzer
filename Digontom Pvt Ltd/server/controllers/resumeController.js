import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { runAIAnalysis, improveBulletPoint } from '../services/aiEngine.js';
import { getDBStatus } from '../config/db.js';
import pdf from 'pdf-parse';

// In-memory fallback if MongoDB connection is pending or in offline test mode
const inMemoryCache = new Map();

// Helper to save or cache
const saveAnalysis = async (analysisData) => {
  try {
    const doc = new ResumeAnalysis(analysisData);
    await doc.save();
    return { doc, savedToDB: true };
  } catch (err) {
    console.warn('MongoDB save failed, using memory fallback:', err.message);
    const mockId = 'mem_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const cached = { ...analysisData, _id: mockId, createdAt: new Date(), updatedAt: new Date() };
    inMemoryCache.set(mockId, cached);
    return { doc: cached, savedToDB: false };
  }
};

// 1. POST /api/resumes/analyze
export const analyzeResumeText = async (req, res) => {
  try {
    const { resumeText, jobDescription, fileName } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required for analysis'
      });
    }

    const analysisResult = runAIAnalysis(
      resumeText,
      jobDescription || '',
      fileName || 'resume.txt'
    );

    if (req.user && req.user._id) {
      analysisResult.userId = req.user._id;
    }

    const { doc, savedToDB } = await saveAnalysis(analysisResult);

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      savedToDB,
      data: doc
    });
  } catch (error) {
    console.error('Error in analyzeResumeText:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during resume analysis'
    });
  }
};

// 2. POST /api/resumes/upload
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a PDF or TXT resume.'
      });
    }

    const originalName = req.file.originalname;
    const extension = originalName.split('.').pop().toLowerCase();
    const jobDescription = req.body.jobDescription || '';

    let extractedText = '';

    if (extension === 'pdf') {
      try {
        const data = await pdf(req.file.buffer);
        extractedText = data.text;
      } catch (pdfErr) {
        console.error('PDF parsing error:', pdfErr);
        return res.status(422).json({
          success: false,
          error: 'Could not extract text from the uploaded PDF. Please make sure it is not password-protected or image-only scanned.'
        });
      }
    } else {
      extractedText = req.file.buffer.toString('utf-8');
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Extracted text was too short or empty. Please ensure the file contains selectable resume text.'
      });
    }

    const analysisResult = runAIAnalysis(extractedText, jobDescription, originalName);
    if (req.user && req.user._id) {
      analysisResult.userId = req.user._id;
    }

    const { doc, savedToDB } = await saveAnalysis(analysisResult);

    return res.status(200).json({
      success: true,
      message: `File "${originalName}" parsed and analyzed successfully`,
      savedToDB,
      data: doc
    });
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing uploaded file'
    });
  }
};

// 3. GET /api/resumes
export const getAllResumes = async (req, res) => {
  try {
    let results = [];
    const query = req.user && req.user._id ? { userId: req.user._id } : {};

    try {
      results = await ResumeAnalysis.find(query)
        .select('fileName candidateName candidateEmail scores stats createdAt jobMatch.matchScore')
        .sort({ createdAt: -1 })
        .limit(50);
    } catch (dbErr) {
      console.warn('DB query failed, checking memory cache:', dbErr.message);
      results = Array.from(inMemoryCache.values()).reverse();
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching resume history'
    });
  }
};

// 4. GET /api/resumes/:id
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    let resume = null;
    try {
      resume = await ResumeAnalysis.findById(id);
    } catch {
      // Could be mock ID or invalid format
    }

    if (!resume && inMemoryCache.has(id)) {
      resume = inMemoryCache.get(id);
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume analysis not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching resume analysis'
    });
  }
};

// 5. DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await ResumeAnalysis.findByIdAndDelete(id);
    } catch {
      // Ignored
    }

    if (inMemoryCache.has(id)) {
      inMemoryCache.delete(id);
    }

    return res.status(200).json({
      success: true,
      message: 'Resume analysis deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error deleting resume'
    });
  }
};

// 6. POST /api/resumes/improve-bullet
export const improveBullet = async (req, res) => {
  try {
    const { bullet, targetRole } = req.body;

    if (!bullet || bullet.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bullet point text is required'
      });
    }

    const suggestions = improveBulletPoint(bullet, targetRole || 'Software Engineer');

    return res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating bullet recommendations'
    });
  }
};

// 7. GET /api/health
export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    aiEngine: 'Local Heuristic & NLP Engine'
  });
};
