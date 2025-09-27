// Theme configuration definitions

export interface ThemeColors {
  // Base colors
  background: string;
  backgroundRgb: string; // For opacity variations
  surface: string;
  surfaceRgb: string;

  // Text colors
  text: string;
  textDimmed: string;
  textMuted: string;

  // UI colors
  primary: string;
  primaryRgb: string;
  border: string;
  borderActive: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Tokyo Night theme (Dark)
export const tokyoNightTheme: ThemeColors = {
  background: '#1a1b26',
  backgroundRgb: '26, 27, 38',
  surface: '#24283b',
  surfaceRgb: '36, 40, 59',

  text: '#a9b1d6',
  textDimmed: '#565f89',
  textMuted: '#414868',

  primary: '#7aa2f7',
  primaryRgb: '122, 162, 247',
  border: '#414868',
  borderActive: '#7aa2f7',

  success: '#9ece6a',
  warning: '#e0af68',
  error: '#f7768e',
  info: '#7dcfff'
};

// Catppuccin Mocha theme (Medium Dark)
export const catppuccinMochaTheme: ThemeColors = {
  background: '#1e1e2e',
  backgroundRgb: '30, 30, 46',
  surface: '#313244',
  surfaceRgb: '49, 50, 68',

  text: '#cdd6f4',
  textDimmed: '#9399b2',
  textMuted: '#6c7086',

  primary: '#89b4fa',
  primaryRgb: '137, 180, 250',
  border: '#6c7086',
  borderActive: '#89b4fa',

  success: '#a6e3a1',
  warning: '#f9e2af',
  error: '#f38ba8',
  info: '#89dceb'
};

// Catppuccin Latte theme (Light)
export const catppuccinLatteTheme: ThemeColors = {
  background: '#eff1f5',
  backgroundRgb: '239, 241, 245',
  surface: '#e6e9ef',
  surfaceRgb: '230, 233, 239',

  text: '#4c4f69',
  textDimmed: '#5c5f77',
  textMuted: '#6c6f85',

  primary: '#1e66f5',
  primaryRgb: '30, 102, 245',
  border: '#acb0be',
  borderActive: '#1e66f5',

  success: '#40a02b',
  warning: '#df8e1d',
  error: '#d20f39',
  info: '#04a5e5'
};

// Theme map
export const themes = {
  'tokyo-night': tokyoNightTheme,
  'catppuccin-mocha': catppuccinMochaTheme,
  'catppuccin-latte': catppuccinLatteTheme
} as const;

// Helper to get theme by name
export function getTheme(themeName: keyof typeof themes): ThemeColors {
  return themes[themeName];
}

// Generate CSS variables for a theme
export function generateThemeCssVariables(theme: ThemeColors): string {
  return `
    --theme-bg: ${theme.background};
    --theme-bg-rgb: ${theme.backgroundRgb};
    --theme-surface: ${theme.surface};
    --theme-surface-rgb: ${theme.surfaceRgb};

    --theme-text: ${theme.text};
    --theme-text-dimmed: ${theme.textDimmed};
    --theme-text-muted: ${theme.textMuted};

    --theme-primary: ${theme.primary};
    --theme-primary-rgb: ${theme.primaryRgb};
    --theme-border: ${theme.border};
    --theme-border-active: ${theme.borderActive};

    --theme-success: ${theme.success};
    --theme-warning: ${theme.warning};
    --theme-error: ${theme.error};
    --theme-info: ${theme.info};
  `;
}

// Accent colors with their hex values
export const accentColors = [
  { name: 'rose', hex: '#f43f5e' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'fuchsia', hex: '#d946ef' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'green', hex: '#22c55e' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'orange', hex: '#f97316' }
] as const;

// Convert hex to RGB
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';

  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}