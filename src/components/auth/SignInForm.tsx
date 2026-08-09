'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDemoUser } from '@/lib/demoSession';

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // clear error on input change via handlers below

  const validate = () => {
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email';
    if (!password || password.length < 1) return 'Please enter your password';
    if (!acceptedTerms) return 'Please accept the terms';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // set demo session (do not store password)
    setDemoUser({ email, name: email.split('@')[0] });
    router.push('/');
  };

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Sign In</h2>

      <form onSubmit={handleSubmit} aria-live="polite">
        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" autoComplete="email" required className="auth-input" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} />

        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required className="auth-input" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} />
          <button type="button" className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(s => !s)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
        </div>

        <div className="auth-row auth-aux">
          <a href="/login/forgot-password" className="auth-link">Forgot your password?</a>
          <button type="button" className="auth-link" onClick={() => router.push('/')}>Back to store</button>
        </div>

        <div className="auth-row auth-terms">
          <label>
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} /> I agree with <a href="/terms">Terms and Conditions</a>
          </label>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-actions">
          <button type="submit" className="account-access-button" disabled={!acceptedTerms}>Sign In</button>
          <button type="button" className="account-access-button" onClick={() => router.push('/login?view=create')}>Create Account</button>
        </div>
      </form>
    </div>
  );
}
