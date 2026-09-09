import React, { useState } from 'react';
import { X, Zap, Copy, Check, Sparkles, Lightbulb } from 'lucide-react';

export const BulletOptimizerModal = ({ isOpen, onClose }) => {
  const [bulletText, setBulletText] = useState('');
  const targetRole = 'Software Engineer';
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleImprove = async (e) => {
    e.preventDefault();
    if (!bulletText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/resumes/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: bulletText, targetRole })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error('Error improving bullet:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sampleBullets = [
    "worked on react dashboard and fixed bugs",
    "responsible for managing team and daily standups",
    "helped with sql database queries and made reports",
    "did testing on api endpoints and wrote documentation"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-2xl w-full p-6 relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Bullet Point Optimizer
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Transform weak bullet points into high-impact XYZ achievement statements
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleImprove} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Paste Weak Bullet Point
            </label>
            <textarea
              rows={2}
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Worked on react web app and improved code speed..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Quick Sample Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-gray-400">Try sample:</span>
            {sampleBullets.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setBulletText(sample)}
                className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {sample.slice(0, 24)}...
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400">
              Powered by RESUMEUP AI Engine
            </span>
            <button
              type="submit"
              disabled={loading || !bulletText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Improve Bullet</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {results && (
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              AI-Generated High-Impact Variations
            </h4>

            <div className="space-y-3">
              {results.improvedBullets?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 transition relative group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.style}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.text, idx)}
                      className="p-1 rounded text-gray-400 hover:text-indigo-600 transition flex items-center gap-1 text-[11px]"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    • {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Tips Card */}
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" />
              <div>
                <p className="font-semibold mb-0.5">Google XYZ Formula:</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                  Accomplished [X] as measured by [Y] by doing [Z]. Customize numbers and metrics to match your actual project impact!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
