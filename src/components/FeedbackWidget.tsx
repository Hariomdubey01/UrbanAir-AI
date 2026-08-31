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
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>Was this explanation clear?</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote('helpful')}
            className={`p-1.5 px-2.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-semibold ${
              voted === 'helpful'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-ivory-100 dark:bg-forest-900 hover:bg-ivory-200 text-forest-800 dark:text-slate-300 border-forest-800/10 dark:border-white/[0.08]'
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
                : 'bg-ivory-100 dark:bg-forest-900 hover:bg-ivory-200 text-forest-800 dark:text-slate-300 border-forest-800/10 dark:border-white/[0.08]'
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
            className="flex-1 bg-white dark:bg-forest-900 border border-forest-800/15 dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-forest-800 dark:text-white placeholder-muted focus:outline-none focus:border-ai-500"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-3 py-1.5 bg-forest-800 dark:bg-forest-700 hover:bg-forest-900 text-white text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <span>Submit</span>
              <Send className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                setCommentOpen(false);
              }}
              className="text-xs text-muted hover:underline px-1"
            >
              Skip
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

