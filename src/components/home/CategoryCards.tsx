'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { ArrowRight, ShoppingBag, BookOpen, Sparkles, Diamond } from 'lucide-react';

const categories = [
  {
    id: 'essentials',
    title: 'ESSENTIALS',
    description: 'Designed for everyday life. Carry the anime you love, wherever you go.',
    image: '',
    icon: ShoppingBag,
    gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
    href: '/essentials',
  },
  {
    id: 'stories',
    title: 'STORIES',
    description: 'Relive the scenes that moved you. Moments that stay forever.',
    image: '',
    icon: BookOpen,
    gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
    href: '/stories',
  },
  {
    id: 'possibilities',
    title: 'POSSIBILITIES',
    description: 'What if things were different? Explore alternate realities.',
    image: '',
    icon: Sparkles,
    gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
    href: '/possibilities',
  },
  {
    id: 'vault',
    title: 'VAULT',
    description: 'Rare. Exclusive. Legendary. Artifacts for the truest collectors.',
    image: '',
    icon: Diamond,
    gradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
    href: '/vault',
  },
];

export default function CategoryCards() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <Container size="large">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] block"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                data-mode-image-container
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 mode-sensitive-background"
                  data-mode-sensitive-background="true"
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                  }}
                  aria-hidden="true"
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="media-overlay-card"
                  aria-hidden="true"
                />
                
                {/* Icon Badge */}
                <div className="absolute top-6 left-6">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 media-content">
                  <h3 
                    className="text-2xl lg:text-3xl font-bold mb-3 transition-transform duration-300 group-hover:translate-x-1 media-title"
                    style={{ 
                      fontFamily: 'var(--font-stylish)',
                      fontStyle: 'italic',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {category.title}
                  </h3>
                  <p 
                    className="text-xs lg:text-sm mb-6 transition-all duration-300 opacity-90 group-hover:opacity-100 leading-relaxed media-description"
                  >
                    {category.description}
                  </p>
                  
                  {/* Button */}
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 group-hover:gap-3 w-fit"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <span 
                      className="text-xs font-medium"
                      style={{ 
                        color: 'var(--media-text-primary)',
                      }}
                    >
                      Explore {category.title.charAt(0) + category.title.slice(1).toLowerCase()}
                    </span>
                    <ArrowRight 
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                      style={{ color: 'var(--media-text-primary)' }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
