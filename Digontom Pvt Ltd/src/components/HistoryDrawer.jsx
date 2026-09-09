import React from 'react';
import { X, History, Trash2, ExternalLink, Calendar, FileText, Database } from 'lucide-react';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history = [],
  onSelectResume,
  onDeleteResume,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Saved Resume Scans
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-500" />
                MongoDB Database ({history.length} scans)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Scans */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs">Loading scans from MongoDB...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No saved resumes found</p>
              <p className="text-xs mt-1">Analyze a resume to store reports in MongoDB automatically.</p>
            </div>
          ) : (
            history.map((item) => {
              const overall = item.scores?.overall || 0;
              const ats = item.scores?.atsScore || 0;
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'Just now';

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col gap-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {item.candidateName || 'Unnamed Candidate'}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {item.fileName || 'resume.txt'}
                      </p>
                    </div>

                    {/* Dual mini scores */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        overall >= 70
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {overall}%
                      </span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        ats >= 70
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        ATS {ats}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectResume(item._id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </button>
                      <button
                        onClick={() => onDeleteResume(item._id)}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="Delete from MongoDB"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center text-[11px] text-gray-400">
          Stored securely in MongoDB collection <code className="text-indigo-500">resumeanalyses</code>
        </div>
      </div>
    </div>
  );
};
