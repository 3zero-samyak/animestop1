'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email';
    if (!password || password.length < 1) return 'Please enter your password';
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

    try {
      await signIn(email, password);
      
      // Handle return path
      const returnTo = searchParams.get('returnTo');
      const safeReturnTo = 
        returnTo && 
        returnTo.startsWith('/') && 
        !returnTo.startsWith('//')
          ? returnTo 
          : '/';
      
      router.replace(safeReturnTo);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
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
          <a href="/login?view=forgot" className="auth-link">Forgot your password?</a>
          <button type="button" className="auth-link" onClick={() => router.push('/')} disabled={loading}>
            Back to store
          </button>
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
            {loading ? 'SIGNING IN...' : 'Sign In'}
          </button>
          <button 
            type="button" 
            className="account-access-button" 
            onClick={() => {
              const returnTo = searchParams.get('returnTo');
              const url = returnTo 
                ? `/login?view=create&returnTo=${encodeURIComponent(returnTo)}`
                : '/login?view=create';
              router.push(url);
            }}
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
