import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-16 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}