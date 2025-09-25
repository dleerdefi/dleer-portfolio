'use client';

import React, { useState } from 'react';
import { ContentType } from './LayoutManager';

interface ContentViewerProps {
  content: ContentType;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const renderContent = () => {
    switch (content.type) {
      case 'home':
        return (
          <div className="space-y-6">
            <pre className="text-[#7aa2f7] text-xs opacity-90">
{`
 ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗
 ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝
 ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
`}
            </pre>
            <div className="text-[#a9b1d6]">
              <p className="text-lg mb-4 text-[#c0caf5] font-bold">
                DeFi Architect & Token Economics Designer
              </p>
              <p className="text-sm leading-relaxed text-[#a9b1d6]/90">
                Navigate through the file tree on the left to explore my portfolio.
                Each project showcases expertise in blockchain development, Neo4j knowledge graphs,
                and AI/LLM applications.
              </p>
            </div>
            <div className="text-xs text-[#565f89] mt-8">
              <p className="font-bold text-[#bb9af7]">Quick Tips:</p>
              <p className="mt-2">• Click navigation items to view content</p>
              <p>• Projects contain detailed technical information</p>
              <p>• Blog posts share insights and tutorials</p>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#7aa2f7]">// About Me</h1>

            <div className="text-[#a9b1d6] space-y-4">
              <p className="leading-relaxed">
                Greetings. I'm David Leer, a passionate web developer with a deep enthusiasm
                for building modern, performant, and aesthetically pleasing applications.
                I specialize in crafting clean, minimalist interfaces that embody the power
                and elegance of modern Linux environments.
              </p>

              <p className="leading-relaxed">
                This site serves as a live portfolio for my coding experiments. Explore my
                projects and articles via the navigation tile.
              </p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <h2 className="text-[#9ece6a] font-bold mb-3">Technical Skills</h2>
                  <ul className="space-y-1 text-sm text-[#a9b1d6]/90">
                    <li>• React & Next.js</li>
                    <li>• TypeScript & JavaScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Node.js & Python</li>
                    <li>• PostgreSQL & Neo4j</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-[#bb9af7] font-bold mb-3">Interests</h2>
                  <ul className="space-y-1 text-sm text-[#a9b1d6]/90">
                    <li>• Linux Ricing & Hyprland</li>
                    <li>• Terminal UIs</li>
                    <li>• Open Source Development</li>
                    <li>• System Architecture</li>
                    <li>• Performance Optimization</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#414868]/30">
                <h2 className="text-[#e0af68] font-bold mb-3">Current Focus</h2>
                <p className="text-sm text-[#a9b1d6]/90 leading-relaxed">
                  Currently exploring the intersection of terminal aesthetics and modern web development,
                  creating experiences that blur the line between desktop environments and web applications.
                  Always seeking new challenges that push the boundaries of what's possible in the browser.
                </p>
              </div>
            </div>
          </div>
        );

      case 'project':
        const project = (content as any).data;
        return (
          <div className="space-y-6">
            <div className="border-b border-[#414868]/30 pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{project.name}</h1>
              <p className="text-[#565f89] mt-1">{project.description}</p>
            </div>

            <div className="space-y-4 text-[#a9b1d6]">
              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">Overview</h2>
                <p className="text-sm leading-relaxed text-[#a9b1d6]/90">
                  This project demonstrates advanced development practices with
                  focus on security, efficiency, and scalability. Implemented using modern
                  development tools and following industry best practices.
                </p>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">Technical Stack</h2>
                <div className="bg-[#1a1b26] p-3 rounded-lg mt-2 border border-[#414868]/50">
                  <code className="text-[#7dcfff] text-xs font-mono">
                    {project.id === 'defi-lending' && 'Solidity, Hardhat, OpenZeppelin, Chainlink'}
                    {project.id === 'neo4j-rag' && 'Python, Neo4j, LangChain, FastAPI'}
                    {project.id === 'token-model' && 'TypeScript, React, D3.js, Web3.js'}
                    {project.id === 'amm-opt' && 'Solidity, Foundry, Python, Uniswap V3'}
                  </code>
                </div>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">Key Features</h2>
                <ul className="space-y-1 text-sm text-[#a9b1d6]/90">
                  <li>• Fully tested and documented codebase</li>
                  <li>• Optimized implementations</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Production-ready deployment</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-6">
                <button className="px-4 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm rounded hover:bg-[#7aa2f7]/90 transition-all duration-200">
                  View on GitHub
                </button>
                <button className="px-4 py-2 border border-[#7aa2f7] text-[#7aa2f7] text-sm rounded hover:bg-[#7aa2f7]/10 transition-all duration-200">
                  Live Demo
                </button>
              </div>
            </div>
          </div>
        );

      case 'blog':
        const blog = (content as any).data;
        return (
          <div className="space-y-6">
            <div className="border-b border-[#414868]/30 pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{blog.title}</h1>
              <p className="text-[#565f89] text-sm mt-1">{blog.name}</p>
            </div>

            <div className="prose prose-invert text-[#a9b1d6] text-sm leading-relaxed space-y-4">
              <p className="text-[#a9b1d6]/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. This is where the
                actual blog content would go.
              </p>

              <h2 className="text-[#9ece6a] font-bold">Introduction</h2>
              <p className="text-[#a9b1d6]/90">
                Detailed explanation of the topic, with code examples and technical insights
                that demonstrate deep understanding of the subject matter.
              </p>

              <div className="bg-[#1a1b26] p-4 rounded-lg border border-[#414868]/50">
                <pre className="text-xs">
                  <code className="text-[#7dcfff] font-mono">
{`// Example code snippet
contract Example {
    function demo() public pure returns (bool) {
        return true;
    }
}`}
                  </code>
                </pre>
              </div>

              <h2 className="text-[#9ece6a] font-bold">Conclusion</h2>
              <p className="text-[#a9b1d6]/90">
                Summary of key points and takeaways from the article.
              </p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#7aa2f7]">$ ./contact.sh</h1>

            <form className="space-y-4">
              <div>
                <label className="block text-[#565f89] text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[#565f89] text-sm mb-1">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-[#565f89] text-sm mb-1">Message:</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] resize-none transition-colors"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm rounded hover:bg-[#7aa2f7]/90 transition-all duration-200"
              >
                Send Message
              </button>
            </form>

            <div className="pt-6 border-t border-[#414868]/30 space-y-2">
              <p className="text-[#e0af68] text-sm font-bold">Quick Links</p>
              <div className="space-y-1 text-sm text-[#a9b1d6]">
                <a href="https://github.com/dleer" className="block hover:text-[#7aa2f7] transition-colors">
                  → github.com/dleer
                </a>
                <a href="https://linkedin.com/in/dleer" className="block hover:text-[#7aa2f7] transition-colors">
                  → linkedin.com/in/dleer
                </a>
                <a href="mailto:david@example.com" className="block hover:text-[#7aa2f7] transition-colors">
                  → david@example.com
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-mono text-sm">
      {renderContent()}
    </div>
  );
};

export default ContentViewer;