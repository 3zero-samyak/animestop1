import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getBuildBySlug, getAllBuildSlugs } from '@/data/builds';
import BuildDetailPage from '@/components/builds/BuildDetailPage';

export async function generateStaticParams() {
  const slugs = getAllBuildSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const build = getBuildBySlug(slug);
  if (!build) return {};
  return {
    title: `${build.title} | AnimeStop`,
    description: build.shortDescription,
  } as Metadata;
}

export default async function Page({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = (await params) as { slug: string };
  const build = getBuildBySlug(slug);
  if (!build) notFound();

  return (
    <>
      <Header />
      <main className="build-detail-page" data-category={build.category}>
        <BuildDetailPage build={build} />
      </main>
      <Footer />
    </>
  );
}
