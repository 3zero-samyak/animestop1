'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';

export default function BuildSpecifications({ build }: { build: BuildDetail }) {
  return (
    <section className="build-specifications">
      <h2>THE BUILD</h2>
      <div className="build-spec-grid">
        {(build.specifications || []).map((s) => (
          <div key={s.label} className="build-spec">
            <strong>{s.label}</strong>
            <div>{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
