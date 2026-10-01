"use client";

import React, { useState } from 'react';
import { submitJournal, type JournalCategory } from '@/lib/submissions';
import { EmailVerificationRequired } from '@/components/auth/EmailVerificationRequired';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

export default function WriteJournalPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JournalCategory>('creator-note');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSaved(false);
    setSubmitError(null);

    try {
      await submitJournal({ title, category, body });
      // Clear draft session storage after successful submission
      if (typeof window !== 'undefined') sessionStorage.removeItem('animestop-journal-draft');
      setSaved(true);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const submissionError = err as { code?: string; message?: string };
        console.error(`[Journal submit] code: ${submissionError.code ?? 'unknown'}`);
        console.error(`[Journal submit] message: ${submissionError.message ?? 'Unknown Firebase error'}`);
      }

      setSaved(false);
      const code = err && typeof err === 'object' && 'code' in err ? (err as { code?: string }).code : '';
      if (code === 'permission-denied') {
        setSubmitError('Your account is not permitted to submit this journal entry.');
      } else if (code === 'unavailable') {
        setSubmitError('AnimeStop is temporarily unable to accept journal entries. Please try again.');
      } else if (code === 'network-request-failed') {
        setSubmitError('Network error. Check your connection and try again.');
      } else {
        setSubmitError('We couldn\'t submit your journal entry. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <ProtectedRoute
        requireEmailVerification={true}
        verificationRequiredComponent={
          <main>
            <EmailVerificationRequired context="journal" />
          </main>
        }
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Checking your account...</p>
            </div>
          </main>
        }
      >
        <main className="journal-page-container">
          <section className="journal-write">
            <h1>WRITE YOUR JOURNAL</h1>
            {saved && (
              <div className="notice" role="status" aria-live="polite">
                Your journal entry has been received and will be reviewed before it appears publicly.
              </div>
            )}
            <form onSubmit={submit} className="journal-write-form" aria-live="polite">
              <label>Title</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} required />

              <label>Category</label>
              <select value={category} onChange={(e)=>setCategory(e.target.value as JournalCategory)}>
                <option value="creator-note">Creator Note</option>
                <option value="behind-the-scenes">Behind the Scenes</option>
                <option value="reflection">Reflection</option>
                <option value="story-deep-dive">Story Deep Dive</option>
                <option value="community">Community</option>
              </select>

              <label>Your Story</label>
              <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={10} required />

              {submitError && <div className="form-error" role="alert">{submitError}</div>}

              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'SUBMITTING...' : 'SUBMIT JOURNAL'}
              </button>
            </form>
          </section>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
