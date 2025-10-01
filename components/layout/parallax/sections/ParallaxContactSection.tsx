import React from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
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
  socialLinks,
  personal
}) => {
  const githubLink = socialLinks.find(link => link.platform === 'GitHub');
  const linkedinLink = socialLinks.find(link => link.platform === 'LinkedIn');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Message sent! (This is a demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
        Contact
      </h2>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded px-3 py-2 text-sm transition-colors"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
            }}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded px-3 py-2 text-sm transition-colors"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
            }}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
            Message
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            className="w-full rounded px-3 py-2 text-sm resize-none transition-colors"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
            }}
            placeholder="Your message..."
          />
        </div>
      </form>

      {/* Submit Button - Outside form to control spacing */}
      <button
        type="submit"
        form="contact-form"
        className="px-6 py-2 rounded font-medium transition-all"
        style={{
          backgroundColor: 'var(--accent-color)',
          color: 'var(--theme-bg)',
          marginTop: '24px'
        }}
        onClick={(e) => {
          e.preventDefault();
          const form = e.currentTarget.closest('div')?.querySelector('form');
          if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
          }
        }}
      >
        Send Message
      </button>

      {/* Social Links - Horizontal SVG Icons */}
      <div className="mt-8">
        <div className="flex gap-6 justify-center items-center">
          {/* Email Icon */}
          <a
            href={`mailto:${personal.email}`}
            className="transition-all hover:scale-110"
            style={{ color: 'var(--accent-color)' }}
            aria-label="Email"
            title={personal.email}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>

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
  );
};