'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/AuthProvider';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { isAdminUser } from '@/lib/admin';
import {
  getModerationSubmissions,
  type ModerationSubmission,
  updateSubmissionStatus,
  type ModerationTargetStatus,
} from '@/lib/submissions';

type ModerationFilter = 'all' | 'submitted' | 'approved' | 'rejected' | 'published';

function formatModerationDate(timestamp: ModerationSubmission['createdAt']): string {
  if (!timestamp) {
    return 'Date unavailable';
  }

  return timestamp.toDate().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatStatus(status: ModerationSubmission['status']): string {
  return status.toUpperCase();
}

function formatType(type: ModerationSubmission['type']): string {
  return type.toUpperCase();
}

export default function AdminSubmissionsPage() {
  const { user, loading } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [submissions, setSubmissions] = React.useState<ModerationSubmission[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<ModerationFilter>('all');
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [rejectingId, setRejectingId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const loadModerationSubmissions = React.useCallback(async () => {
    setFetching(true);
    setError(null);

    try {
      const result = await getModerationSubmissions();
      setSubmissions(result);
    } catch (err) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const moderationError = err as { code?: string; message?: string };
        console.error(`[Moderation] code: ${moderationError.code ?? 'unknown'}`);
        console.error(`[Moderation] message: ${moderationError.message ?? 'Unknown Firebase error'}`);
      }
      setError('We couldn\'t load moderation submissions. Please try again.');
    } finally {
      setFetching(false);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      if (loading) {
        return;
      }

      if (!user?.uid) {
        if (mounted) {
          setCheckingAdmin(false);
          setIsAdmin(false);
        }
        return;
      }

      const admin = await isAdminUser(user.uid);
      if (!mounted) {
        return;
      }

      setIsAdmin(admin);
      setCheckingAdmin(false);
    };

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [loading, user]);

  React.useEffect(() => {
    if (loading || checkingAdmin || !isAdmin) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadModerationSubmissions();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [checkingAdmin, isAdmin, loadModerationSubmissions, loading]);

  const handleModerationAction = async (
    submission: ModerationSubmission,
    targetStatus: ModerationTargetStatus,
    reason?: string,
  ) => {
    const needsConfirmation = targetStatus === 'published'
      ? window.confirm('Publishing will make this submission publicly readable. Continue?')
      : targetStatus === 'rejected'
        ? window.confirm('Rejecting this submission is final in this stage. Continue?')
        : true;

    if (!needsConfirmation) {
      return;
    }

    setPendingId(submission.id);
    setError(null);

    try {
      await updateSubmissionStatus(submission.type, submission.id, submission.status, {
        targetStatus,
        rejectionReason: reason,
      });
      setSubmissions((current) => current.map((item) => (
        item.id === submission.id && item.type === submission.type
          ? { ...item, status: targetStatus, rejectionReason: targetStatus === 'rejected' ? reason?.trim() ?? null : item.rejectionReason }
          : item
      )));
      if (targetStatus === 'rejected') {
        setRejectingId(null);
        setRejectionReason('');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const moderationError = err as { code?: string; message?: string };
        console.error(`[Moderation] code: ${moderationError.code ?? 'unknown'}`);
        console.error(`[Moderation] message: ${moderationError.message ?? 'Unknown Firebase error'}`);
      }
      setError('We couldn\'t update this submission. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  const handleRejectRequest = (submission: ModerationSubmission) => {
    setRejectingId(submission.id);
    setRejectionReason(submission.rejectionReason ?? '');
    setError(null);
  };

  const handleRejectCancel = () => {
    setRejectingId(null);
    setRejectionReason('');
  };

  const filteredSubmissions = submissions.filter((submission) => filter === 'all' || submission.status === filter);

  return (
    <>
      <Header />
      <ProtectedRoute
        loadingComponent={
          <main className="share-story-loading">
            <div className="share-story-loading-content">
              <p>Checking your account...</p>
            </div>
          </main>
        }
      >
        <main className="auth-page">
          <div className="account-page-container">
            <h1 className="account-page-title">Admin Moderation</h1>

            {checkingAdmin ? (
              <section className="account-section">
                <p className="account-section-desc">Checking admin access...</p>
              </section>
            ) : !isAdmin ? (
              <section className="account-section">
                <h2 className="account-section-title">ACCESS DENIED</h2>
                <p className="account-section-desc">
                  This area is available only to AnimeStop administrators.
                </p>
                <Link href="/account" className="account-button account-button-secondary">
                  BACK TO ACCOUNT
                </Link>
              </section>
            ) : fetching ? (
              <section className="account-section">
                <p className="account-section-desc">Loading moderation submissions...</p>
              </section>
            ) : error ? (
              <section className="account-section">
                <p className="account-error">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadModerationSubmissions()}
                  className="account-button account-button-primary"
                >
                  RETRY
                </button>
              </section>
            ) : (
              <>
                <section className="account-section">
                  <h2 className="account-section-title">Filters</h2>
                  <div className="account-button-group">
                    {(['all', 'submitted', 'approved', 'rejected', 'published'] as ModerationFilter[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFilter(value)}
                        className={value === filter ? 'account-button account-button-primary' : 'account-button account-button-secondary'}
                      >
                        {value.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </section>

                {filteredSubmissions.length === 0 ? (
                  <section className="account-section">
                    <h2 className="account-section-title">NO SUBMISSIONS TO REVIEW</h2>
                  </section>
                ) : (
                  <section className="account-section">
                    <div className="account-submissions">
                      {filteredSubmissions.map((submission) => {
                        const isUpdating = pendingId === submission.id;
                        const isRejecting = rejectingId === submission.id;
                        const canPublishStory = submission.type !== 'story'
                          || (submission.requestedVisibility === 'public' && submission.publicationConsent === true);

                        return (
                          <article key={`${submission.type}-${submission.id}`} className="submission-card submission-card--admin">
                            <header className="submission-card-header">
                              <div className="submission-card-type">{formatType(submission.type)}</div>
                              <div className={`submission-badge submission-badge--${submission.status}`}>
                                {formatStatus(submission.status)}
                              </div>
                            </header>

                            <h3 className="submission-card-title">{submission.title}</h3>

                            <div className="submission-card-meta submission-card-meta--expanded">
                              <div className="submission-meta-row">
                                <span className="meta-label">Category:</span>
                                <span className="meta-value">{submission.category}</span>
                              </div>
                              <div className="submission-meta-row">
                                <span className="meta-label">Author:</span>
                                <span className="meta-value">{submission.userDisplayName || 'Anonymous'}</span>
                              </div>
                              <div className="submission-meta-row">
                                <span className="meta-label">Submitted:</span>
                                <time className="meta-value">{formatModerationDate(submission.createdAt)}</time>
                              </div>
                            </div>

                            <div className="submission-card-body">
                              <p className="submission-body-text">{submission.body}</p>

                              {submission.type === 'story' && typeof submission.intent === 'string' && (
                                <div className="submission-card-extra">
                                  <div><strong>Author purpose:</strong> {submission.storyIntent || submission.intent}</div>
                                  <div><strong>Requested visibility:</strong> {submission.requestedVisibility || 'Legacy / not specified'}</div>
                                  <div><strong>Publication consent:</strong> {submission.publicationConsent === true ? 'Granted' : 'Not verifiable'}</div>
                                  <div><strong>Legacy intent:</strong> {submission.intent || 'Not set'}</div>
                                  <div><strong>Legacy community consent:</strong> {submission.communityConsent ? 'Yes' : 'No'}</div>
                                </div>
                              )}

                              {submission.status === 'rejected' && submission.rejectionReason && (
                                <div className="submission-card-extra">
                                  <div><strong>Rejection reason:</strong> {submission.rejectionReason}</div>
                                </div>
                              )}
                            </div>

                            {(submission.status === 'submitted' || submission.status === 'approved') && (
                              <div className="account-button-group submission-card-actions">
                                {submission.status === 'submitted' && (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void handleModerationAction(submission, 'approved')}
                                    className="account-button account-button-primary"
                                  >
                                    {isUpdating ? 'UPDATING...' : 'APPROVE'}
                                  </button>
                                )}
                                {submission.status === 'approved' && canPublishStory && (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void handleModerationAction(submission, 'published')}
                                    className="account-button account-button-primary"
                                  >
                                    {isUpdating ? 'UPDATING...' : 'PUBLISH'}
                                  </button>
                                )}
                                {submission.status === 'approved' && !canPublishStory && submission.type === 'story' && (
                                  <p className="account-section-desc">
                                    This Story cannot be published because the author did not submit a verifiable public-publication request and consent.
                                  </p>
                                )}
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleRejectRequest(submission)}
                                  className="account-button account-button-secondary"
                                >
                                  {isUpdating ? 'UPDATING...' : 'REJECT'}
                                </button>
                              </div>
                            )}

                            {isRejecting && (
                              <div className="submission-card-body">
                                <label htmlFor={`reject-reason-${submission.id}`} className="share-story-label">
                                  REJECTION REASON <span aria-hidden="true">*</span>
                                </label>
                                <textarea
                                  id={`reject-reason-${submission.id}`}
                                  value={rejectionReason}
                                  onChange={(event) => setRejectionReason(event.target.value)}
                                  className="story-editor"
                                  placeholder="Explain clearly what the author should change before submitting again..."
                                />
                                <div className="account-button-group submission-card-actions">
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => void handleModerationAction(submission, 'rejected', rejectionReason)}
                                    className="account-button account-button-primary"
                                  >
                                    {isUpdating ? 'UPDATING...' : 'CONFIRM REJECTION'}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={handleRejectCancel}
                                    className="account-button account-button-secondary"
                                  >
                                    CANCEL
                                  </button>
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}