import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'large' | 'full';
}

export default function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const sizeClasses = {
    default: 'max-w-7xl',
    large: 'max-w-[var(--max-page-width)]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
