import Link from 'next/link';
import React from 'react';

export default function BrandLogo() {
  return (
    <Link href="/" className="flex flex-col group">
      <div className="flex items-baseline">
        <span 
          className="font-stylish text-[clamp(26px,5vw,34px)] font-semibold leading-none tracking-[-0.02em]"
          style={{
            color: 'var(--text-brand)',
            textShadow: '0 0 20px rgba(220, 101, 52, 0.3)',
          }}
        >
          ANIME
        </span>
        <span 
          className="font-stylish text-[clamp(26px,5vw,34px)] font-semibold leading-none tracking-[-0.02em]"
          style={{
            color: 'var(--accent-orange)',
            textShadow: '0 0 20px rgba(220, 101, 52, 0.4)',
          }}
        >
          STOP
        </span>
      </div>
      <div 
        className="mt-[5px] text-[10.5px] tracking-[0.04em] font-normal uppercase"
        style={{ 
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-interface)',
        }}
      >
        Built by anime fans. For anime fans.
      </div>
    </Link>
  );
}
