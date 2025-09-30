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

        <button
          type="submit"
          className="px-6 py-2 rounded font-medium transition-all"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--theme-bg)'
          }}
        >
          Send Message
        </button>
      </form>

      {/* Social Links */}
      <div className="pt-4 border-t" style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--theme-info)' }}>
          Connect
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--theme-info)' }}>📧</span>
            <a
              href={`mailto:${personal.email}`}
              style={{ color: 'var(--accent-color)' }}
              className="hover:underline"
            >
              {personal.email}
            </a>
          </div>
          {githubLink && (
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--theme-info)' }}>🔗</span>
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-color)' }}
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
          )}
          {linkedinLink && (
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--theme-info)' }}>💼</span>
              <a
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-color)' }}
                className="hover:underline"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};