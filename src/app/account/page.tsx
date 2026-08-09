'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDemoUser, clearDemoUser } from '@/lib/demoSession';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const user = getDemoUser();

  const signOut = () => {
    clearDemoUser();
    router.push('/');
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-form-shell">
          <h2 className="account-access-title">Account</h2>

          {user ? (
            <div className="account-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <div style={{ marginTop: 20 }}>
                <button className="account-access-button" onClick={signOut}>Sign Out</button>
              </div>
            </div>
          ) : (
            <div>
              <p>No signed in user.</p>
              <button className="account-access-button" onClick={() => router.push('/login')}>Sign In</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
