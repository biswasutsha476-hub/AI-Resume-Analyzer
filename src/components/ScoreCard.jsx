import React from 'react';
import { Award, CheckCircle2, Mail, Phone, Globe, Link2, TrendingUp } from 'lucide-react';

export const ScoreCard = ({ analysis }) => {
  if (!analysis || !analysis.scores) return null;

  const { scores, stats, candidateName, candidateEmail, candidatePhone, linkedinUrl, githubUrl } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500';
    if (score >= 65) return 'text-indigo-600 dark:text-indigo-400 border-indigo-500';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 border-amber-500';
    return 'text-rose-600 dark:text-rose-400 border-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-indigo-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent ATS Ready';
    if (score >= 70) return 'Good - Minor Tweaks';
    if (score >= 55) return 'Fair - Needs Improvement';
    return 'Needs Major Work';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
      {/* Top Header with Candidate Name and Overall Score */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Automated Resume Evaluation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {candidateName || 'Candidate Resume'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Analyzed with RESUMEUP AI Engine • {stats?.wordCount || 0} words • {stats?.totalBullets || 0} bullet points
          </p>

          {/* Contact Verification Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
              candidateEmail
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}>
              <Mail className="w-3.5 h-3.5" />
              {candidateEmail ? 'Email Detected' : 'Missing Email'}
            </span>

            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
              candidatePhone
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}>
              <Phone className="w-3.5 h-3.5" />
              {candidatePhone ? 'Phone Detected' : 'Missing Phone'}
            </span>

            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
              linkedinUrl
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
            }`}>
              <Link2 className="w-3.5 h-3.5" />
              {linkedinUrl ? 'LinkedIn Linked' : 'No LinkedIn'}
            </span>

            {githubUrl && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Globe className="w-3.5 h-3.5" />
                GitHub
              </span>
            )}
          </div>
        </div>

        {/* Big Dual Scores */}
        <div className="flex items-center gap-6">
          {/* Overall Score Circle */}
          <div className="text-center">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/80 shadow-inner ${getScoreColor(scores.overall)}`}>
              <span className="text-3xl sm:text-4xl font-black">{scores.overall}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">
              Overall Score
            </p>
            <p className={`text-[11px] font-medium ${scores.overall >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {getScoreLabel(scores.overall)}
            </p>
          </div>

          {/* ATS Compatibility Score Circle */}
          <div className="text-center">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/80 shadow-inner ${getScoreColor(scores.atsScore)}`}>
              <span className="text-3xl sm:text-4xl font-black">{scores.atsScore}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">
              ATS Score
            </p>
            <p className={`text-[11px] font-medium ${scores.atsScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              Parse Rate
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Score Breakdown Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {/* Impact & Metrics */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              Impact & Measurable Metrics
            </span>
            <span className="font-bold text-gray-900 dark:text-white">{scores.impactScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBg(scores.impactScore)} transition-all duration-700`}
              style={{ width: `${scores.impactScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            {stats?.metricBullets || 0} of {stats?.totalBullets || 0} bullets ({stats?.metricPercentage || 0}%) contain numbers
          </p>
        </div>

        {/* Action Verbs */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-500" />
              Action Verbs & Vocabulary
            </span>
            <span className="font-bold text-gray-900 dark:text-white">{scores.actionVerbScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBg(scores.actionVerbScore)} transition-all duration-700`}
              style={{ width: `${scores.actionVerbScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            {analysis?.strongVerbsFound?.length || 0} power verbs • {analysis?.weakWordsFound?.length || 0} weak phrases
          </p>
        </div>

        {/* Skills Density */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Skill Keywords Density
            </span>
            <span className="font-bold text-gray-900 dark:text-white">{scores.skillsScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBg(scores.skillsScore)} transition-all duration-700`}
              style={{ width: `${scores.skillsScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            {analysis?.skills?.totalFound || 0} skills recognized across categories
          </p>
        </div>

        {/* Brevity & Word Count */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700 dark:text-gray-200">Length & Formatting</span>
            <span className="font-bold text-gray-900 dark:text-white">{scores.brevityScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBg(scores.brevityScore)} transition-all duration-700`}
              style={{ width: `${scores.brevityScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            {stats?.wordCount || 0} total words (target: 400-800 words)
          </p>
        </div>

        {/* Readability Score */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700 dark:text-gray-200">Readability Index</span>
            <span className="font-bold text-gray-900 dark:text-white">{scores.readabilityScore || 80}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBg(scores.readabilityScore || 80)} transition-all duration-700`}
              style={{ width: `${scores.readabilityScore || 80}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            Flesch reading ease score for recruiter scanning
          </p>
        </div>

        {/* Job Match Score (if present) */}
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-indigo-900 dark:text-indigo-200 font-semibold">Job Match Compatibility</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400">
              {analysis.jobMatch?.matchScore !== null ? `${analysis.jobMatch.matchScore}%` : 'N/A'}
            </span>
          </div>
          <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-700"
              style={{ width: `${analysis.jobMatch?.matchScore || 0}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1.5">
            {analysis.jobMatch?.matchScore !== null
              ? `${analysis.jobMatch.matchedKeywords?.length || 0} matched of ${analysis.jobMatch.totalTargetKeywords || 0} target keywords`
              : 'Paste a Job Description to see match percentage'}
          </p>
        </div>
      </div>
    </div>
  );
};
