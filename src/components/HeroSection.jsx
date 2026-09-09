import React from 'react';
import { ShieldCheck, Cpu, Target, Award, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>100% Private Client-Side AI Resume Evaluation</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Supercharge Your Job Search with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Smart AI Analysis
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Upload your resume to get instant ATS compatibility scores, power verb analysis, metric audit, skill extraction, and tailored job description matching.
        </p>

        {/* Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero API Keys Required</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Instant Client-Side Heuristics</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Target className="w-4 h-4 text-purple-500" />
            <span>ATS Compliance Check</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Actionable Bullet Rewrites</span>
          </div>
        </div>

      </div>
    </div>
  );
};
