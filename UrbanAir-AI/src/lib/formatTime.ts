/**
 * Deterministic time & date formatting utilities for UrbanAir AI.
 * Prevents Next.js SSR/Client hydration mismatches.
 */

export function formatTimeString(dateInput?: string | Date | number): string {
  if (!dateInput) return '12:00 PM';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '12:00 PM';

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
}

export function formatDateString(dateInput?: string | Date | number): string {
  if (!dateInput) return 'Jan 1, 2026';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Jan 1, 2026';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatNumberString(num: number, decimals: number = 1): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toFixed(decimals);
}
