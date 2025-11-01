/**
 * ContactForm React Island
 *
 * Purpose: Full contact form with validation (React island for interactivity)
 * Philosophy: Design/Dev Decoupling (uses design-tokens.css variables)
 * Note: Use client:load in Astro for immediate interactivity
 *
 * Usage:
 * ```astro
 * ---
 * import ContactForm from '@/lib/astro/ui/components/forms/ContactForm.react';
 * ---
 *
 * <ContactForm
 *   client:load
 *   endpoint="/api/contact"
 *   fields={['name', 'email', 'company', 'message']}
 *   submitLabel="Send Message"
 * />
 * ```
 */

import { useState, FormEvent } from 'react';

interface ContactFormProps {
  endpoint?: string;
  fields?: Array<'name' | 'email' | 'company' | 'message' | 'phone'>;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export default function ContactForm({
  endpoint = '/api/contact',
  fields = ['name', 'email', 'company', 'message'],
  submitLabel = 'Send Message',
  successMessage = 'Thank you! We\'ll get back to you soon.',
  errorMessage = 'Something went wrong. Please try again.',
  className = ''
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (fields.includes('name') && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (fields.includes('email')) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    }

    if (fields.includes('message') && !formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('loading');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`contact-form ${className}`}>
      {/* Name Field */}
      {fields.includes('name') && (
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`form-input ${errors.name ? 'error' : ''}`}
            disabled={status === 'loading'}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
      )}

      {/* Email Field */}
      {fields.includes('email') && (
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`form-input ${errors.email ? 'error' : ''}`}
            disabled={status === 'loading'}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      )}

      {/* Company Field */}
      {fields.includes('company') && (
        <div className="form-group">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="form-input"
            disabled={status === 'loading'}
          />
        </div>
      )}

      {/* Phone Field */}
      {fields.includes('phone') && (
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="form-input"
            disabled={status === 'loading'}
          />
        </div>
      )}

      {/* Message Field */}
      {fields.includes('message') && (
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message <span className="required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`form-textarea ${errors.message ? 'error' : ''}`}
            disabled={status === 'loading'}
          />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="form-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : submitLabel}
      </button>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="form-message success">{successMessage}</div>
      )}
      {status === 'error' && (
        <div className="form-message error">{errorMessage}</div>
      )}

      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          max-width: 100%;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-label {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-neutral-700);
        }

        .required {
          color: var(--color-error-500);
        }

        .form-input,
        .form-textarea {
          padding: var(--space-3);
          font-size: var(--text-base);
          border: var(--border-1) solid var(--color-neutral-300);
          border-radius: var(--radius-md);
          transition: var(--transition-all);
          font-family: var(--font-body);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error,
        .form-textarea.error {
          border-color: var(--color-error-500);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          background-color: var(--color-neutral-100);
          cursor: not-allowed;
        }

        .form-error {
          font-size: var(--text-sm);
          color: var(--color-error-500);
        }

        .form-submit {
          padding: var(--space-3) var(--space-6);
          background-color: var(--color-primary-600);
          color: white;
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition-all);
        }

        .form-submit:hover:not(:disabled) {
          background-color: var(--color-primary-700);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .form-submit:disabled {
          background-color: var(--color-neutral-400);
          cursor: not-allowed;
          transform: none;
        }

        .form-message {
          padding: var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
        }

        .form-message.success {
          background-color: var(--color-success-500);
          color: white;
        }

        .form-message.error {
          background-color: var(--color-error-500);
          color: white;
        }
      `}</style>
    </form>
  );
}
