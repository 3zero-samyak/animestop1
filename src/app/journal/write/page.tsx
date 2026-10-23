"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { submitJournal, type JournalCategory } from '@/lib/submissions';
import { EmailVerificationRequired } from '@/components/auth/EmailVerificationRequired';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthProvider';

const getJournalDraftKey = (uid?: string) =>
  uid ? `animestop-journal-draft:${uid}` : 'animestop-journal-draft';

type SavedDraftData = {
  title?: string;
  category?: JournalCategory;
  body?: string;
  updatedAt?: string;
};

export default function WriteJournalPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JournalCategory>('creator-note');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<SavedDraftData | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check for saved draft asynchronously after mount
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(getJournalDraftKey(user.uid));
        if (raw) {
          const parsed = JSON.parse(raw) as SavedDraftData;
          if (parsed?.title || parsed?.body) {
            setPendingDraft(parsed);
          }
        }
      } catch {}
    }, 0);

    return () => clearTimeout(timer);
  }, [user]);

  // Debounced auto-save to user-scoped key
  useEffect(() => {
    if (!user || saved) return;
    if (!title && !body) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          getJournalDraftKey(user.uid),
          JSON.stringify({ title, category, body, updatedAt: new Date().toISOString() })
        );
      } catch {}
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, category, body, user, saved]);

  const restoreDraft = () => {
    if (!pendingDraft) return;
    if (pendingDraft.title) setTitle(pendingDraft.title);
    if (pendingDraft.category) setCategory(pendingDraft.category);
    if (pendingDraft.body) setBody(pendingDraft.body);
    setPendingDraft(null);
  };

  const discardDraft = () => {
    if (user) {
      try {
        localStorage.removeItem(getJournalDraftKey(user.uid));
      } catch {}
    }
    setPendingDraft(null);
  };

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
      try {
        localStorage.removeItem(getJournalDraftKey(user?.uid));
        sessionStorage.removeItem('animestop-journal-draft');
      } catch {}
      setSaved(true);
      setTitle('');
      setBody('');
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
        <main className="min-h-screen py-16 lg:py-24" style={{ backgroundColor: 'var(--background)' }}>
          <Container size="default">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--accent-primary)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ArrowLeft size={16} /> Back to Journal
                </Link>
              </div>

              {pendingDraft && (
                <div
                  className="mb-8 p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--accent-primary)',
                  }}
                  role="status"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        You have an unsaved journal draft
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {pendingDraft.title || 'Untitled draft'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={restoreDraft}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-md text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      Restore Draft
                    </button>
                    <button
                      type="button"
                      onClick={discardDraft}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors hover:text-[var(--accent-red)]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}

              <section
                className="p-8 sm:p-12 rounded-[var(--radius-xl)] border"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-8 h-8 text-[var(--accent-primary)]" />
                  <h1 className="text-3xl sm:text-4xl font-bold font-stylish" style={{ color: 'var(--text-primary)' }}>Write your journal
                  </h1>
                </div>

                <p className="text-sm sm:text-base mb-8" style={{ color: 'var(--text-muted)' }}>
                  Share your creative process, anime reflections, or deep dives with the AnimeStop community.
                </p>

                {saved && (
                  <div
                    className="p-4 rounded-lg mb-8 flex items-center gap-3 border"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <p className="text-sm font-medium">
                      Your journal entry has been received and will be reviewed before it appears publicly.
                    </p>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-6" aria-live="polite">
                  <div>
                    <label
                      htmlFor="journal-title"
                      className="block text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Title <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="journal-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Reflections on Setting Your Heart Ablaze"
                      className="w-full px-4 py-3 rounded-lg border text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      style={{
                        backgroundColor: 'var(--surface-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="journal-category"
                      className="block text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Category <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="journal-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as JournalCategory)}
                      className="w-full px-4 py-3 rounded-lg border text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      style={{
                        backgroundColor: 'var(--surface-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      required
                    >
                      <option value="creator-note">Creator Note</option>
                      <option value="behind-the-scenes">Behind the Scenes</option>
                      <option value="reflection">Reflection</option>
                      <option value="story-deep-dive">Story Deep Dive</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="journal-body"
                      className="block text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Your Entry <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="journal-body"
                      rows={12}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your thoughts, breakdowns, or reflections here..."
                      className="w-full px-4 py-3 rounded-lg border text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-mono leading-relaxed"
                      style={{
                        backgroundColor: 'var(--surface-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      required
                    />
                  </div>

                  {submitError && (
                    <div
                      className="p-4 rounded-lg flex items-center gap-3 border"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                      }}
                      role="alert"
                    >
                      <AlertCircle size={20} className="flex-shrink-0" />
                      <p className="text-sm">{submitError}</p>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-end gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Entry'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </Container>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
