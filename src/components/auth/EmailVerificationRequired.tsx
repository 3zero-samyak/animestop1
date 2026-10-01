'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';
import { auth } from '@/lib/firebase';

interface EmailVerificationRequiredProps {
  context?: 'story' | 'journal';
}

export function EmailVerificationRequired({ context = 'story' }: EmailVerificationRequiredProps) {
  const router = useRouter();
  const { user, sendVerificationEmail, refreshUser } = useAuth();
  const contextText = context === 'journal' ? 'writing your journal' : 'sharing your story';
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleSendVerification = async () => {
    if (cooldown > 0) return;

    setSending(true);
    setMessage(null);
    setError(null);

    try {
      await sendVerificationEmail();
      setMessage('Verification email sent. Check your inbox and spam folder.');
      setCooldown(60);
    } catch (err) {
      setError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setSending(false);
    }
  };

  const handleRefresh = async () => {
    setChecking(true);
    setMessage(null);
    setError(null);

    try {
      await refreshUser();
      if (auth.currentUser?.emailVerified || user?.emailVerified) {
        setMessage('Email verified.');
      } else {
        setError('Your email has not been verified yet.');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="verification-required-container">
      <div className="verification-required-content">
        <h1 className="verification-required-title">VERIFY YOUR EMAIL</h1>
        
        <p className="verification-required-text">
          Before {contextText}, please verify the email connected to your AnimeStop account.
        </p>

        {user?.email && <p className="verification-email">{user.email}</p>}

        {message && <div className="verification-success-message" aria-live="polite">{message}</div>}
        {error && <div className="verification-error-message" role="alert">{error}</div>}

        <div className="verification-required-actions">
          <button
            type="button"
            className="account-access-button"
            onClick={handleSendVerification}
            disabled={sending || cooldown > 0}
          >
            {sending ? 'SENDING...' : cooldown > 0 ? `RESEND IN ${cooldown}s` : 'RESEND VERIFICATION EMAIL'}
          </button>
          <button
            type="button"
            className="account-access-button"
            onClick={handleRefresh}
            disabled={checking}
          >
            {checking ? 'CHECKING...' : "I'VE VERIFIED MY EMAIL"}
          </button>
          <button
            type="button"
            className="account-access-button"
            onClick={() => router.push('/account')}
          >
            GO TO ACCOUNT
          </button>
        </div>
      </div>

      <style jsx>{`
        .verification-required-container {
          width: 100%;
          min-height: calc(100svh - var(--header-height, 72px));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 6vh, 60px) 16px;
        }

        .verification-required-content {
          width: min(100%, 540px);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .verification-required-title {
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-family: var(--font-interface);
          letter-spacing: 0.05em;
          margin: 0;
        }

        .verification-required-text {
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }

        .verification-email {
          font-size: 1rem;
          color: var(--text-primary);
          margin: 0;
          font-weight: 600;
        }

        .verification-success-message {
          padding: 16px;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border: 1px solid var(--accent-primary);
          border-radius: 8px;
          color: var(--accent-primary);
        }

        .verification-error-message {
          padding: 16px;
          background: color-mix(in srgb, #c7522a 14%, transparent);
          border: 1px solid #c7522a;
          border-radius: 8px;
          color: var(--text-primary);
        }

        .verification-required-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }

        @media (max-width: 599px) {
          .verification-required-content {
            gap: 18px;
          }
        }
      `}</style>
    </div>
  );
}
