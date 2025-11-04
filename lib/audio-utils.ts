/**
 * Audio utilities for blog post audio player
 * Follows the same pattern as image-paths.ts for CDN/local flexibility
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

/**
 * Get the full audio URL, using CDN if configured, otherwise local path
 * @param audioPath - Path relative to /audio/ (e.g., "blog/post.mp3")
 * @returns Full URL or local path
 */
export function getAudioUrl(audioPath: string): string {
  // Remove leading slash if present
  const cleanPath = audioPath.startsWith('/') ? audioPath.slice(1) : audioPath;

  // Remove 'audio/' prefix if present (we'll add it back)
  const pathWithoutAudioPrefix = cleanPath.replace(/^audio\//, '');

  if (CDN_URL) {
    // Use CDN URL
    return `${CDN_URL}/audio/${pathWithoutAudioPrefix}`;
  }

  // Use local path (works with Next.js /public directory)
  return `/audio/${pathWithoutAudioPrefix}`;
}

/**
 * Format seconds into MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 * @param timeStr - Time string
 * @returns Time in seconds
 */
export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // SS
    return parts[0];
  }

  return 0;
}

/**
 * Get blog audio file path based on slug
 * @param slug - Blog post slug
 * @returns Audio file path
 */
export function getBlogAudioPath(slug: string): string {
  return getAudioUrl(`blog/${slug}.mp3`);
}

/**
 * Check if audio file exists (client-side)
 * Note: This requires a HEAD request to check file existence
 * @param audioUrl - Audio URL to check
 * @returns Promise<boolean>
 */
export async function audioExists(audioUrl: string): Promise<boolean> {
  try {
    const response = await fetch(audioUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Calculate estimated reading time as audio duration
 * Rough estimate: 150 words per minute speaking rate
 * @param wordCount - Number of words in article
 * @returns Estimated duration in seconds
 */
export function estimateAudioDuration(wordCount: number): number {
  const wordsPerMinute = 150; // Average speaking rate
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}

/**
 * Throttle function for performance optimization
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in ms
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  }) as T;
}