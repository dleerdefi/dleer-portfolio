import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Latte Base
        'latte': {
          'base': '#eff1f5',
          'mantle': '#e6e9ef',
          'surface0': '#dce0e8',
          'surface1': '#ccd0da',
          'surface2': '#bcc0cc',
          'overlay0': '#9ca0b0',
          'overlay1': '#8c8fa1',
          'text': '#4c4f69',
          'subtext0': '#5c5f77',
          'subtext1': '#6c6f85',
        },
        // Tokyo Night Accents
        'tokyo': {
          'blue': '#7aa2f7',
          'purple': '#bb9af7',
          'green': '#9ece6a',
          'orange': '#ff9e64',
          'red': '#f7768e',
          'cyan': '#7dcfff',
          'yellow': '#e0af68',
          'magenta': '#ad8ee6',
        },
        // Terminal specific colors
        'term': {
          'bg': '#eff1f5',
          'bg-dark': '#e6e9ef',
          'surface': '#dce0e8',
          'border': '#ccd0da',
          'text': '#4c4f69',
          'dim': '#6c6f85',
          'bright': '#5c5f77',
          'accent': '#7aa2f7',
          'accent-alt': '#9ece6a',
          'error': '#f7768e',
          'warning': '#ff9e64',
          'success': '#9ece6a',
        },
        // Semantic mappings
        border: 'var(--border)',
        'code-bg': 'var(--code-bg)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"IBM Plex Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      spacing: {
        'ch': '1ch',
        '2ch': '2ch',
        '3ch': '3ch',
        '4ch': '4ch',
        '6ch': '6ch',
        '8ch': '8ch',
        '10ch': '10ch',
        '12ch': '12ch',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'typing': 'typing 2s steps(30, end)',
        'blink': 'blink 1s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config