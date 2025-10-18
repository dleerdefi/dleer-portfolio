import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

export default function Contact() {
  const contactMethods = [
    {
      label: "Email",
      value: "david@example.com",
      href: "mailto:david@example.com",
      primary: true
    },
    {
      label: "GitHub",
      value: "github.com/dleer",
      href: "https://github.com/dleer"
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/dleer",
      href: "https://linkedin.com/in/dleer"
    },
    {
      label: "Twitter/X",
      value: "@dleer",
      href: "https://twitter.com/dleer"
    },
    {
      label: "Telegram",
      value: "@dleer",
      href: "https://t.me/dleer"
    }
  ];

  const availability = [
    "DeFi protocol consulting",
    "Token economics design",
    "Smart contract audits",
    "Knowledge graph integration",
    "Technical advisory"
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 bg-bg-secondary">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-text-secondary max-w-3xl">
          Open to collaborating on innovative DeFi protocols, token economics design,
          and knowledge graph applications. Let&apos;s build something amazing together.
        </p>
      </Section>

      {/* Contact Methods */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <Card key={method.label} hover={true}>
                  <a
                    href={method.href}
                    target={method.label !== "Email" ? "_blank" : undefined}
                    rel={method.label !== "Email" ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-text-muted mb-1">{method.label}</div>
                        <div className={`${method.primary ? 'text-accent-primary' : 'text-text-primary'} font-medium`}>
                          {method.value}
                        </div>
                      </div>
                      {method.primary && (
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--theme-bg)' }}>Primary</span>
                      )}
                    </div>
                  </a>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Available For</h2>
            <Card hover={false}>
              <ul className="space-y-3">
                {availability.map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="text-accent-secondary mr-3">•</span>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card hover={false} className="mt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Response Time</h3>
              <p className="text-text-secondary">
                Typically respond within 48 hours for general inquiries.
                Faster response for urgent security matters.
              </p>
              <div className="mt-4">
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(var(--theme-text-rgb), 0.1)', color: 'var(--theme-text)' }}>Time Zone: PST (UTC-8)</span>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Contact Form Placeholder */}
      <Section className="bg-bg-secondary">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Send a Message</h2>
        <Card className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary"
                placeholder="Project collaboration, consulting, etc."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-accent-primary text-bg-primary px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-all"
              >
                Send Message
              </button>
            </div>
          </form>
        </Card>
      </Section>

      {/* Security Notice */}
      <Section>
        <Card className="text-center">
          <p className="text-sm text-text-muted">
            For sensitive communications, encrypted email preferred. PGP key available upon request.
          </p>
        </Card>
      </Section>
    </>
  );
}