'use client';

import React from 'react';
import { TileType } from '@/lib/tiling/types';

interface HomeTileProps {
  spawnTile: (type: TileType['type'], data?: any) => void;
}

const HomeTile: React.FC<HomeTileProps> = ({ spawnTile }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <pre className="text-tokyo-blue text-xs leading-tight">
{`
██████╗  █████╗ ██╗   ██╗██╗██████╗     ██╗     ███████╗███████╗██████╗
██╔══██╗██╔══██╗██║   ██║██║██╔══██╗    ██║     ██╔════╝██╔════╝██╔══██╗
██║  ██║███████║██║   ██║██║██║  ██║    ██║     █████╗  █████╗  ██████╔╝
██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║    ██║     ██╔══╝  ██╔══╝  ██╔══██╗
██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝    ███████╗███████╗███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝     ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
`}
        </pre>
      </div>

      <div className="text-term-text">
        <p className="text-tokyo-green mb-2">DeFi Architect & Token Economics Designer</p>
        <p className="text-term-text-dim text-sm leading-relaxed">
          Building the next generation of decentralized finance protocols with expertise in
          blockchain development, Neo4j knowledge graphs, and AI/LLM applications.
        </p>
      </div>

      <div className="space-y-2 pt-4 border-t border-term-border">
        <p className="text-term-text-dim text-xs mb-3">$ ls -la ~/portfolio/</p>

        <div className="space-y-1">
          <button
            onClick={() => spawnTile('about')}
            className="block w-full text-left px-2 py-1 hover:bg-term-surface-alt transition-colors"
          >
            <span className="text-tokyo-purple">drwxr-xr-x</span>{' '}
            <span className="text-term-text hover:text-tokyo-cyan">about/</span>
          </button>

          <button
            onClick={() => spawnTile('projects')}
            className="block w-full text-left px-2 py-1 hover:bg-term-surface-alt transition-colors"
          >
            <span className="text-tokyo-purple">drwxr-xr-x</span>{' '}
            <span className="text-term-text hover:text-tokyo-cyan">projects/</span>
          </button>

          <button
            onClick={() => spawnTile('blog')}
            className="block w-full text-left px-2 py-1 hover:bg-term-surface-alt transition-colors"
          >
            <span className="text-tokyo-purple">-rw-r--r--</span>{' '}
            <span className="text-term-text hover:text-tokyo-cyan">blog.rss</span>
          </button>

          <button
            onClick={() => spawnTile('contact')}
            className="block w-full text-left px-2 py-1 hover:bg-term-surface-alt transition-colors"
          >
            <span className="text-tokyo-purple">-rwxr-xr-x</span>{' '}
            <span className="text-term-text hover:text-tokyo-cyan">contact.sh</span>
          </button>
        </div>
      </div>

      <div className="text-term-text-dim text-xs pt-4">
        <p>Tip: Use Mod+Q to close tiles, Mod+Enter to spawn new terminal</p>
      </div>
    </div>
  );
};

export default HomeTile;