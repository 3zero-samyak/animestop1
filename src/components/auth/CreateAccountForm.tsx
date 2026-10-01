'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function CreateAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, sendVerificationEmail } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdEmail, setCreatedEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const validate = () => {
    if (!name) return 'Name is required';
    if (!/.+@.+\..+/.test(email)) return 'Valid email required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirm) return 'Passwords do not match';
    if (!acceptedTerms) return 'Please accept the terms';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationError(null);

    try {
      const result = await signUp(email, password, name);
      setCreatedEmail(email);
      setVerificationSent(result.verificationSent);
      if (result.verificationSent) {
        setResendCooldown(60);
      } else if (result.verificationErrorCode) {
        setVerificationError(getAuthErrorMessage({ code: result.verificationErrorCode }, 'verification'));
      }
      setLoading(false);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => setResendCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const handleContinue = () => {
    const returnTo = searchParams.get('returnTo');
    const safeReturnTo = 
      returnTo && 
      returnTo.startsWith('/') && 
      !returnTo.startsWith('//')
        ? returnTo 
        : '/account';
    
    router.replace(safeReturnTo);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResending(true);
    setError(null);
    setVerificationError(null);

    try {
      await sendVerificationEmail();
      setVerificationSent(true);
      setResendCooldown(60);
    } catch (err) {
      setVerificationSent(false);
      setVerificationError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setResending(false);
    }
  };

  if (createdEmail) {
    return (
      <div className="auth-form-shell">
        <h2 className="account-access-title">Account Created</h2>

        {verificationSent ? (
          <>
            <div className="auth-info" style={{ marginBottom: '1rem' }}>
              We sent a verification link to:
            </div>
            <div className="auth-info" style={{ fontWeight: 600, marginBottom: '1rem' }}>
              {createdEmail}
            </div>
            <div className="auth-info" style={{ marginBottom: '1.5rem' }}>
              Please verify your email before sharing stories or writing journals.
            </div>
          </>
        ) : (
          <>
            <div className="auth-info" style={{ marginBottom: '1rem' }}>
              Your AnimeStop account has been created successfully.
            </div>
            <div className="auth-info" style={{ marginBottom: '1rem' }}>
              We couldn&apos;t send the verification email right now.
            </div>
            <div className="auth-info" style={{ fontWeight: 600, marginBottom: '1.5rem' }}>
              {createdEmail}
            </div>
          </>
        )}

        {verificationError && <div className="auth-error" role="alert" style={{ marginBottom: '1rem' }}>{verificationError}</div>}
        {error && <div className="auth-error" role="alert" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div className="auth-actions">
          <button
            type="button"
            className="account-access-button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
          >
            {resending
              ? 'SENDING...'
              : resendCooldown > 0
              ? `RESEND IN ${resendCooldown}s`
              : 'RESEND VERIFICATION EMAIL'}
          </button>
          <button 
            type="button" 
            className="account-access-button"
            onClick={handleContinue}
          >
            CONTINUE TO ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Create Account</h2>

      <form onSubmit={handleSubmit} aria-live="polite">
        <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
        <input 
          id="name" 
          name="name" 
          type="text"
          autoComplete="name"
          className="auth-input" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          disabled={loading}
          required 
        />

        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          autoComplete="email"
          className="auth-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required 
        />

        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input 
            id="password" 
            name="password" 
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="auth-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required 
          />
          <button 
            type="button" 
            className="auth-password-toggle" 
            aria-label={showPassword ? 'Hide password' : 'Show password'} 
            onClick={() => setShowPassword(s => !s)}
            disabled={loading}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        <label htmlFor="confirm">Confirm Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input 
            id="confirm" 
            name="confirm" 
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="auth-input" 
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            required 
          />
        </div>

        <div className="auth-row auth-terms">
          <label>
            <input 
              type="checkbox" 
              checked={acceptedTerms} 
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              disabled={loading}
            /> 
            I agree with <a href="/terms">Terms and Conditions</a>
          </label>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-actions">
          <button 
            type="submit" 
            className="account-access-button" 
            disabled={!acceptedTerms || loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="auth-footer">
        Already have an account? <button 
          type="button" 
          className="auth-link" 
          onClick={() => {
            const returnTo = searchParams.get('returnTo');
            const url = returnTo 
              ? `/login?view=signin&returnTo=${encodeURIComponent(returnTo)}`
              : '/login?view=signin';
            router.push(url);
          }}
          disabled={loading}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
