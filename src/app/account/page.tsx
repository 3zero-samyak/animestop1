'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/AuthProvider';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getAuthErrorMessage } from '@/lib/authErrors';
import { auth } from '@/lib/firebase';
import { isAdminUser } from '@/lib/admin';
import { getUserProfile, type UserProfile } from '@/lib/userProfile';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, sendVerificationEmail, refreshUser } = useAuth();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [sendingVerification, setSendingVerification] = React.useState(false);
  const [refreshingVerification, setRefreshingVerification] = React.useState(false);
  const [verificationCooldown, setVerificationCooldown] = React.useState(0);
  const [verificationMessage, setVerificationMessage] = React.useState<string | null>(null);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (verificationCooldown <= 0) return;
    const timer = window.setTimeout(() => setVerificationCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [verificationCooldown]);

  React.useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!user) {
        if (mounted) setProfile(null);
        return;
      }

      try {
        const userProfile = await getUserProfile(user.uid);
        if (mounted) {
          setProfile(userProfile);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  React.useEffect(() => {
    let mounted = true;

    const loadAdminStatus = async () => {
      if (!user?.uid) {
        if (mounted) {
          setIsAdmin(false);
        }
        return;
      }

      const admin = await isAdminUser(user.uid);
      if (mounted) {
        setIsAdmin(admin);
      }
    };

    void loadAdminStatus();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSendVerification = async () => {
    if (verificationCooldown > 0) return;

    setSendingVerification(true);
    setVerificationMessage(null);
    setVerificationError(null);

    try {
      await sendVerificationEmail();
      setVerificationMessage('Verification email sent. Check your inbox and spam folder.');
      setVerificationCooldown(60);
    } catch (err) {
      setVerificationError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setSendingVerification(false);
    }
  };

  const handleRefreshVerification = async () => {
    setRefreshingVerification(true);
    setVerificationMessage(null);
    setVerificationError(null);

    try {
      await refreshUser();
      if (auth.currentUser?.emailVerified || user?.emailVerified) {
        setVerificationMessage('Email verified.');
      } else {
        setVerificationError('Your email has not been verified yet.');
      }
    } catch (err) {
      setVerificationError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setRefreshingVerification(false);
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
          <div className="account-page-container">
            <h1 className="account-page-title">Account</h1>

            {/* Profile Information */}
            <section className="account-section">
              <h2 className="account-section-title">Profile Information</h2>

              <div className="account-field">
                <label className="account-label">Display Name</label>
                <p className="account-value">{user?.displayName || profile?.displayName || 'Not set'}</p>
              </div>

              <div className="account-field">
                <label className="account-label">Email</label>
                <p className="account-value">{user?.email || profile?.email}</p>
              </div>

              {(user?.metadata?.creationTime || profile?.createdAt) && (
                <div className="account-field">
                  <label className="account-label">Account Created</label>
                  <p className="account-value">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : profile?.createdAt.toDate().toLocaleDateString()}
                  </p>
                </div>
              )}
            </section>

            <section className="account-section">
              <h2 className="account-section-title">Email Verification</h2>
              {user?.emailVerified ? (
                <p className="account-value account-verified">✓ Email verified</p>
              ) : (
                <>
                  <p className="account-value">Email not verified</p>
                  <p className="account-section-email">{user?.email}</p>
                  {verificationMessage && <p className="account-success">{verificationMessage}</p>}
                  {verificationError && <p className="account-error">{verificationError}</p>}
                  <div className="account-button-group">
                    <button
                      type="button"
                      onClick={handleSendVerification}
                      disabled={sendingVerification || verificationCooldown > 0}
                      className="account-button account-button-primary"
                    >
                      {sendingVerification
                        ? 'SENDING...'
                        : verificationCooldown > 0
                        ? `RESEND IN ${verificationCooldown}s`
                        : 'RESEND VERIFICATION EMAIL'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRefreshVerification}
                      disabled={refreshingVerification}
                      className="account-button account-button-secondary"
                    >
                      {refreshingVerification ? 'CHECKING...' : 'REFRESH VERIFICATION STATUS'}
                    </button>
                  </div>
                </>
              )}
            </section>

            <section className="account-section">
              <h2 className="account-section-title">My Submissions</h2>
              <p className="account-section-desc">
                View the Story and Journal entries you have already sent to AnimeStop.
              </p>
              <button
                type="button"
                onClick={() => router.push('/account/submissions')}
                className="account-button account-button-primary"
              >
                MY SUBMISSIONS
              </button>
            </section>

            <section className="account-section">
              <h2 className="account-section-title">My Saved Items</h2>
              <p className="account-section-desc">
                View the Stories, Essentials, Possibilities and Vault products you have bookmarked across AnimeStop.
              </p>
              <button
                type="button"
                onClick={() => router.push('/account/saved')}
                className="account-button account-button-primary"
              >
                MY SAVED ITEMS
              </button>
            </section>

            {isAdmin && (
              <section className="account-section">
                <h2 className="account-section-title">Admin Moderation</h2>
                <p className="account-section-desc">
                  Review and moderate Story and Journal submissions.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/submissions')}
                  className="account-button account-button-primary"
                >
                  ADMIN MODERATION
                </button>
              </section>
            )}

            <section className="account-section">
              <h2 className="account-section-title">Sign Out</h2>
              <button
                type="button"
                onClick={handleLogout}
                className="account-button account-button-secondary"
              >
                Sign Out
              </button>
            </section>
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
