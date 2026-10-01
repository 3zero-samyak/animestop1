'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const returnTo = searchParams.get('returnTo');
  const backToSignInUrl = returnTo
    ? `/login?view=signin&returnTo=${encodeURIComponent(returnTo)}`
    : '/login?view=signin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword(normalizedEmail);
      setSent(true);
    } catch (err) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const firebaseError = err as { code?: string; message?: string };
        console.error('[Password reset]', firebaseError.code, firebaseError.message);
      }
      setError(getAuthErrorMessage(err, 'passwordReset'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Forgot Password</h2>

      {sent ? (
        <>
          <div className="auth-info" aria-live="polite">
            <p>Password Reset Email Sent</p>
            <p>If an account exists for this email, Firebase will send password reset instructions.</p>
            <p>Check your inbox and spam folder.</p>
          </div>
          <div className="auth-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="account-access-button"
              onClick={() => router.push(backToSignInUrl)}
            >
              RETURN TO SIGN IN
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} aria-live="polite">
          <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="auth-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
            required
          />

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="auth-actions">
            <button
              type="submit"
              className="account-access-button"
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
            <button
              type="button"
              className="account-access-button"
              onClick={() => router.push(backToSignInUrl)}
              disabled={loading}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
