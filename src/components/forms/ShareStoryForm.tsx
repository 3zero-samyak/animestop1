'use client';

import { useState, FormEvent } from 'react';

export default function ShareStoryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    animeTitle: '',
    story: '',
    meaning: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.animeTitle.trim()) {
      newErrors.animeTitle = 'Anime or story title is required';
    }

    if (!formData.story.trim()) {
      newErrors.story = 'Please describe the scene, moment or idea';
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = 'Please share why it matters to you';
    }

    if (!formData.consent) {
      newErrors.consent = 'Please acknowledge the submission terms';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
          Story submissions will be enabled when the approved communication service is connected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="animeTitle" className="form-label">
          Anime or story title
        </label>
        <input
          type="text"
          id="animeTitle"
          name="animeTitle"
          value={formData.animeTitle}
          onChange={handleChange}
          className="form-input"
          aria-required="true"
          aria-invalid={!!errors.animeTitle}
        />
        {errors.animeTitle && <span className="form-error">{errors.animeTitle}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="story" className="form-label">
          Scene, moment or idea
        </label>
        <textarea
          id="story"
          name="story"
          value={formData.story}
          onChange={handleChange}
          rows={5}
          className="form-textarea"
          aria-required="true"
          aria-invalid={!!errors.story}
        />
        {errors.story && <span className="form-error">{errors.story}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="meaning" className="form-label">
          Why it matters to you
        </label>
        <textarea
          id="meaning"
          name="meaning"
          value={formData.meaning}
          onChange={handleChange}
          rows={5}
          className="form-textarea"
          aria-required="true"
          aria-invalid={!!errors.meaning}
        />
        {errors.meaning && <span className="form-error">{errors.meaning}</span>}
      </div>

      <div className="form-field form-checkbox-field">
        <label htmlFor="consent" className="form-checkbox-label">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="form-checkbox"
            aria-required="true"
            aria-invalid={!!errors.consent}
          />
          <span>
            I understand that submitting an idea does not guarantee publication or production.
          </span>
        </label>
        {errors.consent && <span className="form-error">{errors.consent}</span>}
      </div>

      <button type="submit" className="form-submit">
        Share Story
      </button>
    </form>
  );
}
