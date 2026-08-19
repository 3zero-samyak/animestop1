'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from 'firebase/auth';
import ScrollReveal from '@/components/animation/ScrollReveal';

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
  intent: string;
  communityConsent: boolean;
  updatedAt: string;
}

interface StorySubmission extends StoryDraft {
  id: string;
  submittedAt: string;
  status: string;
}

const DRAFT_KEY = 'animestop-story-draft';
const SUBMISSIONS_KEY = 'animestop-story-submissions';

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

const INTENT_OPTIONS = [
  { value: 'private', label: 'Keep it private for the AnimeStop team' },
  { value: 'inspiration', label: 'Consider it as inspiration for a future build' },
  { value: 'community', label: 'Share it with the AnimeStop community' },
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
  const [intent, setIntent] = useState('private');
  const [communityConsent, setCommunityConsent] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSaveStatus, setDraftSaveStatus] = useState('');

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
        intent,
        communityConsent,
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
    setIntent(savedDraft.intent || 'private');
    setCommunityConsent(savedDraft.communityConsent || false);
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
  }, [title, category, body, intent, communityConsent, user, submitted, draftChecked]);

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

    if (!intent) {
      newErrors.intent = 'Please select what you would like us to do with this story';
    }

    if (intent === 'community' && !communityConsent) {
      newErrors.consent = 'Please confirm you understand this story will be reviewed before publication';
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first invalid field
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstError);
      element?.focus();
      return;
    }

    if (!user) return;

    // Save submission locally (since no backend exists yet)
    try {
      const submission: StorySubmission = {
        id: crypto.randomUUID(),
        userId: user.email || '',
        authorName: user.displayName || undefined,
        authorEmail: user.email || '',
        title,
        category,
        body,
        intent,
        communityConsent,
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        status: 'submitted-locally',
      };

      // Get existing submissions
      const existingRaw = localStorage.getItem(SUBMISSIONS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(submission);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));

      // Clear draft
      localStorage.removeItem(DRAFT_KEY);

      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Unable to save your story. Please try again.' });
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
            <h1 className="share-story-success-title">STORY RECEIVED</h1>
            <p className="share-story-success-text">
              Thank you for sharing this moment with AnimeStop.
            </p>
            <p className="share-story-success-text">
              Your story has been saved successfully.
            </p>
            <p className="share-story-success-note">
              Your story is currently saved on this device. Online submission will be connected when the publishing system is available.
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
                  setIntent('private');
                  setCommunityConsent(false);
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
            <p className="share-story-label">
              WHAT WOULD YOU LIKE US TO DO WITH THIS STORY? <span aria-hidden="true">*</span>
            </p>
            <div className="story-intent-options">
              {INTENT_OPTIONS.map((option) => (
                <label key={option.value} className="story-intent-option">
                  <input
                    type="radio"
                    name="intent"
                    value={option.value}
                    checked={intent === option.value}
                    onChange={(e) => {
                      setIntent(e.target.value);
                      if (errors.intent) setErrors({ ...errors, intent: '' });
                      if (e.target.value !== 'community') {
                        setCommunityConsent(false);
                      }
                    }}
                    className="story-intent-radio"
                  />
                  <span className="story-intent-label">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.intent && (
              <span className="form-error" role="alert">
                {errors.intent}
              </span>
            )}
          </div>
        </ScrollReveal>

        {intent === 'community' && (
          <ScrollReveal delay={600}>
            <div className="form-field">
              <label className="story-consent-label">
                <input
                  type="checkbox"
                  checked={communityConsent}
                  onChange={(e) => {
                    setCommunityConsent(e.target.checked);
                    if (errors.consent) setErrors({ ...errors, consent: '' });
                  }}
                  className="story-consent-checkbox"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span>
                  I understand that AnimeStop may review this story before it appears publicly.
                </span>
              </label>
              {errors.consent && (
                <span id="consent-error" className="form-error" role="alert">
                  {errors.consent}
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
            >
              Submit Your Story →
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
