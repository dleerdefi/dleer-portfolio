'use client';

import React, { useState } from 'react';

const ContactTile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-4">
      <div className="text-term-text-dim text-sm">
        <p>$ ./contact.sh --interactive</p>
        <p className="mt-2 text-tokyo-green">Starting interactive contact session...</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-term-text-dim text-sm mb-1">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-term-bg border border-term-border px-3 py-2 text-term-text font-mono text-sm focus:outline-none focus:border-tokyo-blue"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-term-text-dim text-sm mb-1">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-term-bg border border-term-border px-3 py-2 text-term-text font-mono text-sm focus:outline-none focus:border-tokyo-blue"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-term-text-dim text-sm mb-1">Message:</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full bg-term-bg border border-term-border px-3 py-2 text-term-text font-mono text-sm focus:outline-none focus:border-tokyo-blue resize-none"
            placeholder="Your message here..."
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-tokyo-blue text-term-bg font-mono text-sm hover:bg-tokyo-purple transition-colors"
        >
          ./send_message
        </button>
      </form>

      <div className="pt-4 border-t border-term-border space-y-2">
        <p className="text-tokyo-yellow text-sm font-bold">## Quick Links</p>
        <div className="space-y-1 text-sm">
          <a
            href="https://github.com/dleer"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-term-text hover:text-tokyo-orange transition-colors"
          >
            <span className="text-tokyo-blue">$</span> git remote add github
          </a>
          <a
            href="https://linkedin.com/in/dleer"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-term-text hover:text-tokyo-orange transition-colors"
          >
            <span className="text-tokyo-blue">$</span> ln -s linkedin
          </a>
          <a
            href="mailto:david@example.com"
            className="block text-term-text hover:text-tokyo-orange transition-colors"
          >
            <span className="text-tokyo-blue">$</span> mail -s "Hello"
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactTile;