import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges tailwind classes properly avoiding conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp to a readable date
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(string) {
  if (!string) return true; // Optional fields can be empty
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

