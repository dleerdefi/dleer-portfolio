/**
 * Image path utilities for flexible CDN or local image loading
 *
 * Usage:
 * - Set NEXT_PUBLIC_CDN_URL to use a CDN (e.g., https://cdn.dleer.ai)
 * - Leave unset to use local /public/images/ directory
 *
 * This allows the project to work both with and without a CDN,
 * making it suitable for open source use while supporting
 * production CDN deployments.
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

/**
 * Get the full image URL, using CDN if configured, otherwise local path
 * @param imagePath - Path relative to /images/ (e.g., "purple-girl.webp" or "profile/photo.webp")
 * @returns Full URL or local path
 */
export function getImageUrl(imagePath: string): string {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Remove 'images/' prefix if present (we'll add it back)
  const pathWithoutImagesPrefix = cleanPath.replace(/^images\//, '');

  if (CDN_URL) {
    // Use CDN URL
    return `${CDN_URL}/images/${pathWithoutImagesPrefix}`;
  }

  // Use local path (works with Next.js /public directory)
  return `/images/${pathWithoutImagesPrefix}`;
}

/**
 * Check if CDN is configured
 */
export function isCdnEnabled(): boolean {
  return Boolean(CDN_URL);
}

/**
 * Get thumbnail path for an image
 * Handles both full URLs (from CDN) and relative paths
 * @param imagePath - Original image path (can be full URL or relative)
 * @returns Thumbnail path
 */
export function getThumbnailUrl(imagePath: string): string {
  // Handle full URLs (CDN or local absolute paths)
  // Prevents double-processing URLs that are already from getImageUrl()
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/images/')) {
    // Already a full URL or absolute path - manipulate directly
    return imagePath
      .replace(/\/images\/([^/]+\.webp)$/, '/images/thumbs/$1')  // Insert /thumbs/ before filename
      .replace(/\.webp$/, '_thumb.webp');  // Add _thumb suffix
  }

  // Handle relative paths (for backward compatibility)
  const baseUrl = getImageUrl(imagePath);
  return baseUrl
    .replace('/images/', '/images/thumbs/')
    .replace('.webp', '_thumb.webp');
}
