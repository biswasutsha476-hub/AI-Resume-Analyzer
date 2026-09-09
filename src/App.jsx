import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScoreCard } from './components/ScoreCard';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { BulletOptimizerModal } from './components/BulletOptimizerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { parseResumeFile } from './utils/resumeParser';
import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  AlertCircle,
  Trash2,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './App.css';

function MainApp() {
  const { user, token, loading: authLoading, isGuestMode } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('resumeup_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [showJobDescription, setShowJobDescription] = useState(false);

  // API State
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [apiConnected, setApiConnected] = useState(true);

  // History & Modals
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('resumeup_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('resumeup_theme', 'light');
    }
  }, [darkMode]);

  // Fetch health check on mount
  useEffect(() => {
    let ignore = false;
    fetch('/api/resumes/health')
      .then(res => res.json())
      .then(data => {
        if (!ignore && data.status === 'healthy') {
          setApiConnected(true);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('API health check warning:', err);
          setApiConnected(false);
        }
      });

    return () => { ignore = true; };
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/resumes', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHistory(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch history from MongoDB:', err);
    }
  }, [token]);

  // Fetch history when token changes or on mount
  useEffect(() => {
    let ignore = false;
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/resumes', { headers })
      .then(res => res.json())
      .then(data => {
        if (!ignore && data.success && Array.isArray(data.data)) {
          setHistory(data.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch history from MongoDB:', err);
      });

    return () => { ignore = true; };
  }, [token]);

  // Load sample resume
  const handleSelectSample = (sample) => {
    setResumeText(sample.text);
    setFileName(`${sample.id}.txt`);
    setError(null);
    if (sample.targetRole) {
      setJobDescription(`Required skills and qualifications for ${sample.targetRole}. Seeking candidates with demonstrated leadership, scalable architecture experience, and quantitative business impact.`);
      setShowJobDescription(true);
    }
  };

  // Trigger Resume Analysis REST API
  const handleAnalyze = async (customText = null, customFileName = null) => {
    const textToAnalyze = customText || resumeText;
    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      setError('Please paste your resume text or upload a PDF before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/resumes/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resumeText: textToAnalyze,
          jobDescription: jobDescription.trim(),
          fileName: customFileName || fileName || 'resume.txt'
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAnalysis(result.data);
        refreshHistory();
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        throw new Error(result.error || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Network error connecting to Express REST API');
    } finally {
      setLoading(false);
    }
  };

  // Handle Drag & Drop / File Upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAnalysis(result.data);
        setResumeText(result.data.rawText || '');
        refreshHistory();
      } else {
        // Fallback: parse client-side and submit to analyze endpoint
        const parsedText = await parseResumeFile(file);
        if (parsedText && parsedText.trim()) {
          setResumeText(parsedText);
          handleAnalyze(parsedText, file.name);
        } else {
          throw new Error(result.error || 'Failed to parse resume file');
        }
      }
    } catch (err) {
      console.error('File upload error:', err);
      try {
        const text = await parseResumeFile(file);
        if (text && text.trim()) {
          setResumeText(text);
          handleAnalyze(text, file.name);
        } else {
          setError('Could not extract text from file. Please paste your resume text directly.');
        }
      } catch {
        setError(err.message || 'File upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  // Open a past resume from History
  const handleSelectHistoryItem = async (id) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/resumes/${id}`, { headers });
      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
        setResumeText(data.data.rawText || '');
        setFileName(data.data.fileName || 'saved_resume.txt');
        if (data.data.jobDescription) {
          setJobDescription(data.data.jobDescription);
          setShowJobDescription(true);
        }
        setIsHistoryOpen(false);
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Error fetching resume by id:', err);
    }
  };

  // Delete resume from History
  const handleDeleteHistoryItem = async (id) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`/api/resumes/${id}`, { method: 'DELETE', headers });
      refreshHistory();
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setFileName('');
    setAnalysis(null);
    setError(null);
  };

  // Initial Auth Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 animate-pulse mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
          Loading RESUMEUP AI Platform...
        </div>
      </div>
    );
  }

  // Pre-App Gate: Show Login Page if user is not authenticated and not in guest mode
  if (!user && !isGuestMode) {
    return (
      <LoginPage
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        apiConnected={apiConnected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSelectSample={handleSelectSample}
        onOpenBulletModal={() => setIsBulletModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        apiConnected={apiConnected}
        historyCount={history.length}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* User Status Bar */}
        {user && (
          <div className={`mb-6 p-3 rounded-xl border flex items-center justify-between text-xs transition ${
            user.isGuest
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
              : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200'
          }`}>
            <div className="flex items-center space-x-2.5">
              <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[11px] ${
                user.isGuest ? 'bg-amber-600' : 'bg-indigo-600'
              }`}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>
                {user.isGuest ? (
                  <>Exploring as <strong>Guest Candidate</strong>. All AI ATS scoring features are fully active. Want to save your scans to MongoDB? Sign in anytime.</>
                ) : (
                  <>Logged in as <strong>{user.name}</strong> ({user.email}). All resume scans are saved to your personal account.</>
                )}
              </span>
            </div>
            <span className={`hidden sm:inline font-mono text-[11px] ${
              user.isGuest ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
            }`}>
              {user.isGuest ? 'Guest Session' : (user.isLocal ? 'Local Auth Mode' : 'JWT Authenticated')}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">✕</button>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Resume Document Input
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Upload a PDF / text file or paste your resume text below for instant AI analysis
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Parsing File...' : 'Upload PDF / Text'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowJobDescription(!showJobDescription)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition ${
                  showJobDescription
                    ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:bg-gray-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Target Job Match</span>
                {showJobDescription ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Job Description Box */}
          {showJobDescription && (
            <div className="mt-4 p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Target Job Description (Optional ATS Matching)
                </label>
                <span className="text-[11px] text-purple-600 dark:text-purple-400">
                  Calculates keyword coverage & missing requirements
                </span>
              </div>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting, key responsibilities, or required tech stack here..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />
            </div>
          )}

          {/* Resume Textarea */}
          <div className="mt-4 relative">
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here, or click 'Upload PDF / Text' above to load a document..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono resize-y"
            />

            {/* Live Stats Footer in Textarea */}
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 px-2 pt-2">
              <div className="flex items-center gap-4">
                <span>Words: {resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0}</span>
                <span>Characters: {resumeText.length}</span>
                {fileName && <span className="text-indigo-500 font-medium font-sans">File: {fileName}</span>}
              </div>

              {resumeText && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-gray-400 hover:text-rose-500 transition flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Text
                </button>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                Auto-Save Cloud Storage
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Real-Time ATS Scoring
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={loading || !resumeText.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running AI Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div id="results-section" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ScoreCard Header */}
            <ScoreCard analysis={analysis} />

            {/* Analysis Dashboard Tabs */}
            <AnalysisDashboard
              analysis={analysis}
              onOpenBulletModal={() => setIsBulletModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Bullet Optimizer Popup Modal */}
      <BulletOptimizerModal
        isOpen={isBulletModalOpen}
        onClose={() => setIsBulletModalOpen(false)}
      />

      {/* Saved Scans History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResume={handleSelectHistoryItem}
        onDeleteResume={handleDeleteHistoryItem}
      />

      {/* Secondary Authentication Modal (Login / Sign Up) */}
      <AuthModal />

      {/* App Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-gray-900 dark:text-white">RESUMEUP</span>
            <span>• Next-Gen AI Career Platform</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Secure Cloud Storage</span>
            <span>Candidate Authentication</span>
            <span>Instant ATS Reports</span>
            <span>Privacy Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
