'use client';

import React from 'react';
import type { BuildDetail } from '@/data/builds';
import BuildBreadcrumb from './BuildBreadcrumb';
import BuildHeroGallery from './BuildHeroGallery';
import BuildStoryTextSection from './BuildStoryTextSection';
import BuildSpecificationSection from './BuildSpecificationSection';
import BuildInterestPanel from './BuildInterestPanel';
import RelatedBuilds from './RelatedBuilds';
import CommunityShareSection from './CommunityShareSection';

export default function BuildDetailPage({ build }: { build: BuildDetail }) {
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
