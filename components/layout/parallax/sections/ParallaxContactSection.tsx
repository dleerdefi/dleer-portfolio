import React, { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { useContactFormValidation } from '@/hooks/useContactFormValidation';

interface FormData {
  name: string;
  email: string;
  message: string;
  website?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface PersonalInfo {
  email: string;
}

interface ParallaxContactSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  socialLinks: SocialLink[];
  personal: PersonalInfo;
}

/**
 * Contact section component for parallax layout
 * Includes contact form and social links
 */
export const ParallaxContactSection: React.FC<ParallaxContactSectionProps> = ({
  formData,
  setFormData,
  socialLinks
}) => {
  const [formRenderTime] = useState(new Date().toISOString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Contact form validation
  const { errors, validateAll, handleFieldBlur, clearErrors } = useContactFormValidation({
    maxMessageLength: 5000
  });

  const githubLink = socialLinks.find(link => link.platform === 'GitHub');
  const linkedinLink = socialLinks.find(link => link.platform === 'LinkedIn');
  const twitterLink = socialLinks.find(link => link.platform === 'Twitter');

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
    <div className="space-y-6">
      {/* Contact section wrapper - no glass morphism */}
      <div className="p-8 space-y-6">
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--accent-color)' }}
        >
          Contact
        </h2>

        {/* Contact Form */}
        <form id="contact-form-mobile" onSubmit={handleSubmit}>
        {/* Honeypot field - hidden from users, visible to bots */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <label htmlFor="website-mobile" aria-hidden="true">
            Website (leave blank)
          </label>
          <input
            type="text"
            id="website-mobile"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <FormField
          label="Name"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          onBlur={() => handleFieldBlur('name', formData.name)}
          error={errors.name}
          required
          placeholder="Your name"
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          onBlur={() => handleFieldBlur('email', formData.email)}
          error={errors.email}
          required
          placeholder="your.email@example.com"
        />

        <FormField
          label="Message"
          type="textarea"
          value={formData.message}
          onChange={(value) => setFormData({ ...formData, message: value })}
          onBlur={() => handleFieldBlur('message', formData.message)}
          error={errors.message}
          required
          rows={5}
          maxLength={5000}
          showCharCount
          placeholder="Your message..."
        />
      </form>

      {/* Submit Button - Outside form to control spacing */}
      <div style={{ display: 'inline-block', minWidth: '150px' }}>
        <button
          type="submit"
          form="contact-form-mobile"
          disabled={isSubmitting}
          className="px-6 py-2 rounded font-medium text-sm"
          style={{
            backgroundColor: isSubmitting
              ? 'rgba(var(--accent-color-rgb), 0.5)'
              : 'var(--accent-color)',
            color: 'var(--theme-bg)',
            marginTop: '24px',
            fontWeight: '600',
            width: '100%',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            border: 'none',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'transform 0.1s ease, opacity 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
          onMouseDown={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="mt-4" style={{ color: 'var(--theme-success)' }}>
          ✓ Message sent successfully!
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="mt-4" style={{ color: 'var(--theme-error)' }}>
          ✗ {submitError}
        </div>
      )}

      {/* Social Links - Horizontal SVG Icons */}
      <div className="mt-8">
        <div className="flex gap-6 justify-center items-center">
          {/* Twitter/X Icon */}
          {twitterLink && (
            <a
              href={twitterLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
              style={{ color: 'var(--accent-color)' }}
              aria-label="Twitter/X"
              title="Twitter/X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}

          {/* GitHub Icon */}
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
              style={{ color: 'var(--accent-color)' }}
              aria-label="GitHub"
              title="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}

          {/* LinkedIn Icon */}
          {linkedinLink && (
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
              style={{ color: 'var(--accent-color)' }}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};