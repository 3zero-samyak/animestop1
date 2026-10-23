import React from 'react';
import CircleSection from './CircleSection';
import StorySubmission from './StorySubmission';
import JournalSection from './JournalSection';

export default function CommunitySection() {
  return (
    <section className="community-section">
      <header className="community-section-heading"><p className="section-kicker">Good stories bring us together</p><h2>There’s a place for <span className="script-accent">your story, too.</span></h2></header>
      <div className="community-grid">
        <CircleSection />
        <StorySubmission />
        <JournalSection />
      </div>
    </section>
  );
}
