'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/AuthProvider';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getMySubmissions, type MySubmission } from '@/lib/submissions';

function formatSubmissionDate(createdAt: MySubmission['createdAt']): string {
  if (!createdAt) {
    return 'Date unavailable';
  }

  return createdAt.toDate().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSubmissionStatus(status: MySubmission['status']): string {
  return status.toUpperCase();
}

function formatSubmissionType(type: MySubmission['type']): string {
  return type.toUpperCase();
}

export default function AccountSubmissionsPage() {
  const { user, loading } = useAuth();
  const [submissions, setSubmissions] = React.useState<MySubmission[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSubmissions = async (uid: string) => {
    await Promise.resolve();
    setError(null);

    try {
      const result = await getMySubmissions(uid);
      setSubmissions(result);
    } catch (err) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const submissionError = err as { code?: string; message?: string };
        console.error(`[My submissions] code: ${submissionError.code ?? 'unknown'}`);
        console.error(`[My submissions] message: ${submissionError.message ?? 'Unknown Firebase error'}`);
      }
      setError('We couldn\'t load your submissions. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    if (loading) return;

    if (!user?.uid) {
      window.setTimeout(() => setFetching(false), 0);
      return;
    }

    let mounted = true;

    const timer = window.setTimeout(() => {
      (async () => {
        setError(null);
        try {
          setFetching(true);
          const result = await getMySubmissions(user.uid);
          if (!mounted) return;
          setSubmissions(result);
          } catch (err) {
          if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
            const submissionError = err as { code?: string; message?: string };
            console.error(`[My submissions] code: ${submissionError.code ?? 'unknown'}`);
            console.error(`[My submissions] message: ${submissionError.message ?? 'Unknown Firebase error'}`);
          }
          if (!mounted) return;
          setError('We couldn\'t load your submissions. Please try again.');
        } finally {
          if (!mounted) return;
          setFetching(false);
        }
      })();
    }, 0);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, [loading, user?.uid]);

  return (
    <>
      <Header />
      <ProtectedRoute
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Loading your submissions...</p>
            </div>
          </main>
        }
      >
        <main className="auth-page">
          <div className="account-page-container">
            <h1 className="account-page-title">My Submissions</h1>

            {fetching ? (
              <section className="account-section">
                <p className="account-section-desc">Loading your submissions...</p>
              </section>
            ) : error ? (
              <section className="account-section">
                <p className="account-error">{error}</p>
                <div className="account-button-group">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user?.uid) {
                        return;
                      }

                      setFetching(true);
                      void loadSubmissions(user.uid);
                    }}
                    className="account-button account-button-primary"
                  >
                    RETRY
                  </button>
                  <button
                    type="button"
                    onClick={() => history.back()}
                    className="account-button account-button-secondary"
                  >
                    BACK
                  </button>
                </div>
              </section>
            ) : submissions.length === 0 ? (
              <section className="account-section">
                <h2 className="account-section-title">NO SUBMISSIONS YET</h2>
                <p className="account-section-desc">
                  Your Story and Journal submissions will appear here after you send them.
                </p>
                <div className="account-button-group">
                  <Link href="/share-story" className="account-button account-button-primary">
                    SHARE YOUR STORY
                  </Link>
                  <Link href="/journal/write" className="account-button account-button-secondary">
                    WRITE JOURNAL
                  </Link>
                </div>
              </section>
            ) : (
              <section className="account-section">
                <div className="account-submissions">
                  {submissions.map((submission) => (
                    <article key={`${submission.type}-${submission.id}`} className="submission-card">
                      <header className="submission-card-header">
                        <div className="submission-card-type">{formatSubmissionType(submission.type)}</div>
                        <div className={`submission-badge submission-badge--${submission.status}`}>
                          {formatSubmissionStatus(submission.status)}
                        </div>
                      </header>

                      <h3 className="submission-card-title">{submission.title}</h3>

                      <div className="submission-card-meta">
                        <time className="submission-card-date">{formatSubmissionDate(submission.createdAt)}</time>
                      </div>

                      {submission.type === 'story' && submission.status === 'rejected' && submission.rejectionReason && (
                        <div className="submission-card-body">
                          <p className="submission-body-text">
                            <strong>Rejection reason:</strong> {submission.rejectionReason}
                          </p>
                          <p className="submission-body-text">
                            You can revise your Story and submit a new version when you are ready.
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}