import { getImageUrl } from '@/lib/image-paths';
import type { ThemePreset } from '@/contexts/ThemeContext';

/**
 * The wallpapers each preset offers, as image URLs (the CDN's when NEXT_PUBLIC_CDN_URL is set).
 * Each one needs a pre-blurred copy: rerun scripts/build-wallpapers.mjs after changing this list
 * (tests/wallpapers.test.ts checks).
 */
export const themeBackgrounds: Record<ThemePreset, string[]> = {
  'tokyo-night': [
    getImageUrl('purple-girl.webp'),
    getImageUrl('cat_anime-girl.webp'),
    getImageUrl('shiny_purple.webp'),
    getImageUrl('pixel_big_city.webp')
  ],
  'nord': [
    getImageUrl('cool_rocks.webp'),
    getImageUrl('lets_go_home.webp'),
    getImageUrl('gradient-pb.webp')
  ],
  'solarized-light': [
    getImageUrl('pastel-window.webp'),
    getImageUrl('yellow_kyoto.webp'),
    getImageUrl('ign_colorful.webp')
  ]
};
