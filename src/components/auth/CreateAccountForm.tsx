'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDemoUser } from '@/lib/demoSession';

export default function CreateAccountForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!name) return 'Name is required';
    if (!/.+@.+\..+/.test(email)) return 'Valid email required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirm) return 'Passwords do not match';
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

    // store demo profile (name + email only)
    setDemoUser({ name, email });
    router.push('/');
  };

  return (
    <div className="auth-form-shell">
      <h2 className="account-access-title">Create Account</h2>

      <form onSubmit={handleSubmit} aria-live="polite">
        <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
        <input id="name" name="name" type="text" className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(s => !s)}>{showPassword ? 'HIDE' : 'SHOW'}</button>
        </div>

        <label htmlFor="confirm">Confirm Password <span aria-hidden="true">*</span></label>
        <div className="auth-password-wrapper">
          <input id="confirm" name="confirm" type={showPassword ? 'text' : 'password'} className="auth-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>

        <div className="auth-row auth-terms">
          <label>
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} /> I agree with <a href="/terms">Terms and Conditions</a>
          </label>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-actions">
          <button type="submit" className="account-access-button" disabled={!acceptedTerms}>Create Account</button>
        </div>
      </form>

      <div className="auth-footer">
        Already have an account? <button type="button" className="auth-link" onClick={() => router.push('/login?view=signin')}>Sign In</button>
      </div>
    </div>
  );
}
