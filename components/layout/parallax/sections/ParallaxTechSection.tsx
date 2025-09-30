import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  category: string;
  skills: string[];
}

interface ParallaxTechSectionProps {
  skills: Skill[];
}

/**
 * Technologies section component for parallax layout
 * Displays technical stack in a visually organized grid
 */
export const ParallaxTechSection: React.FC<ParallaxTechSectionProps> = ({
  skills
}) => {
  // Define colors for each category
  const categoryColors: { [key: string]: string } = {
    'Frontend': 'var(--theme-info)',
    'Backend': 'var(--theme-success)',
    'Blockchain': 'var(--accent-color)',
    'AI & Data': 'var(--theme-warning)'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <div className="h-full flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--accent-color)' }}
          >
            Technologies
          </h2>
          <p
            className="text-sm sm:text-base"
            style={{
              color: 'var(--theme-text-dimmed)',
              opacity: 0.8
            }}
          >
            Technical Stack & Expertise
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10"
        >
          {skills.map((category, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative"
            >
              {/* Category Header */}
              <div className="mb-4">
                <h3
                  className="text-lg sm:text-xl font-semibold flex items-center gap-2"
                  style={{
                    color: categoryColors[category.category] || 'var(--theme-primary)'
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: categoryColors[category.category] || 'var(--theme-primary)',
                      boxShadow: `0 0 8px ${categoryColors[category.category] || 'var(--theme-primary)'}`
                    }}
                  />
                  {category.category}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-2 pl-4">
                {category.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skillIdx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.1 + skillIdx * 0.05
                    }}
                    className="flex items-center gap-2 text-sm sm:text-base"
                    style={{
                      color: 'var(--theme-text)',
                      opacity: 0.9
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--theme-text-dimmed)',
                        opacity: 0.5
                      }}
                    >
                      ›
                    </span>
                    {skill}
                  </motion.div>
                ))}
              </div>

              {/* Decorative Line */}
              <div
                className="absolute -left-2 top-0 bottom-0 w-0.5"
                style={{
                  background: `linear-gradient(180deg,
                    ${categoryColors[category.category] || 'var(--theme-primary)'} 0%,
                    transparent 100%)`,
                  opacity: 0.3
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex justify-center gap-2"
        >
          {skills.map((category, idx) => (
            <div
              key={idx}
              className="w-12 h-1"
              style={{
                backgroundColor: categoryColors[category.category] || 'var(--theme-primary)',
                opacity: 0.5
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};