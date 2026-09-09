import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Sun,
  Moon,
  ShieldCheck,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const LoginPage = ({ darkMode, setDarkMode, apiConnected = true }) => {
  const { login, register, guestLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isLogin = mode === 'login';

  // Calculate simple password strength for register mode
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: 'bg-gray-200' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { level: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { level: 3, text: 'Good', color: 'bg-indigo-500' };
    return { level: 4, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please provide your email and password');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
        setSuccessMsg('Account created successfully! Loading your workspace...');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role = 'candidate') => {
    setError('');
    setLoading(true);
    const demoEmail = role === 'candidate' ? 'demo.candidate@resumeup.ai' : 'demo.recruiter@resumeup.ai';
    const demoPass = 'demoSecurePass123';
    const demoName = role === 'candidate' ? 'Sarah Connor' : 'Alex Mercer';

    try {
      try {
        await login(demoEmail, demoPass);
      } catch {
        // If account doesn't exist, create it
        await register(demoName, demoEmail, demoPass);
      }
    } catch (err) {
      setError(err.message || 'Could not launch demo. You can also click "Continue as Guest".');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors flex flex-col justify-between relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-500/15 dark:bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Floating Navbar */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                RESUMEUP
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                AI ATS Platform
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Next-Gen Resume & Job Match Intelligence
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* API Status Indicator */}
          <div className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
            apiConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{apiConnected ? 'API Connected' : 'Local Mode'}</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition shadow-sm backdrop-blur-xs"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Centered Content Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Hero Showcase & Value Props */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Built for High-Growth Job Seekers & Tech Talent</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                Crack the ATS Filter. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Get Hired Faster.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                Scan your resume against real recruiter algorithms. Uncover missing tech stack keywords, score formatting readability, and transform weak bullets into quantified XYZ achievements.
              </p>
            </div>

            {/* Feature Highlights with Icons */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 backdrop-blur-xs transition hover:border-indigo-300 dark:hover:border-indigo-700">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Deep ATS Keyword & Skill Match
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Align your experience directly with specific job postings to pass automated applicant screeners.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 backdrop-blur-xs transition hover:border-purple-300 dark:hover:border-purple-700">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Google XYZ Bullet Point Optimizer
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Turn vague statements like &ldquo;worked on backend&rdquo; into quantified, executive-level impacts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 backdrop-blur-xs transition hover:border-pink-300 dark:hover:border-pink-700">
                <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Candidate Profile & History Tracking
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Save versions, compare ATS scores across revisions, and track career milestones securely.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof / Stats Strip */}
            <div className="pt-2 flex items-center gap-6 sm:gap-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">94%</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Average ATS Score Boost</div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">2.8x</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">More Recruiter Responses</div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Privacy Guaranteed</div>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 relative">

              {/* Card Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {isLogin ? 'Sign In to Workspace' : 'Create Candidate Account'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isLogin
                    ? 'Enter your credentials to access your dashboard and saved scans'
                    : 'Start testing your resume against industry ATS algorithms for free'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                    isLogin
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                    !isLogin
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* One-Click Quick Demo Action */}
              <div className="mb-5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('candidate')}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Demo Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('recruiter')}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    <span>Demo Recruiter</span>
                  </button>
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white dark:bg-gray-900 px-3 text-gray-400 font-semibold tracking-wider">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Feedback Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">✕</button>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Sign Up only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('demo.candidate@resumeup.ai');
                          setPassword('demoSecurePass123');
                          setError('Demo credentials autofilled. Click "Sign In" to proceed.');
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Autofill test login
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter for registration */}
                  {!isLogin && password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                        <span>Password strength:</span>
                        <span className="font-semibold">{strength.text}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${(strength.level / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 w-4 h-4"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Workspace' : 'Create Account & Start Scanning'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Instant Guest Workspace Option */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
                <button
                  type="button"
                  onClick={guestLogin}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition inline-flex items-center gap-1.5 group"
                >
                  <span>Want to test first without logging in?</span>
                  <span className="text-indigo-600 dark:text-indigo-400 underline font-bold group-hover:translate-x-0.5 transition-transform">
                    Explore as Guest →
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/60 dark:border-gray-800/80 bg-white/40 dark:bg-gray-950/40 backdrop-blur-xs py-5 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-gray-900 dark:text-white">RESUMEUP</span>
            <span>• Next-Gen AI Career Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>256-bit Encryption</span>
            <span>•</span>
            <span>Real-time ATS Evaluation</span>
            <span>•</span>
            <span>No Credit Card Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
