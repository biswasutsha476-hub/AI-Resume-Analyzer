import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['critical', 'warning', 'strength', 'info'],
    default: 'info'
  },
  category: { type: String, default: 'General' },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  fileName: {
    type: String,
    default: 'resume.txt'
  },
  candidateName: {
    type: String,
    default: 'Candidate'
  },
  candidateEmail: {
    type: String,
    default: ''
  },
  candidatePhone: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  scores: {
    overall: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    impactScore: { type: Number, required: true },
    actionVerbScore: { type: Number, required: true },
    skillsScore: { type: Number, required: true },
    brevityScore: { type: Number, required: true },
    readabilityScore: { type: Number, default: 80 }
  },
  stats: {
    wordCount: { type: Number, default: 0 },
    lineCount: { type: Number, default: 0 },
    totalBullets: { type: Number, default: 0 },
    metricBullets: { type: Number, default: 0 },
    metricPercentage: { type: Number, default: 0 }
  },
  detectedSections: [{ type: String }],
  missingSections: [{ type: String }],
  skills: {
    categorized: {
      type: Map,
      of: [String],
      default: {}
    },
    all: [{ type: String }],
    totalFound: { type: Number, default: 0 }
  },
  strongVerbsFound: [{ type: String }],
  weakWordsFound: [{
    word: String,
    suggestion: String
  }],
  suggestions: [SuggestionSchema],
  jobMatch: {
    matchScore: { type: Number, default: null },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    totalTargetKeywords: { type: Number, default: 0 }
  },
  rawText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  bufferCommands: false
});

// Index for fast search and listing
ResumeAnalysisSchema.index({ createdAt: -1 });
ResumeAnalysisSchema.index({ candidateName: 'text', fileName: 'text' });

export default mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
