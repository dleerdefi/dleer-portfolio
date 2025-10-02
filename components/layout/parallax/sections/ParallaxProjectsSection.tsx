import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '../components/BackButton';

interface Project {
  id: string;
  name: string;
  description: string;
  techStackDisplay: string;
  status?: string;
  github?: string;
  demo?: string;
}

interface ParallaxProjectsSectionProps {
  projects: Project[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

/**
 * Projects section component for parallax layout
 * Handles both list view and detail view for projects
 */
export const ParallaxProjectsSection: React.FC<ParallaxProjectsSectionProps> = ({
  projects,
  selectedProject,
  setSelectedProject
}) => {
  // If a project is selected, show its details
  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      setSelectedProject(null);
      return null;
    }

    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <BackButton
            onClick={() => setSelectedProject(null)}
            text="Back to projects"
          />
        </motion.div>

        {/* Project details */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold"
          style={{ color: 'var(--accent-color)' }}
        >
          {project.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: 'var(--theme-text)', opacity: 0.9 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <p>
            <span style={{ color: 'var(--theme-info)' }}>Tech Stack:</span>{' '}
            <span style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
              {project.techStackDisplay}
            </span>
          </p>
          {project.status && (
            <p>
              <span style={{ color: 'var(--theme-info)' }}>Status:</span>{' '}
              <span
                className="px-2 py-1 rounded text-xs uppercase"
                style={{
                  backgroundColor: project.status === 'production'
                    ? 'rgba(var(--theme-success-rgb), 0.1)'
                    : 'rgba(var(--theme-warning-rgb), 0.1)',
                  color: project.status === 'production'
                    ? 'var(--theme-success)'
                    : 'var(--theme-warning)'
                }}
              >
                {project.status}
              </span>
            </p>
          )}
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-3 pt-2"
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded transition-all hover:brightness-110"
              style={{
                backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                color: 'var(--accent-color)',
                border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
              }}
            >
              View on GitHub →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded transition-all hover:brightness-110"
              style={{
                backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                color: 'var(--accent-color)',
                border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
              }}
            >
              Live Demo →
            </a>
          )}
        </motion.div>
      </div>
    );
  }

  // Otherwise show the project list
  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold"
        style={{ color: 'var(--accent-color)' }}
      >
        Projects
      </motion.h2>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="group cursor-pointer"
            onClick={() => setSelectedProject(project.id)}
          >
            <h3
              className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
              style={{ color: 'var(--theme-primary)' }}
            >
              {project.name}
            </h3>
            <p
              className="text-sm transition-opacity group-hover:opacity-100"
              style={{ color: 'var(--theme-text)', opacity: 0.8 }}
            >
              {project.description}
            </p>
            {index < projects.length - 1 && (
              <div
                className="mt-3 h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};