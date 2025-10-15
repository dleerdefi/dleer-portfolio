'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { useContactFormValidation } from '@/hooks/useContactFormValidation';
import { useUIStrings } from '@/lib/config';

/**
 * Contact content component
 * Handles contact form with validation and submission
 */
const ContactContentComponent: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [formRenderTime] = useState(new Date().toISOString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const uiStrings = useUIStrings();

  // Contact form validation
  const { errors, validateAll, handleFieldBlur, clearErrors } = useContactFormValidation({
    maxMessageLength: 5000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const { isValid } = validateAll(formData);
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website || '',
          timestamp: formRenderTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '', website: '' });
      clearErrors();

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 1.5rem + 3cqi, 1.75rem)' }}>{uiStrings.headers.contact}</h1>

      <form onSubmit={handleSubmit}>
        {/* Honeypot field - hidden from users, visible to bots */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <label htmlFor="website" aria-hidden="true">
            Website (leave blank)
          </label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <FormField
          label={uiStrings.labels.name}
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          onBlur={() => handleFieldBlur('name', formData.name)}
          error={errors.name}
          required
          placeholder={uiStrings.placeholders.name}
        />

        <FormField
          label={uiStrings.labels.email}
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          onBlur={() => handleFieldBlur('email', formData.email)}
          error={errors.email}
          required
          placeholder={uiStrings.placeholders.email}
        />

        <FormField
          label={uiStrings.labels.message}
          type="textarea"
          value={formData.message}
          onChange={(value) => setFormData({ ...formData, message: value })}
          onBlur={() => handleFieldBlur('message', formData.message)}
          error={errors.message}
          required
          rows={4}
          maxLength={5000}
          showCharCount
          placeholder={uiStrings.placeholders.message}
        />

        <div style={{ marginTop: '12px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="touch-target touch-feedback px-4 py-2 rounded transition-all duration-200 block w-auto"
            style={{
              backgroundColor: isSubmitting
                ? 'rgba(var(--accent-color-rgb), 0.5)'
                : 'var(--accent-color)',
              color: 'var(--theme-bg)',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            {isSubmitting ? 'Sending...' : uiStrings.buttons.sendMessage}
          </button>
        </div>

        {/* Success message */}
        {submitSuccess && (
          <div style={{ color: 'var(--theme-success)', fontSize: 'clamp(11px, 2cqw, 18px)', marginTop: '12px' }}>
            ✓ Message sent successfully!
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div style={{ color: 'var(--theme-error)', fontSize: 'clamp(11px, 2cqw, 18px)', marginTop: '12px' }}>
            ✗ {submitError}
          </div>
        )}
      </form>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const ContactContent = React.memo(ContactContentComponent);