'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import Link from 'next/link';
import ScrollReveal from '@/components/animation/ScrollReveal';
import { submitStory, type StoryVisibility } from '@/lib/submissions';

interface ShareStoryFormProps {
  user: User | null;
}

interface StoryDraft {
  userId: string;
  authorName?: string;
  authorEmail: string;
  title: string;
  category: string;
  body: string;
  storyIntent: string;
  requestedVisibility: StoryVisibility;
  publicationConsent: boolean;
  updatedAt: string;
}

const DRAFT_KEY = 'animestop-story-draft';

const CATEGORIES = [
  'Anime',
  'Character',
  'Scene',
  'Memory',
  'Life Lesson',
  'Theory / What If',
  'Original Idea',
  'Other',
];

export default function ShareStoryForm({ user }: ShareStoryFormProps) {
  const router = useRouter();
  const [draftChecked, setDraftChecked] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [savedDraft, setSavedDraft] = useState<StoryDraft | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [storyIntent, setStoryIntent] = useState('');
  const [requestedVisibility, setRequestedVisibility] = useState<StoryVisibility>('private');
  const [publicationConsent, setPublicationConsent] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSaveStatus, setDraftSaveStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const saveDraft = (showNotification = true) => {
    if (!user) return;
    
    try {
      const draft: StoryDraft = {
        userId: user.email || '',
        authorName: user.displayName || undefined,
        authorEmail: user.email || '',
        title,
        category,
        body,
        storyIntent,
        requestedVisibility,
        publicationConsent,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      
      if (showNotification) {
        setDraftSaveStatus('Draft saved locally');
        setTimeout(() => setDraftSaveStatus(''), 3000);
      }
    } catch {}
  };

  const resumeDraft = () => {
    if (!savedDraft) return;
    
    setTitle(savedDraft.title || '');
    setCategory(savedDraft.category || '');
    setBody(savedDraft.body || '');
    setStoryIntent(savedDraft.storyIntent || '');
    setRequestedVisibility(savedDraft.requestedVisibility || 'private');
    setPublicationConsent(savedDraft.publicationConsent || false);
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setSavedDraft(null);
    setShowDraftPrompt(false);
  };

  // Check for existing draft on mount
  useEffect(() => {
    if (!user || draftChecked) return;
    
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as StoryDraft;
        if (draft.authorEmail === user.email) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSavedDraft(draft);
          setShowDraftPrompt(true);
        }
      }
    } catch {}
    
    setDraftChecked(true);
  }, [user, draftChecked]);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (!user || submitted || !draftChecked) return;
    if (!title && !category && !body) return;
    
    const timer = setTimeout(() => {
      saveDraft(false);
    }, 1000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category, body, storyIntent, requestedVisibility, publicationConsent, user, submitted, draftChecked]);

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (title.length > 120) {
      newErrors.title = 'Title must be 120 characters or less';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!body.trim() || body.length < 30) {
      newErrors.body = 'Your story must be at least 30 characters';
    }
    if (body.length > 20000) {
      newErrors.body = 'Story must be 20,000 characters or less';
    }

    if (!storyIntent.trim() || storyIntent.trim().length < 10) {
      newErrors.storyIntent = 'Please explain why you are sharing this story in at least 10 characters';
    }

    if (requestedVisibility === 'public' && !publicationConsent) {
      newErrors.publicationConsent = 'Please confirm that this story may become publicly visible on AnimeStop after approval';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstError);
      element?.focus();
      return;
    }

    if (!user) return;

    setSubmitting(true);
    setErrors({});

    try {
      await submitStory({ title, category, body, storyIntent: storyIntent.trim(), requestedVisibility, publicationConsent });

      // Clear local draft after successful remote submission
      try { localStorage.removeItem(DRAFT_KEY); } catch {}

      setSubmitted(true);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object') {
        const submissionError = err as { code?: string; message?: string };
        console.error(`[Story submit] code: ${submissionError.code ?? 'unknown'}`);
        console.error(`[Story submit] message: ${submissionError.message ?? 'Unknown Firebase error'}`);
      }

      // Narrow common Firebase error shapes safely
      type ErrWithCode = { code?: string };
      const code = (err && typeof err === 'object' && 'code' in err) ? (err as ErrWithCode).code : '';
      if (code === 'permission-denied') {
        setErrors({ submit: 'Your account is not permitted to submit this story.' });
      } else if (code === 'unavailable') {
        setErrors({ submit: 'AnimeStop is temporarily unable to accept submissions. Please try again.' });
      } else if (code === 'network-request-failed') {
        setErrors({ submit: 'Network error. Check your connection and try again.' });
      } else {
        setErrors({ submit: 'We couldn\'t submit your story. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    saveDraft(true);
  };

  if (showDraftPrompt && savedDraft) {
    return (
      <div className="share-story-page">
        <div className="share-story-draft-prompt">
          <h2 className="share-story-draft-prompt-title">You have a saved story draft.</h2>
          <p className="share-story-draft-prompt-text">
            Last updated: {new Date(savedDraft.updatedAt).toLocaleDateString()}
          </p>
          <div className="share-story-draft-prompt-actions">
            <button
              type="button"
              className="share-story-action share-story-action-primary"
              onClick={resumeDraft}
            >
              Resume Draft
            </button>
            <button
              type="button"
              className="share-story-action share-story-action-secondary"
              onClick={discardDraft}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="share-story-page">
        <ScrollReveal>
          <div className="share-story-success">
            <h1 className="share-story-success-title">STORY SUBMITTED</h1>
            <p className="share-story-success-text">
              Thank you for sharing this moment with AnimeStop.
            </p>
            <p className="share-story-success-text">
              Your story has been received and will be reviewed before it appears publicly.
            </p>
            <div className="share-story-success-actions">
              <button
                type="button"
                className="share-story-action share-story-action-primary"
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setCategory('');
                  setBody('');
                  setStoryIntent('');
                  setRequestedVisibility('private');
                  setPublicationConsent(false);
                  setErrors({});
                }}
              >
                Share Another Story
              </button>
              <button
                type="button"
                className="share-story-action share-story-action-secondary"
                onClick={() => router.push('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="share-story-page">
      <ScrollReveal delay={0}>
        <nav className="share-story-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">→</span>
          <span>Share Your Story</span>
        </nav>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <h1 className="share-story-title">SHARE YOUR STORY</h1>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <p className="share-story-subtitle">
          Some moments deserve to be remembered.<br />
          Tell us the scene, thought, emotion or idea that stayed with you.
        </p>
      </ScrollReveal>

      {user && (
        <ScrollReveal delay={300}>
          <div className="share-story-user-panel">
            <p className="share-story-user-label">Writing as</p>
            <p className="share-story-user-name">{user.displayName || 'Anonymous'}</p>
            <p className="share-story-user-email">{user.email}</p>
          </div>
        </ScrollReveal>
      )}

      <form onSubmit={handleSubmit} className="share-story-form" aria-live="polite">
        <ScrollReveal delay={400}>
          <div className="form-field">
            <label htmlFor="title" className="share-story-label">
              STORY TITLE <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Give your story a title..."
              className="story-input"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <span id="title-error" className="form-error" role="alert">
                {errors.title}
              </span>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={450}>
          <div className="form-field">
            <label htmlFor="category" className="share-story-label">
              WHAT INSPIRED THIS STORY? <span aria-hidden="true">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              className="story-input story-select"
              aria-required="true"
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span id="category-error" className="form-error" role="alert">
                {errors.category}
              </span>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={500}>
          <div className="form-field">
            <label htmlFor="body" className="share-story-label">
              YOUR STORY <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) setErrors({ ...errors, body: '' });
              }}
              placeholder="Write the moment, memory, emotion or idea that stayed with you..."
              className="story-editor"
              aria-required="true"
              aria-invalid={!!errors.body}
              aria-describedby={errors.body ? 'body-error' : undefined}
            />
            {errors.body && (
              <span id="body-error" className="form-error" role="alert">
                {errors.body}
              </span>
            )}
            <div className="story-counter" aria-live="polite" aria-atomic="true">
              {getWordCount(body)} words · {getCharCount(body)} characters
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={550}>
          <div className="form-field">
            <label htmlFor="storyIntent" className="share-story-label">
              WHY ARE YOU SHARING THIS STORY? <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="storyIntent"
              name="storyIntent"
              value={storyIntent}
              onChange={(e) => {
                setStoryIntent(e.target.value);
                if (errors.storyIntent) setErrors({ ...errors, storyIntent: '' });
              }}
              placeholder="Tell AnimeStop why this story matters to you and what you hope comes from sharing it..."
              className="story-editor story-intent-textarea"
              aria-required="true"
              aria-invalid={!!errors.storyIntent}
              aria-describedby={errors.storyIntent ? 'storyIntent-error' : undefined}
            />
            {errors.storyIntent && (
              <span id="storyIntent-error" className="form-error" role="alert">
                {errors.storyIntent}
              </span>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <div className="form-field">
            <p className="share-story-label">
              VISIBILITY PREFERENCE <span aria-hidden="true">*</span>
            </p>
            <div className="story-intent-options">
              <label className="story-intent-option">
                <input
                  type="radio"
                  name="requestedVisibility"
                  value="private"
                  checked={requestedVisibility === 'private'}
                  onChange={() => {
                    setRequestedVisibility('private');
                    setPublicationConsent(false);
                    if (errors.publicationConsent) setErrors({ ...errors, publicationConsent: '' });
                  }}
                  className="story-intent-radio"
                />
                <span className="story-intent-label">PRIVATE — only you and authorized AnimeStop admins can access this Story.</span>
              </label>
              <label className="story-intent-option">
                <input
                  type="radio"
                  name="requestedVisibility"
                  value="public"
                  checked={requestedVisibility === 'public'}
                  onChange={() => {
                    setRequestedVisibility('public');
                  }}
                  className="story-intent-radio"
                />
                <span className="story-intent-label">REQUEST PUBLICATION — AnimeStop may consider this Story for public publication after admin review.</span>
              </label>
            </div>
          </div>
        </ScrollReveal>

        {requestedVisibility === 'public' && (
          <ScrollReveal delay={600}>
            <div className="form-field">
              <label className="story-consent-label">
                <input
                  type="checkbox"
                  checked={publicationConsent}
                  onChange={(e) => {
                    setPublicationConsent(e.target.checked);
                    if (errors.publicationConsent) setErrors({ ...errors, publicationConsent: '' });
                  }}
                  className="story-consent-checkbox"
                  aria-invalid={!!errors.publicationConsent}
                  aria-describedby={errors.publicationConsent ? 'publicationConsent-error' : undefined}
                />
                <span>
                  I give AnimeStop permission to make this Story publicly visible on AnimeStop if it is approved for publication.
                </span>
              </label>
              {errors.publicationConsent && (
                <span id="publicationConsent-error" className="form-error" role="alert">
                  {errors.publicationConsent}
                </span>
              )}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={650}>
          <div className="story-actions">
            {draftSaveStatus && (
              <p className="story-draft-status" role="status" aria-live="polite">
                {draftSaveStatus}
              </p>
            )}
            <button
              type="button"
              className="share-story-action share-story-action-secondary"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="share-story-action share-story-action-primary"
              disabled={submitting}
            >
              {submitting ? 'SUBMITTING...' : 'Submit Your Story →'}
            </button>
          </div>
        </ScrollReveal>

        {errors.submit && (
          <div className="form-error" role="alert">
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
}
