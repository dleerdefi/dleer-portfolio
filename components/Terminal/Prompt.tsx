'use client';

import React from 'react';

interface PromptProps {
  command?: string;
  className?: string;
  showCursor?: boolean;
}

export default function Prompt({
  command = '',
  className = '',
  showCursor = true
}: PromptProps) {
  return (
    <div className={`flex items-center font-mono text-sm md:text-base ${className}`}>
      <span className="text-tokyo-green mr-2">user@archlinux</span>
      <span className="text-term-text-dim mr-2">:</span>
      <span className="text-tokyo-blue mr-2">~$</span>
      <span className="text-term-text">{command}</span>
      {showCursor && <span className="cursor ml-1"></span>}
    </div>
  );
}