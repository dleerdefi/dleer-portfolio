import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  text: string;
}

/**
 * Reusable back button component for navigation in parallax sections
 */
export const BackButton: React.FC<BackButtonProps> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm transition-colors hover:brightness-110"
      style={{ color: 'var(--accent-color)' }}
    >
      ← {text}
    </button>
  );
};