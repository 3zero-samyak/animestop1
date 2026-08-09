'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import { Send } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }
    
    // Mock success
    setStatus('success');
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
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
            >
              Join Our Journey
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
                  value={email}
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
                className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 newsletter-submit"
              >
                Join the Journey
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            {status === 'success' && (
              <p className="mt-4 text-sm" style={{ color: 'var(--accent-orange)' }}>
                ✓ Welcome aboard! Check your inbox.
              </p>
            )}
            
            {status === 'error' && (
              <p className="mt-4 text-sm" style={{ color: 'var(--accent-red)' }}>
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
