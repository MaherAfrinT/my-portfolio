import { describe, it, expect } from 'vitest';
import { cn, formatDate, isValidUrl } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes properly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // tailwind-merge resolves conflicts
      expect(cn('bg-red-500', false && 'text-white', 'text-black')).toBe('bg-red-500 text-black');
    });
  });

  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      // Use a fixed date to avoid timezone issues in testing
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toContain('Jan 15, 2024');
    });

    it('returns empty string if no timestamp is provided', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('handles firestore timestamp mock', () => {
      const mockTimestamp = {
        toDate: () => new Date('2024-02-20T12:00:00Z')
      };
      expect(formatDate(mockTimestamp)).toContain('Feb 20, 2024');
    });
  });

  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false); // missing protocol
    });

    it('returns true for empty or null strings (optional field logic)', () => {
      expect(isValidUrl('')).toBe(true);
      expect(isValidUrl(null)).toBe(true);
      expect(isValidUrl(undefined)).toBe(true);
    });
  });
});
