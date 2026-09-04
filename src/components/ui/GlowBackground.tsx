import React from 'react';

interface GlowBackgroundProps {
  className?: string;
  showGrid?: boolean;
}

export default function GlowBackground({
  className = '',
  showGrid = true,
}: GlowBackgroundProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Blurred emerald ambient glow */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-ambient-glow" />

      {/* Blurred cyan ambient glow */}
      <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-cyan-500/8 blur-[130px] animate-ambient-glow" style={{ animationDelay: '-6s' }} />

      {/* Very subtle technical grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 bg-tech-grid opacity-60" />
      )}

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#071014_80%)] opacity-80" />
    </div>
  );
}
