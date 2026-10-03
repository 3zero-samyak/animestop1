'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';
import { useAuth } from '@/lib/AuthProvider';
import { useJourney } from '@/components/journey/JourneyProvider';
import { recordJourneyView } from '@/lib/journey';
import BuildBreadcrumb from './BuildBreadcrumb';
import BuildHeroGallery from './BuildHeroGallery';
import BuildStoryTextSection from './BuildStoryTextSection';
import BuildSpecificationSection from './BuildSpecificationSection';
import BuildInterestPanel from './BuildInterestPanel';
import RelatedBuilds from './RelatedBuilds';
import CommunityShareSection from './CommunityShareSection';

export default function BuildDetailPage({ build }: { build: BuildDetail }) {
  const { user } = useAuth();
  const { preference, preferenceResolved } = useJourney();

  React.useEffect(() => {
    if (!user?.uid || !build.id || !build.category || !preferenceResolved || preference.recordingPaused) {
      return;
    }

    const timer = window.setTimeout(() => {
      const normalizedCategory = build.category as 'stories' | 'essentials' | 'possibilities' | 'vault';
      void recordJourneyView(user.uid, normalizedCategory, build.id);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [build.category, build.id, preference.recordingPaused, preferenceResolved, user?.uid]);

  return (
    <>
      <BuildBreadcrumb build={build} />
      
      <BuildHeroGallery build={build} />
      
      <BuildStoryTextSection build={build} />
      
      <BuildSpecificationSection build={build} />
      
      <BuildInterestPanel build={build} />
      
      <RelatedBuilds currentBuild={build} />
      
      <CommunityShareSection />
    </>
  );
}
