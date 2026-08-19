'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/AuthProvider';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <Header />
      <ProtectedRoute
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Loading account...</p>
            </div>
          </main>
        }
      >
        <main className="auth-page">
          <div className="auth-form-shell">
            <h2 className="account-access-title">Account</h2>

            <div className="account-details">
              <p><strong>Name:</strong> {user?.displayName || 'Not set'}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <div style={{ marginTop: 20 }}>
                <button className="account-access-button" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
