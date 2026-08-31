'use client';

import React, { useState, useEffect } from 'react';
import { formatTimeString } from '@/lib/formatTime';

interface ClientTimeProps {
  timestamp?: string | Date | number;
  fallbackText?: string;
  className?: string;
}

export default function ClientTime({ timestamp, fallbackText = 'Updated 8 min ago', className }: ClientTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className} aria-hidden="true">{fallbackText}</span>;
  }

  const formatted = timestamp ? `Updated ${formatTimeString(timestamp)}` : fallbackText;

  return <span className={className}>{formatted}</span>;
}
