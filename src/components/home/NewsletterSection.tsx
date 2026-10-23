'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setStatus('success');
        setFeedbackMessage(
          data.message || 'Subscription request received and saved to our journey updates list.'
        );
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(data?.error || 'Unable to record subscription. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Network connection error. Your email has been preserved—please retry.');
    }
  };

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <Container size="large">
        <div className="newsletter-panel relative overflow-hidden rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Envelope Icon */}
          <div className="absolute top-8 left-8 opacity-10">
            <Send className="w-24 h-24 lg:w-32 lg:h-32" style={{ color: 'var(--text-primary)' }} />
          </div>

          {/* Left Side - Text */}
          <div className="relative z-10 flex-1">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-3"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-stylish)',
                fontStyle: 'italic',
              }}
            >Join our journey
            </h2>
            <p
              className="text-sm lg:text-base"
              style={{ color: 'var(--text-muted)' }}
            >
              Get updates on new stories, builds and behind-the-scenes magic.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="relative z-10 w-full lg:w-auto lg:flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 lg:w-80">
                <input
                  type="email"
                  aria-label="Email address for journey updates"
                  autoComplete="email"
                  value={email}
                  disabled={status === 'loading'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 newsletter-input"
                  required
                />
                {status === 'idle' && (
                  <p
                    className="absolute -bottom-6 left-0 text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No spam. Only stories worth telling.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 newsletter-submit disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting...' : 'Join the journey'}
                <Send className="w-4 h-4" />
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-[var(--accent-orange)]" role="status" aria-live="polite">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{feedbackMessage}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-[var(--accent-red)]" role="alert">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{feedbackMessage}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
