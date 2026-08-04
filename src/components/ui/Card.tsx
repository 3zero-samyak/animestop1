import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverClasses = hover 
    ? 'transition-all duration-[var(--transition-slow)] hover:translate-y-[-4px] hover:shadow-2xl cursor-pointer' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-[var(--card-bg)] border border-[var(--border-card)] rounded-[var(--radius-lg)] overflow-hidden ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
