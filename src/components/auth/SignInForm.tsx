'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';
import { consumeAuthReturnTo, getSafeReturnTo, persistAuthToast } from '@/lib/authNavigation';

interface SignInFormProps {
  returnTo?: string | null;
}

export default function SignInForm({ returnTo: returnToProps }: SignInFormProps = {}) {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = returnToProps ?? searchParams.get('returnTo');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getDestination = () => getSafeReturnTo(returnTo, consumeAuthReturnTo('/account'));

  const validate = () => {
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email';
    if (!password || password.length < 1) return 'Please enter your password';
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

    try {
      const credential = await signIn(email, password);
      persistAuthToast({
        kind: 'success',
        message: credential.user.emailVerified
          ? 'Signed in successfully. Email verified.'
          : 'Signed in successfully. Please verify your email.',
      });
      router.replace(getDestination());
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
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

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Sign In</h2>

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

        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input 
            id="password" 
            name="password" 
            type={showPassword ? 'text' : 'password'} 
            autoComplete="current-password" 
            required 
            className="auth-input" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            disabled={loading}
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

        <div className="auth-row auth-aux">
          <a
            href={returnTo ? `/login?view=forgot&returnTo=${encodeURIComponent(returnTo)}` : '/login?view=forgot'}
            className="auth-link"
          >
            Forgot your password?
          </a>
          <button type="button" className="auth-link" onClick={() => router.push('/')} disabled={loading}>
            Back to AnimeStop
          </button>
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
            {loading ? 'SIGNING IN...' : 'Sign In'}
          </button>
          <button 
            type="button" 
            className="account-access-button" 
            onClick={() => {
              const url = returnTo 
                ? `/login?view=create&returnTo=${encodeURIComponent(returnTo)}`
                : '/login?view=create';
              router.push(url);
            }}
            disabled={loading || googleLoading}
          >
            Create Account
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
    </div>
  );
}
