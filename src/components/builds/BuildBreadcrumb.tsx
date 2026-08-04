'use client';

import React from 'react';
import Link from 'next/link';
import type { BuildDetail } from '@/data/builds';

export default function BuildBreadcrumb({ build }: { build: BuildDetail }) {
  const categoryRoute = `/${build.category}`;

  return (
    <nav aria-label="Breadcrumb" className="build-breadcrumb">
      <ol className="build-breadcrumb-list">
        <li>
          <Link href="/" className="build-breadcrumb-link">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="build-breadcrumb-separator">›</li>
        <li>
          <Link href={categoryRoute} className="build-breadcrumb-link">
            {build.categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="build-breadcrumb-separator">›</li>
        <li aria-current="page" className="build-breadcrumb-current">
          {build.title}
        </li>
      </ol>
    </nav>
  );
}
