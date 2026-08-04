import React from 'react';
import CircleSection from './CircleSection';
import StorySubmission from './StorySubmission';
import JournalSection from './JournalSection';

export default function CommunitySection() {
  return (
    <section className="community-section">
      <div className="community-grid">
        <CircleSection />
        <StorySubmission />
        <JournalSection />
      </div>
    </section>
  );
}
