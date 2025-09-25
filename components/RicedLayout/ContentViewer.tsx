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
            <pre className="text-[#7aa2f7] text-xs">
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
              <p className="text-lg mb-4">DeFi Architect & Token Economics Designer</p>
              <p className="text-sm leading-relaxed">
                Navigate through the file tree on the left to explore my portfolio.
                Each project showcases expertise in blockchain development, Neo4j knowledge graphs,
                and AI/LLM applications.
              </p>
            </div>
            <div className="text-xs text-[#565f89] mt-8">
              <p>Quick Keys:</p>
              <p className="mt-2">• Click files in navigation to view content</p>
              <p>• Projects contain detailed technical information</p>
              <p>• Blog posts share insights and tutorials</p>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#7aa2f7]"># About Me</h1>

            <div className="text-[#a9b1d6] space-y-4">
              <p>
                Senior blockchain developer with 5+ years of experience building decentralized
                finance protocols and token economic systems. Specializing in the intersection
                of DeFi, knowledge graphs, and AI applications.
              </p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <h2 className="text-[#9ece6a] font-bold mb-3">## Technical Skills</h2>
                  <ul className="space-y-1 text-sm">
                    <li>• Solidity & Smart Contract Security</li>
                    <li>• Token Economics Design</li>
                    <li>• Neo4j & Graph Databases</li>
                    <li>• React, TypeScript, Next.js</li>
                    <li>• Python, LangChain, FastAPI</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-[#bb9af7] font-bold mb-3">## Achievements</h2>
                  <ul className="space-y-1 text-sm">
                    <li>• $50M+ TVL Managed</li>
                    <li>• 12+ Production Protocols</li>
                    <li>• 10K+ Active Users</li>
                    <li>• Multiple Audit Passes</li>
                    <li>• Open Source Contributor</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#414868]">
                <h2 className="text-[#e0af68] font-bold mb-3">## Current Focus</h2>
                <p className="text-sm">
                  Building the next generation of DeFi infrastructure with emphasis on
                  security, efficiency, and user experience. Particularly interested in
                  leveraging Neo4j knowledge graphs for enhanced DeFi analytics and
                  AI-powered trading strategies.
                </p>
              </div>
            </div>
          </div>
        );

      case 'project':
        const project = (content as any).data;
        return (
          <div className="space-y-6">
            <div className="border-b border-[#414868] pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{project.name}</h1>
              <p className="text-[#565f89] mt-1">{project.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">## Overview</h2>
                <p className="text-[#a9b1d6] text-sm leading-relaxed">
                  This project demonstrates advanced blockchain development practices with
                  focus on security, efficiency, and scalability. Implemented using modern
                  development tools and following industry best practices.
                </p>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">## Technical Stack</h2>
                <div className="bg-[#1a1b26] p-3 rounded mt-2">
                  <code className="text-[#7dcfff] text-xs">
                    {project.id === 'defi-lending' && 'Solidity, Hardhat, OpenZeppelin, Chainlink'}
                    {project.id === 'neo4j-rag' && 'Python, Neo4j, LangChain, FastAPI'}
                    {project.id === 'token-model' && 'TypeScript, React, D3.js, Web3.js'}
                    {project.id === 'amm-opt' && 'Solidity, Foundry, Python, Uniswap V3'}
                  </code>
                </div>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">## Key Features</h2>
                <ul className="space-y-1 text-[#a9b1d6] text-sm">
                  <li>• Fully audited and tested codebase</li>
                  <li>• Gas-optimized implementations</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Production-ready deployment scripts</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-6">
                <button className="px-4 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm hover:bg-[#9ece6a] transition-colors">
                  View on GitHub
                </button>
                <button className="px-4 py-2 border border-[#7aa2f7] text-[#7aa2f7] text-sm hover:bg-[#7aa2f7]/10 transition-colors">
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
            <div className="border-b border-[#414868] pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{blog.title}</h1>
              <p className="text-[#565f89] text-sm mt-1">{blog.name}</p>
            </div>

            <div className="prose prose-invert text-[#a9b1d6] text-sm leading-relaxed space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. This is where the
                actual blog content would go.
              </p>

              <h2 className="text-[#9ece6a] font-bold">## Introduction</h2>
              <p>
                Detailed explanation of the topic, with code examples and technical insights
                that demonstrate deep understanding of the subject matter.
              </p>

              <div className="bg-[#1a1b26] p-4 rounded">
                <pre className="text-xs">
                  <code className="text-[#7dcfff]">
{`// Example code snippet
contract Example {
    function demo() public pure returns (bool) {
        return true;
    }
}`}
                  </code>
                </pre>
              </div>

              <h2 className="text-[#9ece6a] font-bold">## Conclusion</h2>
              <p>
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
                  className="w-full bg-[#1a1b26] border border-[#414868] px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[#565f89] text-sm mb-1">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1b26] border border-[#414868] px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-[#565f89] text-sm mb-1">Message:</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full bg-[#1a1b26] border border-[#414868] px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm hover:bg-[#9ece6a] transition-colors"
              >
                Send Message
              </button>
            </form>

            <div className="pt-6 border-t border-[#414868] space-y-2">
              <p className="text-[#e0af68] text-sm font-bold">## Quick Links</p>
              <div className="space-y-1 text-sm text-[#a9b1d6]">
                <a href="https://github.com/dleer" className="block hover:text-[#7aa2f7]">
                  → github.com/dleer
                </a>
                <a href="https://linkedin.com/in/dleer" className="block hover:text-[#7aa2f7]">
                  → linkedin.com/in/dleer
                </a>
                <a href="mailto:david@example.com" className="block hover:text-[#7aa2f7]">
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
    <div className="h-full p-6 font-mono text-sm overflow-auto">
      {renderContent()}
    </div>
  );
};

export default ContentViewer;