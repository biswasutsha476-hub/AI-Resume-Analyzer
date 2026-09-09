import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Layers,
  Sparkles,
  Target,
  FileCheck,
  Copy,
  Download,
  Flame,
  Check,
  Zap
} from 'lucide-react';

export const AnalysisDashboard = ({ analysis, onOpenBulletModal }) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const {
    suggestions = [],
    skills = {},
    detectedSections = [],
    missingSections = [],
    strongVerbsFound = [],
    weakWordsFound = [],
    jobMatch = {},
    scores = {}
  } = analysis;

  const copySummary = () => {
    const summaryText = `RESUMEUP AI Resume Analysis Report:
Candidate: ${analysis.candidateName || 'N/A'}
Overall Score: ${scores.overall}/100
ATS Score: ${scores.atsScore}/100
Impact Score: ${scores.impactScore}/100
Total Skills Detected: ${skills.totalFound || 0}
Job Match: ${jobMatch?.matchScore !== null ? `${jobMatch.matchScore}%` : 'Not specified'}

Critical Recommendations:
${suggestions.filter(s => s.type === 'critical').map(s => `- ${s.title}: ${s.description}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-8">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 bg-gray-50/70 dark:bg-gray-850">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-3">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'suggestions'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Suggestions
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {suggestions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Skills ({skills.totalFound || 0})
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'ats'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            ATS Sections
          </button>

          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'verbs'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            Verbs & Buzzwords
          </button>

          {jobMatch?.matchScore !== null && (
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'match'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              Job Match ({jobMatch.matchScore}%)
            </button>
          )}
        </div>

        {/* Quick Action Export Buttons */}
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={copySummary}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            title="Copy analysis summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={downloadJson}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            title="Download full analysis report as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: AI Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Actionable AI Recommendations
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Prioritized feedback to help your resume bypass ATS and win interviews
                </p>
              </div>
              <button
                onClick={onOpenBulletModal}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                Rewrite Bullets Now
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {suggestions.map((item, idx) => {
                const isCritical = item.type === 'critical';
                const isWarning = item.type === 'warning';
                const isStrength = item.type === 'strength';

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border transition ${
                      isCritical
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                        : isWarning
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                        : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCritical && <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                        {isWarning && <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                        {isStrength && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                              : isWarning
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {item.category || item.type}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Skills Taxonomy */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Categorized Technical & Domain Skills
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Skills extracted by the AI Engine mapped against ATS taxonomy
              </p>
            </div>

            {skills.categorized && Object.keys(skills.categorized).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(skills.categorized).map(([category, items]) => (
                  <div
                    key={category}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        {category}
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                        {items.length} items
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recognizable tech skills found in the text. Add skills like React, Node.js, Python, SQL, AWS, etc.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATS Sections */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                ATS Section Header Compliance
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Applicant Tracking Systems parse resumes faster when standard headings are present
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Detected Sections */}
              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Detected Headers ({detectedSections.length})
                </h4>
                <div className="space-y-2">
                  {detectedSections.map((sec, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
                      <span className="font-semibold">{sec}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Found</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Sections */}
              <div className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Missing Recommended Headers ({missingSections.length})
                </h4>
                {missingSections.length > 0 ? (
                  <div className="space-y-2">
                    {missingSections.map((sec, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-900">
                        <span className="font-semibold">{sec}</span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">Recommended</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 py-4 font-medium">
                    All standard ATS section headers were detected in your resume!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Verbs & Buzzwords */}
        {activeTab === 'verbs' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Power Verbs vs. Passive Buzzwords Audit
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enhance your resume’s tone by replacing weak cliches with authoritative action verbs
              </p>
            </div>

            {/* Weak Words Detected */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
                Weak or Cliche Phrases Found ({weakWordsFound.length})
              </h4>
              {weakWordsFound.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {weakWordsFound.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40"
                    >
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                        "{item.word}"
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {item.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                  Great job! No weak buzzwords or cliches detected.
                </div>
              )}
            </div>

            {/* Strong Verbs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3">
                Strong Action Verbs Present ({strongVerbsFound.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {strongVerbsFound.map((verb, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Job Match Analysis */}
        {activeTab === 'match' && jobMatch && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Target Job Description Alignment
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keyword coverage comparing your resume with the target job posting
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {jobMatch.matchScore}%
                </span>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Match Score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Matched Keywords ({jobMatch.matchedKeywords?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {jobMatch.matchedKeywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Missing Keywords from JD ({jobMatch.missingKeywords?.length || 0})
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Integrate these terms into your summary and experience bullet points:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {jobMatch.missingKeywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
