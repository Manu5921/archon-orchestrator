/**
 * NewsletterForm React Island
 *
 * Purpose: Simple email capture form (React island for interactivity)
 * Philosophy: Design/Dev Decoupling (uses design-tokens.css variables)
 * Note: Use client:visible for better performance (loads when in viewport)
 *
 * Usage:
 * ```astro
 * ---
 * import NewsletterForm from '@/lib/astro/ui/components/forms/NewsletterForm.react';
 * ---
 *
 * <NewsletterForm
 *   client:visible
 *   endpoint="/api/newsletter"
 *   placeholder="Enter your email"
 *   submitLabel="Subscribe"
 *   inline={true}
 * />
 * ```
 */

import { useState, FormEvent } from 'react';

interface NewsletterFormProps {
  endpoint?: string;
  placeholder?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  inline?: boolean;  // Horizontal layout (email + button side-by-side)
  className?: string;
}

export default function NewsletterForm({
  endpoint = '/api/newsletter',
  placeholder = 'Enter your email',
  submitLabel = 'Subscribe',
  successMessage = 'Thanks! Check your email to confirm.',
  errorMessage = 'Something went wrong. Please try again.',
  inline = false,
  className = ''
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setStatus('loading');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
    }
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
    if (status === 'error') setStatus('idle');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`newsletter-form ${inline ? 'inline' : 'stacked'} ${className}`}
    >
      <div className="form-row">
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={`form-input ${error ? 'error' : ''}`}
            disabled={status === 'loading' || status === 'success'}
            aria-label="Email address"
          />
          {error && <span className="form-error">{error}</span>}
        </div>

        <button
          type="submit"
          className="form-submit"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <span className="spinner" />
          ) : status === 'success' ? (
            '✓'
          ) : (
            submitLabel
          )}
        </button>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="form-message success">{successMessage}</div>
      )}
      {status === 'error' && (
        <div className="form-message error">{errorMessage}</div>
      )}

      <style>{`
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 100%;
        }

        .newsletter-form.inline .form-row {
          display: flex;
          gap: var(--space-3);
        }

        .newsletter-form.stacked .form-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .form-input {
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          border: var(--border-1) solid var(--color-neutral-300);
          border-radius: var(--radius-md);
          transition: var(--transition-all);
          font-family: var(--font-body);
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error {
          border-color: var(--color-error-500);
        }

        .form-input:disabled {
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
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-all);
          white-space: nowrap;
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-submit:hover:not(:disabled) {
          background-color: var(--color-primary-700);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .form-submit:disabled {
          background-color: var(--color-success-500);
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-message {
          padding: var(--space-3) var(--space-4);
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

        @media (max-width: 640px) {
          .newsletter-form.inline .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}
