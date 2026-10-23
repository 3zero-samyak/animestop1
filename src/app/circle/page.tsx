'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Lightbulb, Users, Sparkles, ArrowRight, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import NewsletterSection from '@/components/home/NewsletterSection';

const pillars = [
  {
    icon: MessageCircle,
    title: 'Pivotal Scene Debates',
    description: 'Deep discussions dissecting character choices, moral dilemmas, and narrative climaxes that defined our favorite series.',
  },
  {
    icon: Lightbulb,
    title: 'Theories & What-Ifs',
    description: 'Explore alternate branches and what-could-have-been scenarios with fellow writers, fans, and creators.',
  },
  {
    icon: Users,
    title: 'Dedicated Fan Community',
    description: 'A genuine sanctuary built for passionate enthusiasts, free from corporate ads and algorithmic noise.',
  },
  {
    icon: Sparkles,
    title: 'Early Concept Previews',
    description: 'Get first looks at upcoming physical diorama concepts, vote on design sketches, and shape archive additions.',
  },
];

export default function CirclePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 lg:py-24" style={{ backgroundColor: 'var(--background)' }}>
        <Container size="large">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
            <span
              className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              COMMUNITY SANCTUARY
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-stylish"
              style={{ color: 'var(--text-primary)' }}
            >The circle
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              A community that feels like home. Where anime moments become shared memories, and fan passion drives physical craft.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Community Callout */}
          <div
            className="p-8 sm:p-12 rounded-[var(--radius-xl)] border mb-20 flex flex-col lg:flex-row items-center justify-between gap-8"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                  Fan Creations Welcome
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Have an anime memory or build idea?
              </h2>
              <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                Our archive is built directly from fan stories. Submit a scene, and our craft team may develop it into the next display concept.
              </p>
            </div>
            <Link
              href="/share-story"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Share Your Story <ArrowRight size={18} />
            </Link>
          </div>
        </Container>

        {/* Newsletter & Updates */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
