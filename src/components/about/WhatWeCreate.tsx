'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'essentials',
    title: 'Essentials',
    description: 'Objects designed to carry a little piece of the anime world into everyday life.',
    link: '/essentials',
    linkText: 'Explore Essentials',
    color: '#70dfd0',
  },
  {
    id: 'stories',
    title: 'Stories',
    description: 'Builds inspired by scenes, emotions and lessons that stay with us.',
    link: '/stories',
    linkText: 'Explore Stories',
    color: '#f29dc5',
  },
  {
    id: 'possibilities',
    title: 'Possibilities',
    description: 'Alternate realities, what-if concepts and ideas beyond the original story.',
    link: '/possibilities',
    linkText: 'Explore Possibilities',
    color: '#b6a0ff',
  },
  {
    id: 'vault',
    title: 'Vault',
    description: 'Rare, ambitious and experimental builds preserved as part of the AnimeStop archive.',
    link: '/vault',
    linkText: 'Enter The Vault',
    color: '#f4d482',
  },
];

export default function WhatWeCreate() {
  return (
    <section className="about-section">
      <ScrollReveal>
        <h2 className="about-section-title">What we create</h2>
        <p className="about-section-subtitle">
          Ideas inspired by the moments anime fans remember.
        </p>
      </ScrollReveal>

      <div className="category-grid">
        {categories.map((category, index) => (
          <ScrollReveal key={category.id} delay={index * 100}>
            <div className="category-card" data-category={category.id}>
              <h3 className="category-card-title" style={{ color: category.color }}>
                {category.title}
              </h3>
              <p className="category-card-description">{category.description}</p>
              <Link href={category.link} className="category-card-link">
                {category.linkText} <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
