'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  requireEmailVerification?: boolean;
  verificationRequiredComponent?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  loadingComponent,
  requireEmailVerification = false,
  verificationRequiredComponent,
}: ProtectedRouteProps) {
  const { user, loading, isEmailVerified } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const params = new URLSearchParams();
      params.set('returnTo', pathname);
      router.replace(`/login?${params.toString()}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <>
        {loadingComponent || (
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Checking your account...</p>
            </div>
          </main>
        )}
      </>
    );
  }

  if (!user) {
    return null;
  }

  if (requireEmailVerification && !isEmailVerified) {
    return <>{verificationRequiredComponent}</>;
  }

  return <>{children}</>;
}
