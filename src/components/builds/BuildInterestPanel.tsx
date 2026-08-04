'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { BuildDetail } from '@/data/builds';

export default function BuildInterestPanel({ build }: { build: BuildDetail }) {
  const contactHref = build.requestHref || '/contact';

  return (
    <section className="build-interest-panel">
      <div className="build-interest-intro">
        <h2 className="build-interest-heading">INTERESTED IN THIS BUILD?</h2>
        <p className="build-interest-description">
          This isn&apos;t just another collectible.
          <br />
          It&apos;s a piece brought to life with passion and precision.
        </p>
      </div>

      <div className="build-interest-checklist">
        <div className="build-interest-check-item">
          <Check className="build-interest-check-icon" size={20} strokeWidth={2} />
          <span>Want to know more details?</span>
        </div>
        <div className="build-interest-check-item">
          <Check className="build-interest-check-icon" size={20} strokeWidth={2} />
          <span>Curious about the making?</span>
        </div>
        <div className="build-interest-check-item">
          <Check className="build-interest-check-icon" size={20} strokeWidth={2} />
          <span>Want to own this moment?</span>
        </div>
        <div className="build-interest-check-item">
          <Check className="build-interest-check-icon" size={20} strokeWidth={2} />
          <span>Let&apos;s talk.</span>
        </div>
      </div>

      <div className="build-interest-action">
        <Link href={contactHref} className="build-interest-cta">
          DM TO KNOW MORE →
        </Link>
        <p className="build-interest-note">
          Our team will personally guide you
          <br />
          through the complete experience.
        </p>
      </div>
    </section>
  );
}
