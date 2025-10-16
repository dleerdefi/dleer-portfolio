/**
 * Typography Constants for Desktop Container Query Scaling
 *
 * Design-standard compliant typography using industry best practices:
 * - Uses rem units for accessibility (respects user browser zoom)
 * - Uses cqi (container query inline) for RTL/logical support
 * - Follows clamp(min, base + fluid%, max) formula for proper scaling
 * - Body text meets 16-18px minimum readability standard
 *
 * IMPORTANT: Only for desktop tiled layout (≥1024px).
 * Mobile parallax layout uses viewport units (vw) and Tailwind classes.
 *
 * Format: clamp(min-rem, base-rem + cqi%, max-rem)
 * - min: Minimum readable size (accessibility baseline)
 * - base + cqi: Target size with fluid scaling
 * - max: Maximum size to prevent oversizing
 */
export const FONT_SIZES = {
  // Extra small - Metadata, captions (14-16px)
  xs: 'clamp(0.875rem, 0.875rem + 1cqi, 1rem)',

  // Small - Secondary text, labels (16-18px)
  sm: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)',

  // Base - Primary body text (18-20px) - INDUSTRY STANDARD
  base: 'clamp(1.125rem, 1.125rem + 2cqi, 1.25rem)',

  // Large - Subheadings (20-24px)
  lg: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)',

  // Extra large - Section headers (24-28px)
  xl: 'clamp(1.5rem, 1.5rem + 3cqi, 1.75rem)',

  // 2X large - Page titles (28-36px)
  '2xl': 'clamp(1.75rem, 1.75rem + 4cqi, 2.25rem)',

  // 3X large - Hero text (32-44px)
  '3xl': 'clamp(2rem, 2rem + 5cqi, 2.75rem)',
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
 * Uses the same clamp() + cqi approach as FONT_SIZES for consistency.
 * All touch targets meet WCAG 2.5.5 minimum size requirements (24x24px).
 *
 * IMPORTANT: Only for desktop tiled layout (≥1024px).
 * Mobile parallax layout uses fixed Tailwind sizes.
 *
 * Format: clamp(min-rem, base-rem + cqi%, max-rem)
 * - min: Minimum size meeting WCAG touch target guidelines (24px = 1.5rem)
 * - base + cqi: Target size with fluid scaling
 * - max: Maximum size to prevent oversized elements
 */
export const UI_SIZES = {
  // Icon sizes - theme preset buttons, navigation icons
  iconXs: 'clamp(1rem, 1.5rem + 3cqi, 2rem)',      // 16-32px (reduced min for extreme resize)
  iconSm: 'clamp(1.25rem, 2rem + 4cqi, 2.5rem)',   // 20-40px (reduced min)
  iconMd: 'clamp(1.5rem, 2.5rem + 5cqi, 3.5rem)',  // 24-56px (reduced min)
  iconLg: 'clamp(2rem, 3rem + 6cqi, 4.5rem)',      // 32-72px (reduced min)

  // Color picker tiles - interactive color selection elements
  colorTileXs: 'clamp(0.875rem, 1.25rem + 2.5cqi, 1.75rem)',  // 14-28px (reduced min)
  colorTileSm: 'clamp(1rem, 1.5rem + 3.5cqi, 2.25rem)',        // 16-36px (reduced min)
  colorTileMd: 'clamp(1.25rem, 2rem + 4.5cqi, 2.75rem)',       // 20-44px (reduced min)
} as const;

export type UISize = keyof typeof UI_SIZES;

/**
 * Helper type for components that accept UI size props
 */
export type UISizeValue = typeof UI_SIZES[UISize];
