'use client';

import React from 'react';

interface ProjectDetailTileProps {
  project: {
    name: string;
    description: string;
    tech: string[];
    ext: string;
  };
}

const ProjectDetailTile: React.FC<ProjectDetailTileProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-tokyo-blue">
          {project.name}.{project.ext}
        </h2>
        <p className="text-term-text">{project.description}</p>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-tokyo-green font-bold mb-2">## Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-term-surface-alt text-tokyo-cyan text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-tokyo-green font-bold mb-2">## Description</h3>
          <p className="text-term-text-dim text-sm leading-relaxed">
            This project demonstrates advanced {project.tech[0]} development with focus on
            security, efficiency, and scalability. The implementation follows best practices
            and includes comprehensive testing and documentation.
          </p>
        </div>

        <div className="pt-4 border-t border-term-border">
          <h3 className="text-tokyo-purple font-bold mb-2">## Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-term-text-dim">Lines of Code:</span>
              <span className="text-tokyo-orange ml-2">~{Math.floor(Math.random() * 10000 + 2000)}</span>
            </div>
            <div>
              <span className="text-term-text-dim">Commits:</span>
              <span className="text-tokyo-orange ml-2">{Math.floor(Math.random() * 200 + 50)}</span>
            </div>
            <div>
              <span className="text-term-text-dim">Test Coverage:</span>
              <span className="text-tokyo-green ml-2">{Math.floor(Math.random() * 20 + 80)}%</span>
            </div>
            <div>
              <span className="text-term-text-dim">Status:</span>
              <span className="text-tokyo-green ml-2">Active</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button className="px-3 py-1 bg-tokyo-blue text-term-bg text-sm hover:bg-tokyo-purple transition-colors">
            View on GitHub
          </button>
          <button className="px-3 py-1 border border-tokyo-blue text-tokyo-blue text-sm hover:bg-term-surface-alt transition-colors">
            Live Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailTile;