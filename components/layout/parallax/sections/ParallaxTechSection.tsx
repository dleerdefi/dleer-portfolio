import React from 'react';
import { motion } from 'framer-motion';
import { useTechnologies } from '@/lib/config';
import { TechIcon } from '@/components/ui/TechIcon';

/**
 * Technologies section component for parallax layout
 * Displays technology logos in a clean, uniform grid
 */
export const ParallaxTechSection: React.FC = () => {
  const technologies = useTechnologies();

  // Fallback if no technologies configured
  if (!technologies || !technologies.items || technologies.items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p style={{ color: 'var(--theme-text-dimmed)' }}>
          Technologies section not configured
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <div className="h-full flex flex-col justify-center py-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--accent-color)' }}
          >
            Technologies
          </h2>
        </motion.div>

        {/* Technology Grid - Fixed 3x3 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center"
        >
          {technologies.items.map((tech, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
            >
              <TechIcon
                iconName={tech.icon}
                name={tech.name}
                size={48}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 mx-auto h-1 max-w-md"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)',
            opacity: 0.4,
            borderRadius: '2px'
          }}
        />
      </div>
    </div>
  );
};