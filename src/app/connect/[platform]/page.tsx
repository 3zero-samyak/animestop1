import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

const validPlatforms = ['instagram', 'discord', 'youtube', 'x'] as const;
type Platform = typeof validPlatforms[number];

const platformNames: Record<Platform, string> = {
  instagram: 'Instagram',
  discord: 'Discord',
  youtube: 'YouTube',
  x: 'X',
};

export function generateStaticParams() {
  return validPlatforms.map((platform) => ({
    platform,
  }));
}

export default async function ConnectPlatformPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform } = await params;

  if (!validPlatforms.includes(platform as Platform)) {
    notFound();
  }

  const platformName = platformNames[platform as Platform];

  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">{platformName}</h1>
          
          <p className="interior-page-intro">
            The official AnimeStop {platformName} channel will be linked here once it is ready.
          </p>

          <section className="interior-page-section">
            <p>
              We are taking time to build a thoughtful presence before connecting social platforms. Follow the Journal for updates on when official channels launch.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/" className="interior-page-link">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
