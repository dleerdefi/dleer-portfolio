'use client';

import React from 'react';

interface ThemeIconProps {
  size?: number;
  className?: string;
}

// Solarized Light - Sun/Solar icon
export const SolarizedIcon: React.FC<ThemeIconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Nord - Snowflake/Arctic icon
export const NordIcon: React.FC<ThemeIconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2v20M2 12h20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5.64 5.64l12.72 12.72M5.64 18.36l12.72-12.72"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    <circle cx="12" cy="22" r="1.5" fill="currentColor" />
    <circle cx="2" cy="12" r="1.5" fill="currentColor" />
    <circle cx="22" cy="12" r="1.5" fill="currentColor" />
    <circle cx="5.64" cy="5.64" r="1.5" fill="currentColor" />
    <circle cx="18.36" cy="18.36" r="1.5" fill="currentColor" />
    <circle cx="18.36" cy="5.64" r="1.5" fill="currentColor" />
    <circle cx="5.64" cy="18.36" r="1.5" fill="currentColor" />
  </svg>
);

// Tokyo Night - Moon icon (dark theme)
export const TokyoNightIcon: React.FC<ThemeIconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crescent moon */}
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      fill="currentColor"
    />
  </svg>
);
