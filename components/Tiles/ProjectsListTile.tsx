'use client';

import React from 'react';
import { TileType } from '@/lib/tiling/types';

interface ProjectsListTileProps {
  spawnTile: (type: TileType['type'], data?: any) => void;
}

const projects = [
  {
    id: 'defi-lending',
    name: 'defi-lending-protocol',
    ext: 'sol',
    description: 'Decentralized lending with dynamic rates',
    tech: ['Solidity', 'Hardhat', 'TypeScript'],
  },
  {
    id: 'neo4j-rag',
    name: 'neo4j-rag-system',
    ext: 'py',
    description: 'Knowledge graph for LLM applications',
    tech: ['Neo4j', 'Python', 'LangChain'],
  },
  {
    id: 'token-model',
    name: 'token-economics-model',
    ext: 'ts',
    description: 'Sustainable tokenomics simulator',
    tech: ['TypeScript', 'React', 'D3.js'],
  },
  {
    id: 'amm-opt',
    name: 'amm-optimization',
    ext: 'sol',
    description: 'Concentrated liquidity AMM design',
    tech: ['Solidity', 'Foundry', 'Python'],
  },
];

const ProjectsListTile: React.FC<ProjectsListTileProps> = ({ spawnTile }) => {
  return (
    <div className="space-y-4">
      <div className="text-term-text-dim text-sm">
        <p>$ ls -la ~/projects/</p>
        <p className="mt-2">total {projects.length}</p>
        <p>drwxr-xr-x  2 dleer dleer 4096 Dec 24 12:00 .</p>
        <p>drwxr-xr-x  5 dleer dleer 4096 Dec 24 11:00 ..</p>
      </div>

      <div className="space-y-2 mt-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => spawnTile('project-detail', project)}
            className="block w-full text-left p-3 border border-term-border hover:border-tokyo-blue hover:bg-term-surface-alt transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-tokyo-green">-rw-r--r--</span>
                  <span className="text-term-text font-mono">
                    {project.name}.{project.ext}
                  </span>
                </div>
                <p className="text-term-text-dim text-xs mt-1">{project.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-term-text-dim text-xs pt-4 border-t border-term-border">
        <p>Click any project to view details</p>
        <p className="mt-1">Use arrow keys to navigate, Enter to open</p>
      </div>
    </div>
  );
};

export default ProjectsListTile;