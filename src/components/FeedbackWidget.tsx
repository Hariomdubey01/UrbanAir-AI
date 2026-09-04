'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Send } from 'lucide-react';

export default function FeedbackWidget() {
  const [voted, setVoted] = useState<null | 'helpful' | 'unhelpful'>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = async (rating: 'helpful' | 'unhelpful') => {
    setVoted(rating);

    if (rating === 'unhelpful') {
      setCommentOpen(true);
    } else {
      setSubmitted(true);
    }

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
    } catch (e) {
      // silent handle
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voted) return;

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: voted, feedback: comment }),
      });
    } catch (e) {}
    setSubmitted(true);
    setCommentOpen(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
        <Check className="w-3.5 h-3.5" />
        <span>{voted === 'helpful' ? 'Thanks — glad that was clear.' : 'Thanks for helping improve UrbanAir AI!'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Was this explanation clear?</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote('helpful')}
            className={`p-1.5 px-2.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-semibold ${
              voted === 'helpful'
                ? 'bg-emerald-500 text-[#090d16] border-emerald-500 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-white/20'
            }`}
            title="Clear and helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes</span>
          </button>

          <button
            onClick={() => handleVote('unhelpful')}
            className={`p-1.5 px-2.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-semibold ${
              voted === 'unhelpful'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-white/20'
            }`}
            title="Needs improvement"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>No</span>
          </button>
        </div>
      </div>

      {commentOpen && (
        <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            placeholder="Thanks for the signal. Anything specific we got wrong?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#10b981] hover:bg-[#34d399] text-[#090d16] font-bold rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
            <button
              type="button"
              onClick={() => { setCommentOpen(false); setSubmitted(true); }}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Skip
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

