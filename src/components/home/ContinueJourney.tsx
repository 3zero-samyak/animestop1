import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function ContinueJourney() {
  return (
    <section className="py-12">
      <Container size="large">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 bg-gradient-to-r from-[var(--card-bg)] to-[var(--elevated-bg)] border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center sm:text-left">
                <h3 
                  className="text-2xl md:text-3xl font-stylish mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Your Journey
                </h3>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Continue where you left off and explore new stories
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" size="md">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
