/**
 * WaitlistForm React Island
 *
 * Purpose: Waitlist signup form (email + optional name, React island)
 * Philosophy: Design/Dev Decoupling (uses design-tokens.css variables)
 * Note: Use client:visible for better performance
 *
 * Usage:
 * ```astro
 * ---
 * import WaitlistForm from '@/lib/astro/ui/components/forms/WaitlistForm.react';
 * ---
 *
 * <WaitlistForm
 *   client:visible
 *   endpoint="/api/waitlist"
 *   title="Join the Waitlist"
 *   description="Be the first to know when we launch"
 *   showNameField={true}
 *   submitLabel="Join Waitlist"
 * />
 * ```
 */

import { useState, FormEvent } from 'react';

interface WaitlistFormProps {
  endpoint?: string;
  title?: string;
  description?: string;
  showNameField?: boolean;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export default function WaitlistForm({
  endpoint = '/api/waitlist',
  title = 'Join the Waitlist',
  description = 'Be the first to know when we launch',
  showNameField = true,
  submitLabel = 'Join Waitlist',
  successMessage = 'You\'re on the list! We\'ll notify you soon.',
  errorMessage = 'Something went wrong. Please try again.',
  className = ''
}: WaitlistFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (showNameField && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
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
        setFormData({ name: '', email: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Waitlist signup error:', err);
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
    <div className={`waitlist-form-wrapper ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="form-header">
          {title && <h3 className="form-title">{title}</h3>}
          {description && <p className="form-description">{description}</p>}
        </div>
      )}

      {/* Form */}
      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="waitlist-form">
          {/* Name Field (optional) */}
          {showNameField && (
            <div className="form-group">
              <label htmlFor="waitlist-name" className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="waitlist-name"
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
          <div className="form-group">
            <label htmlFor="waitlist-email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="waitlist-email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={status === 'loading'}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <span className="spinner" />
                Joining...
              </>
            ) : (
              submitLabel
            )}
          </button>

          {/* Error Message */}
          {status === 'error' && (
            <div className="form-message error">{errorMessage}</div>
          )}
        </form>
      ) : (
        /* Success State */
        <div className="success-state">
          <div className="success-icon">✓</div>
          <p className="success-message">{successMessage}</p>
        </div>
      )}

      <style>{`
        .waitlist-form-wrapper {
          max-width: 480px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .form-title {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--color-neutral-900);
          margin-bottom: var(--space-2);
        }

        .form-description {
          font-size: var(--text-base);
          color: var(--color-neutral-600);
          line-height: var(--leading-relaxed);
        }

        .waitlist-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
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

        .form-input {
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-base);
          border: var(--border-2) solid var(--color-neutral-300);
          border-radius: var(--radius-lg);
          transition: var(--transition-all);
          font-family: var(--font-body);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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
          padding: var(--space-4) var(--space-6);
          background-color: var(--color-primary-600);
          color: white;
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition-all);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .form-submit:hover:not(:disabled) {
          background-color: var(--color-primary-700);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .form-submit:disabled {
          background-color: var(--color-primary-400);
          cursor: not-allowed;
          transform: none;
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

        .form-message.error {
          background-color: var(--color-error-500);
          color: white;
        }

        .success-state {
          text-align: center;
          padding: var(--space-8);
        }

        .success-icon {
          font-size: var(--text-6xl);
          color: var(--color-success-500);
          margin-bottom: var(--space-4);
        }

        .success-message {
          font-size: var(--text-lg);
          color: var(--color-neutral-700);
          line-height: var(--leading-relaxed);
        }

        @media (prefers-color-scheme: dark) {
          .form-title {
            color: var(--color-neutral-50);
          }

          .form-description {
            color: var(--color-neutral-400);
          }

          .form-label {
            color: var(--color-neutral-300);
          }

          .form-input {
            background-color: var(--color-neutral-800);
            border-color: var(--color-neutral-600);
            color: var(--color-neutral-100);
          }

          .form-input:focus {
            border-color: var(--color-primary-400);
          }

          .success-message {
            color: var(--color-neutral-300);
          }
        }
      `}</style>
    </div>
  );
}
