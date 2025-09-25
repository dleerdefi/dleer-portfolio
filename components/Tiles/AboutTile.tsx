'use client';

import React from 'react';

const AboutTile: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-term-text-dim text-sm">
        <p>$ cat ~/about.md</p>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <h2 className="text-2xl font-bold text-tokyo-blue mb-3"># About Me</h2>
          <p className="text-term-text leading-relaxed">
            DeFi Architect & Token Economics Designer with over 5 years of experience building
            decentralized finance protocols. Specializing in blockchain development, Neo4j
            knowledge graphs, and AI/LLM applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-tokyo-green font-bold mb-3">## Core Expertise</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-tokyo-blue mr-2">▸</span>
                <span>DeFi Protocol Architecture</span>
              </li>
              <li className="flex items-start">
                <span className="text-tokyo-blue mr-2">▸</span>
                <span>Token Economics & Governance</span>
              </li>
              <li className="flex items-start">
                <span className="text-tokyo-blue mr-2">▸</span>
                <span>Neo4j Knowledge Graphs</span>
              </li>
              <li className="flex items-start">
                <span className="text-tokyo-blue mr-2">▸</span>
                <span>LLM/RAG Integration</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-tokyo-purple font-bold mb-3">## Tech Stack</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-term-text-dim mr-2">$</span>
                <span className="text-tokyo-yellow">Solidity, Hardhat, Foundry</span>
              </li>
              <li className="flex items-start">
                <span className="text-term-text-dim mr-2">$</span>
                <span className="text-tokyo-cyan">Neo4j, Cypher, GraphQL</span>
              </li>
              <li className="flex items-start">
                <span className="text-term-text-dim mr-2">$</span>
                <span className="text-tokyo-orange">TypeScript, React, Next.js</span>
              </li>
              <li className="flex items-start">
                <span className="text-term-text-dim mr-2">$</span>
                <span className="text-tokyo-green">Python, LangChain, FastAPI</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-term-border">
          <h3 className="text-tokyo-orange font-bold mb-3">## Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-tokyo-blue">5+</div>
              <div className="text-xs text-term-text-dim">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tokyo-green">$50M+</div>
              <div className="text-xs text-term-text-dim">TVL Managed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tokyo-purple">12+</div>
              <div className="text-xs text-term-text-dim">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tokyo-orange">10K+</div>
              <div className="text-xs text-term-text-dim">Active Users</div>
            </div>
          </div>
        </div>

        <div className="text-term-text-dim text-sm pt-4">
          <p>## Philosophy</p>
          <p className="mt-2 italic">
            "Building secure, efficient, and user-centric blockchain solutions that bridge the gap
            between traditional finance and DeFi innovation."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutTile;