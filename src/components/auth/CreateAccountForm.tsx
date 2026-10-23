'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';
import { consumeAuthReturnTo, getSafeReturnTo, persistAuthToast } from '@/lib/authNavigation';

interface CreateAccountFormProps {
  returnTo?: string | null;
}

export default function CreateAccountForm({ returnTo: returnToProps }: CreateAccountFormProps = {}) {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = returnToProps ?? searchParams.get('returnTo');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const getDestination = () => getSafeReturnTo(returnTo, consumeAuthReturnTo('/account'));

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email';
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    if (!acceptedTerms) return 'Please accept the terms and conditions to continue';
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
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleContinue = () => {
    persistAuthToast({
      kind: 'success',
      message: 'Account created. Please check your inbox to verify your email.',
    });
    router.replace(getDestination());
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    setResending(true);
    setVerificationError(null);
    try {
      const result = await signUp(email, password, name);
      setVerificationSent(result.verificationSent);
      if (result.verificationSent) {
        setResendCooldown(60);
      } else if (result.verificationErrorCode) {
        setVerificationError(getAuthErrorMessage({ code: result.verificationErrorCode }, 'verification'));
      }
    } catch (err) {
      setVerificationSent(false);
      setVerificationError(getAuthErrorMessage(err, 'verification'));
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) {
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions before continuing with Google.');
      return;
    }

    setGoogleLoading(true);
    setError(null);

    try {
      const credential = await signInWithGoogle();
      if (credential) {
        persistAuthToast({
          kind: 'success',
          message: credential.user.emailVerified
            ? 'Signed in successfully. Email verified.'
            : 'Signed in successfully. Please verify your email.',
        });
        router.replace(getDestination());
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, 'google'));
      setGoogleLoading(false);
      return;
    }

    setGoogleLoading(false);
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
          onChange={(e) => { setName(e.target.value); setError(null); }} 
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
          onChange={(e) => { setEmail(e.target.value); setError(null); }} 
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
            onChange={(e) => { setPassword(e.target.value); setError(null); }} 
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
            onChange={(e) => { setConfirm(e.target.value); setError(null); }}
            disabled={loading}
            required 
          />
        </div>

        <div className="auth-row auth-terms">
          <label>
            <input 
              type="checkbox" 
              checked={acceptedTerms} 
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked && error?.includes('terms')) {
                  setError(null);
                }
              }}
              disabled={loading || googleLoading}
            /> 
            I agree with <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
          </label>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-actions">
          <button 
            type="submit" 
            className="account-access-button" 
            disabled={loading || googleLoading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'Create Account'}
          </button>
        </div>

        <div className="auth-divider" aria-hidden="true">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="account-access-button account-access-button-google"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          aria-label="Continue with Google"
        >
          <span className="auth-google-icon" aria-hidden="true">G</span>
          {googleLoading ? 'CONTINUING...' : 'Continue with Google'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <button 
          type="button" 
          className="auth-link" 
          onClick={() => {
            const returnToParam = searchParams.get('returnTo');
            const url = returnToParam 
              ? `/login?view=signin&returnTo=${encodeURIComponent(returnToParam)}`
              : '/login?view=signin';
            router.push(url);
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
