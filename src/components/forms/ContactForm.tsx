'use client';

import { useState, FormEvent } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setUnavailableMessage(null);

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data?.unavailable) {
        setUnavailableMessage(data.message);
      } else if (response.ok && data?.success) {
        setSuccessMessage(data.message || 'Your message has been received.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ form: data?.message || 'Failed to submit contact message. Please try again.' });
      }
    } catch {
      setErrors({ form: 'Network error. Your message has been preserved—please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  return (
    <div className="contact-form-container">
      {successMessage && (
        <div
          className="contact-form-success mb-6 p-4 rounded-lg flex items-start gap-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {unavailableMessage && (
        <div
          className="contact-form-unavailable mb-6 p-4 rounded-lg flex items-start gap-3 border border-amber-500/30 bg-amber-500/10 text-amber-300"
          role="status"
          aria-live="polite"
        >
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{unavailableMessage}</p>
        </div>
      )}

      {errors.form && (
        <div
          className="mb-6 p-4 rounded-lg flex items-start gap-3 border border-[var(--accent-red)] bg-red-950/20 text-red-300"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            disabled={isSubmitting}
            value={formData.subject}
            onChange={handleChange}
            className="form-input"
            aria-required="true"
            aria-invalid={!!errors.subject}
          />
          {errors.subject && <span className="form-error">{errors.subject}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            disabled={isSubmitting}
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="form-textarea"
            aria-required="true"
            aria-invalid={!!errors.message}
          />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="form-submit disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
