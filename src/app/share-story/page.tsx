'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareStoryForm from '@/components/forms/ShareStoryForm';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthProvider';

export default function ShareStoryPage() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <ProtectedRoute
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Checking your account...</p>
            </div>
          </main>
        }
      >
        <main>
          <ShareStoryForm user={user} />
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
