import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  variant?: 'display' | 'sans';
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  align = 'center',
  variant = 'display' 
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const fontClass = variant === 'display' 
    ? 'font-[family-name:var(--font-dancing)]' 
    : 'font-[family-name:var(--font-inter)]';

  return (
    <div className={`mb-12 ${alignClass}`}>
      <h2 className={`text-4xl md:text-5xl lg:text-6xl ${fontClass} text-[var(--text-primary)] mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
