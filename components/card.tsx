import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  const hoverClasses = hover
    ? "hover:border-accent-primary hover:shadow-lg"
    : "";

  return (
    <div className={`bg-bg-secondary border border-border rounded-lg p-6 transition-all duration-200 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}