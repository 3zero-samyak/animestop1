import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-[var(--transition-base)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-warm)] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[var(--accent-warm)] text-white hover:bg-[var(--accent-copper)] shadow-lg hover:shadow-xl',
    secondary: 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--elevated-bg)] border border-[var(--border-card)]',
    outline: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-warm)] hover:text-white border-2 border-[var(--accent-orange)] hover:border-[var(--accent-warm)]',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-[var(--radius-md)]',
    md: 'px-6 py-3 text-base rounded-[var(--radius-lg)]',
    lg: 'px-8 py-4 text-lg rounded-[var(--radius-xl)]',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
