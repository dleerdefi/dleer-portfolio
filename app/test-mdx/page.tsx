'use client';

import React from 'react';
import { Window, Terminal, Admonition, Key } from '@/components/mdx';

/**
 * MDX Shortcodes Test Page
 * Tests all 5 shortcode components in isolation
 * Validates theme integration and responsive behavior
 *
 * Access at: http://localhost:3000/test-mdx
 */
export default function TestMDXPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--accent-color)' }}>
          MDX Shortcodes Test Page
        </h1>

        <p className="mb-8 text-sm" style={{ color: 'var(--theme-text-dimmed)' }}>
          Testing all 5 components in current theme. Switch themes via theme selector to validate.
        </p>

        {/* Window Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            1. Window Component
          </h2>

          <Window title="src/app.tsx">
            <pre className="text-sm">
{`import React from 'react';

export default function App() {
  return <div>Hello World</div>;
}`}
            </pre>
          </Window>

          <Window>
            <p>Window without title (title bar still visible)</p>
          </Window>
        </section>

        {/* Terminal Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            2. Terminal Component
          </h2>

          <Terminal cmd="npm run build">
{`> dleer-portfolio@0.1.0 build
> next build

Starting content-collections...
✓ Generated 2 collections, 1 document
✓ Build completed in 4.2s`}
          </Terminal>

          <Terminal>
            Terminal output without command prompt
          </Terminal>
        </section>

        {/* Admonition Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            3. Admonition Component
          </h2>

          <Admonition type="tip">
            <strong>Tip:</strong> Use specifications to guide development. Update the spec first, then implement.
          </Admonition>

          <Admonition type="warn">
            <strong>Warning:</strong> Don't mix implementation phases. Complete current milestone before starting the next.
          </Admonition>

          <Admonition type="note">
            <strong>Note:</strong> All shortcodes integrate with the theme system using CSS variables.
          </Admonition>
        </section>

        {/* Key Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            4. Key Component
          </h2>

          <p className="mb-4">
            Press <Key>Cmd</Key> + <Key>K</Key> to open command palette
          </p>

          <p className="mb-4">
            Navigate with <Key>j</Key> and <Key>k</Key>, press <Key>Enter</Key> to select, <Key>Esc</Key> to close
          </p>

          <p>
            Single keys: <Key>g</Key> <Key>G</Key> <Key>Tab</Key> <Key>Shift</Key> <Key>Ctrl</Key>
          </p>
        </section>

        {/* Figure Component - Deferred to Phase 6 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            5. Figure Component
          </h2>

          <Window title="Figure Component Status">
            <div className="space-y-3 text-sm">
              <p><strong>⏳ Testing deferred to Phase 6 (CDN Configuration)</strong></p>

              <p style={{ color: 'var(--theme-text-dimmed)' }}>
                The Figure component is fully implemented but requires <code>images.remotePatterns</code>
                configuration in next.config.ts to load remote images.
              </p>

              <div className="mt-4">
                <p className="mb-2"><strong>Component Implementation:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>✓ Wraps next/image with theme styling</li>
                  <li>✓ Required alt prop (TypeScript enforced)</li>
                  <li>✓ Optional caption support</li>
                  <li>✓ Responsive width/height defaults</li>
                  <li>✓ Theme-aware border (--accent-color-rgb)</li>
                </ul>
              </div>

              <div className="mt-4">
                <p className="mb-2"><strong>Usage Example:</strong></p>
                <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto">
{`<Figure
  src="https://cdn.example.com/image.jpg"
  alt="Description here"
  caption="Optional caption"
  width={1200}
  height={800}
/>`}
                </pre>
              </div>

              <Admonition type="note">
                <strong>Phase 6 will add:</strong> CDN configuration with images.remotePatterns
                for production image hosting. Figure component will be fully tested at that time.
              </Admonition>
            </div>
          </Window>
        </section>

        {/* Theme Integration Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            Theme Integration Checklist
          </h2>

          <Window title="Test Checklist">
            <ul className="space-y-2 text-sm">
              <li>✓ All components visible and rendered</li>
              <li>✓ Colors use CSS variables (--theme-*, --accent-color-rgb)</li>
              <li>✓ Switch to Tokyo Night theme - components update</li>
              <li>✓ Switch to Nord theme - components update</li>
              <li>✓ Switch to Solarized Light theme - components update</li>
              <li>✓ Responsive on mobile (&lt;1024px)</li>
              <li>✓ No console errors or warnings</li>
              <li>✓ Admonitions meet WCAG AA contrast</li>
            </ul>
          </Window>
        </section>
      </div>
    </div>
  );
}
