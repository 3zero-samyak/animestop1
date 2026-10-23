import Link from 'next/link';
import Container from '@/components/ui/Container';
import { ArrowRight, Lightbulb, Box, Printer, Palette } from 'lucide-react';

const steps = [
  { icon: Lightbulb, title: 'Start with a spark', description: 'A scene, a feeling, or your wildest what-if. Every build starts here.' },
  { icon: Box, title: 'Give it a shape', description: 'Sketches become digital sculpts, with room to experiment.' },
  { icon: Printer, title: 'Make it real', description: 'Print, assemble, and refine. Little details make a big difference.' },
  { icon: Palette, title: 'Bring on the colour', description: 'Hand-painted finishes turn a tiny world into a lasting memory.' },
];

export default function HowItWorks() {
  return (
    <section className="creative-process" aria-labelledby="process-title">
      <Container size="large">
        <header className="section-heading-row"><div><p className="section-kicker">The making of a memory</p><h2 id="process-title">From a spark to <span className="script-accent">something special.</span></h2></div><Link href="/studio" className="discovery-studio-link">Follow the process <ArrowRight size={17} aria-hidden="true" /></Link></header>
        <div className="creative-process-grid">{steps.map(({ icon: Icon, title, description }, index) => <article className="creative-step" key={title}><div className="creative-step-top"><Icon size={25} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div>
      </Container>
    </section>
  );
}
