/**
 * Typography Constants for Desktop Container Query Scaling
 *
 * These values use clamp() with container query width (cqw) units
 * to scale proportionally with tile container size.
 *
 * IMPORTANT: Only for desktop tiled layout (≥1024px).
 * Mobile parallax layout uses viewport units (vw) and Tailwind classes.
 *
 * Format: clamp(min, preferred, max)
 * - min: Minimum size for small containers
 * - preferred: Percentage of container width (cqw)
 * - max: Maximum size for large containers
 */
export const FONT_SIZES = {
  // Extra small - For hints, metadata
  xs: 'clamp(10px, 1.5cqw, 16px)',

  // Small - Body text, navigation items
  sm: 'clamp(11px, 2cqw, 18px)',

  // Base - Primary body text
  base: 'clamp(13px, 2.5cqw, 22px)',

  // Large - Subheadings, emphasized text
  lg: 'clamp(15px, 3cqw, 26px)',

  // Extra large - Section headers (h1)
  xl: 'clamp(17px, 3.5cqw, 32px)',

  // 2X large - Page titles, project headers (h1 in detail views)
  '2xl': 'clamp(20px, 4cqw, 36px)',

  // 3X large - Hero text, major headings
  '3xl': 'clamp(24px, 4.5cqw, 44px)',
} as const;

export type FontSize = keyof typeof FONT_SIZES;

/**
 * Helper type for components that accept font size props
 */
export type FontSizeValue = typeof FONT_SIZES[FontSize];

/**
 * UI Element Sizes for Desktop Container Query Scaling
 *
 * Icon sizes and interactive element dimensions that scale with container size.
 * Uses the same clamp() + cqw approach as FONT_SIZES for consistency.
 *
 * IMPORTANT: Only for desktop tiled layout (≥1024px).
 * Mobile parallax layout uses fixed Tailwind sizes.
 *
 * Format: clamp(min, preferred, max)
 * - min: Minimum size for small containers (meets WCAG touch target guidelines)
 * - preferred: Percentage of container width (cqw)
 * - max: Maximum size for large containers (prevents oversized elements)
 */
export const UI_SIZES = {
  // Icon sizes - theme preset buttons, navigation icons
  iconXs: 'clamp(16px, 3cqw, 28px)',
  iconSm: 'clamp(20px, 4cqw, 36px)',
  iconMd: 'clamp(24px, 5cqw, 44px)',
  iconLg: 'clamp(32px, 6cqw, 56px)',

  // Color picker tiles - interactive color selection elements
  colorTileXs: 'clamp(18px, 3.5cqw, 32px)',
  colorTileSm: 'clamp(24px, 5cqw, 42px)',
  colorTileMd: 'clamp(32px, 6cqw, 52px)',
} as const;

export type UISize = keyof typeof UI_SIZES;

/**
 * Helper type for components that accept UI size props
 */
export type UISizeValue = typeof UI_SIZES[UISize];
