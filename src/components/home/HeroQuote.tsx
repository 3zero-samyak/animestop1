import React from 'react';
import Container from '@/components/ui/Container';

export default function HeroQuote() {
  return (
    <section className="py-24 bg-[var(--elevated-bg)]">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-[family-name:var(--font-dancing)] text-[var(--text-primary)] leading-relaxed">
            &ldquo;Every story we discover becomes a part of who we are.&rdquo;
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
