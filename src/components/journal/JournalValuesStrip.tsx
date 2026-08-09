'use client';

import React from 'react';
import { BookOpen, MessageSquare, FileText, Users } from 'lucide-react';

const items = [
  { title: 'REAL STORIES', subtitle: 'From fans and creators.', Icon: BookOpen },
  { title: 'DEEP REFLECTIONS', subtitle: 'Thoughts that inspire.', Icon: MessageSquare },
  { title: 'CREATOR INSIGHTS', subtitle: 'Behind-the-scenes and more.', Icon: FileText },
  { title: 'COMMUNITY VOICES', subtitle: "Your stories matter.", Icon: Users },
];

export default function JournalValuesStrip() {
  return (
    <section className="journal-values">
      <div className="journal-values-inner">
        {items.map((it) => (
          <div key={it.title} className="journal-value">
            <div className="journal-value-icon"><it.Icon /></div>
            <h4 className="journal-value-title">{it.title}</h4>
            <p className="journal-value-sub">{it.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
