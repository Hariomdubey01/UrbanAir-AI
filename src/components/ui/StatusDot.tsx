import React from 'react';

interface StatusDotProps {
  color?: 'emerald' | 'teal' | 'cyan' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
  className?: string;
}

export default function StatusDot({
  color = 'emerald',
  pulse = true,
  className = '',
}: StatusDotProps) {
  const colorMap = {
    emerald: { dot: 'bg-emerald-500', ping: 'bg-emerald-400' },
    teal: { dot: 'bg-teal-400', ping: 'bg-teal-400' },
    cyan: { dot: 'bg-cyan-400', ping: 'bg-cyan-400' },
    amber: { dot: 'bg-amber-400', ping: 'bg-amber-400' },
    rose: { dot: 'bg-rose-500', ping: 'bg-rose-400' },
    slate: { dot: 'bg-slate-400', ping: 'bg-slate-400' },
  };

  const selected = colorMap[color] || colorMap.emerald;

  return (
    <span className={`relative inline-flex items-center justify-center w-2 h-2 ${className}`}>
      {pulse && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${selected.ping}`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selected.dot}`} />
    </span>
  );
}
