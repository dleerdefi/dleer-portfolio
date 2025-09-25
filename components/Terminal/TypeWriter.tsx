'use client';

import React, { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export default function TypeWriter({
  text,
  delay = 50,
  className = '',
  onComplete,
  showCursor = true
}: TypeWriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span className={`font-mono ${className}`}>
      {currentText}
      {showCursor && (
        <span className={`cursor ${currentIndex < text.length ? '' : 'animate-blink'}`}>
          _
        </span>
      )}
    </span>
  );
}