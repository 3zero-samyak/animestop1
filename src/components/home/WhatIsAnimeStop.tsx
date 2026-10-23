import Link from 'next/link';
import Container from '@/components/ui/Container';
import { ArrowRight, Palette, PenTool } from 'lucide-react';

export default function WhatIsAnimeStop() {
  return (
    <section className="maker-intro" aria-labelledby="maker-intro-title">
      <Container size="large" className="maker-intro-grid">
        <div>
          <p className="section-kicker">A fan’s imagination, made real</p>
          <h2 id="maker-intro-title">Big feelings.<br /><span className="script-accent">Little worlds.</span></h2>
          <p>We’re a fan-inspired maker archive. Think miniatures, dioramas, desk pieces, and the creative experiments behind them. Every piece begins with a moment that meant something.</p>
          <Link href="/about" className="discovery-studio-link">Meet AnimeStop <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="maker-mode-cards">
          <article className="maker-mode-card"><Palette size={26} aria-hidden="true" /><h3>See it in colour</h3><p>Painted builds, cinematic reveals, and worlds ready for your shelf.</p><span>Anime mode</span></article>
          <article className="maker-mode-card"><PenTool size={26} aria-hidden="true" /><h3>Behind the panels</h3><p>Sketches, work in progress, and honest notes from the making of it all.</p><span>Manga mode</span></article>
        </div>
      </Container>
    </section>
  );
}
