'use client';

import React from 'react';

const NeofetchTile: React.FC = () => {
  return (
    <div className="h-full flex p-6 font-mono text-sm text-[#a9b1d6]">
      {/* ASCII Art Column */}
      <div className="w-1/3 pr-4">
        <pre className="text-[#7aa2f7] text-xs leading-tight">
{`
    ██████╗ ██╗
    ██╔══██╗██║
    ██║  ██║██║
    ██║  ██║██║
    ██████╔╝███████╗
    ╚═════╝ ╚══════╝
`}
        </pre>
      </div>

      {/* Info Column */}
      <div className="flex-1 space-y-1">
        <div className="text-[#7aa2f7] font-bold mb-2">
          david@portfolio
          <div className="text-[#414868]">---------------</div>
        </div>

        <div className="space-y-0.5">
          <div>
            <span className="text-[#7aa2f7]">OS</span>: Arch Linux x86_64
          </div>
          <div>
            <span className="text-[#7aa2f7]">Host</span>: DeFi Architect
          </div>
          <div>
            <span className="text-[#7aa2f7]">Kernel</span>: 5.0.0-blockchain
          </div>
          <div>
            <span className="text-[#7aa2f7]">Uptime</span>: 5 years
          </div>
          <div>
            <span className="text-[#7aa2f7]">Packages</span>: 12 (production)
          </div>
          <div>
            <span className="text-[#7aa2f7]">Shell</span>: zsh 5.9
          </div>
          <div>
            <span className="text-[#7aa2f7]">Terminal</span>: Portfolio v1.0
          </div>
          <div>
            <span className="text-[#7aa2f7]">CPU</span>: TokenEconomics @ 4.50 GHz
          </div>
          <div>
            <span className="text-[#7aa2f7]">GPU</span>: Neo4j Graph Engine
          </div>
          <div>
            <span className="text-[#7aa2f7]">Memory</span>: 50M TVL / ∞ Available
          </div>

          <div className="pt-2 flex gap-1">
            <span className="w-3 h-3 bg-[#1a1b26] inline-block"></span>
            <span className="w-3 h-3 bg-[#f7768e] inline-block"></span>
            <span className="w-3 h-3 bg-[#9ece6a] inline-block"></span>
            <span className="w-3 h-3 bg-[#e0af68] inline-block"></span>
            <span className="w-3 h-3 bg-[#7aa2f7] inline-block"></span>
            <span className="w-3 h-3 bg-[#bb9af7] inline-block"></span>
            <span className="w-3 h-3 bg-[#7dcfff] inline-block"></span>
            <span className="w-3 h-3 bg-[#a9b1d6] inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeofetchTile;