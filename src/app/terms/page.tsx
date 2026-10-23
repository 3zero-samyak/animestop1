'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HeartHandshake, Eye, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 lg:py-24" style={{ backgroundColor: 'var(--background)' }}>
        <Container size="default">
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-primary)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>

          <div
            className="p-8 sm:p-12 rounded-[var(--radius-xl)] border transition-all max-w-4xl mx-auto"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Terms & community guidelines
              </h1>
            </div>
            
            <p className="text-sm tracking-wide mb-8" style={{ color: 'var(--text-muted)' }}>
              Last updated: October 2026 · AnimeStop Independent Maker Archive
            </p>

            <div className="space-y-8 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <ShieldCheck size={20} className="text-[var(--accent-primary)]" />
                  <h2>1. Independent fan-maker archive</h2>
                </div>
                <p>
                  AnimeStop is an independent maker archive and creative community dedicated to fan-crafted dioramas, concept displays, and storytelling. We are not affiliated with, endorsed by, or partnered with any anime studio, publisher, manga creator, or corporate rights holder.
                </p>
                <p>
                  All concepts presented across our collections (Stories, Essentials, Possibilities, and The Vault) are non-commercial artistic explorations and physical build concepts. No commercial retail transactions or commitments are accepted through this website.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <HeartHandshake size={20} className="text-[var(--accent-primary)]" />
                  <h2>2. Community submissions & content</h2>
                </div>
                <p>
                  When sharing personal anime memories, memories of pivotal scenes, or custom build requests, you affirm that the submission is your own personal narrative and respectful of the community. We maintain a zero-tolerance policy for hate speech, harassment, or infringing material.
                </p>
                <p>
                  You retain ownership of your submitted personal reflections while granting AnimeStop a non-exclusive license to display your story within the maker archive and community memory walls.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <Eye size={20} className="text-[var(--accent-primary)]" />
                  <h2>3. Accounts & privacy</h2>
                </div>
                <p>
                  Creating an account enables you to save custom build concepts to your personal journey, submit memories, and track your exploration history. You may pause or clear your journey tracking at any time through the Your Journey panel or account settings.
                </p>
                <p>
                  We respect your privacy and will never sell your personal information or email address to third parties.
                </p>
              </section>
            </div>

            <div className="mt-10 pt-8 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
              <Link
                href="/before-you-begin"
                className="text-sm font-semibold transition-colors hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                Read Before You Begin →
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                I Understand & Accept
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
