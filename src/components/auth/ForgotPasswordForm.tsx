'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Forgot Password</h2>

      {sent ? (
        <>
          <div className="auth-info">
            Password reset email sent. Check your inbox.
          </div>
          <div className="auth-actions" style={{ marginTop: '1.5rem' }}>
            <button 
              type="button" 
              className="account-access-button" 
              onClick={() => router.push('/login?view=signin')}
            >
              Back to Sign In
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
            required 
            className="auth-input" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            disabled={loading}
          />

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="auth-actions">
            <button 
              type="submit" 
              className="account-access-button"
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              className="account-access-button" 
              onClick={() => router.push('/login?view=signin')}
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
