import React from 'react';
import Container from '@/components/ui/Container';
import { Lightbulb, Pencil, Box, Layers, Printer, Wrench, Palette, Package } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Lightbulb,
    title: 'IDEA / BRIEF',
    description: 'You share your vision with us',
  },
  {
    number: 2,
    icon: Pencil,
    title: '2D SKETCH',
    description: 'We create concept art',
  },
  {
    number: 3,
    icon: Box,
    title: '3D MODEL',
    description: 'Digital sculpting begins',
  },
  {
    number: 4,
    icon: Layers,
    title: 'SLICING',
    description: 'Print planning & prep',
  },
  {
    number: 5,
    icon: Printer,
    title: '3D PRINT',
    description: 'Bringing it to life',
  },
  {
    number: 6,
    icon: Wrench,
    title: 'POST-PROCESS',
    description: 'Cleaning & assembly',
  },
  {
    number: 7,
    icon: Palette,
    title: 'PAINTING',
    description: 'Color & finishing',
  },
  {
    number: 8,
    icon: Package,
    title: 'PACKAGING',
    description: 'Safe delivery to you',
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <Container size="large" className="how-it-works-container">
        <h2 className="how-it-works-heading">HOW IT WORKS</h2>
        <p className="how-it-works-subheading">
          From your idea to a finished masterpiece — here&apos;s our creative journey
        </p>

        <div className="how-it-works-steps">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="how-it-works-step">
                <div className="how-it-works-step-badge">{step.number}</div>
                <div className="how-it-works-step-icon">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="how-it-works-step-title">{step.title}</h3>
                <p className="how-it-works-step-description">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
