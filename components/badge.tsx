import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-bg-surface text-text-secondary border-border",
    primary: "bg-accent-primary text-bg-primary border-accent-primary",
    secondary: "bg-accent-secondary text-bg-primary border-accent-secondary",
    success: "bg-semantic-success text-bg-primary border-semantic-success",
    warning: "bg-semantic-warning text-bg-primary border-semantic-warning",
    error: "bg-semantic-error text-bg-primary border-semantic-error",
  };

  return (
    <span className={`inline-block px-2.5 py-1 text-sm font-medium rounded border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}