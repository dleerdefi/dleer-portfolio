import React from 'react';

interface Skill {
  category: string;
  skills: string[];
}

interface SkillGridProps {
  skills: Skill[];
}

/**
 * Compact skill grid display component
 * Shows skills in a condensed format with category labels
 */
export const SkillGrid: React.FC<SkillGridProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div
      className="pt-4 border-t"
      style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.1)' }}
    >
      <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--theme-info)' }}>
        Technical Stack
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {skills.map((category, idx) => (
          <div key={idx} className="flex flex-wrap items-baseline gap-1">
            <span
              className="font-medium"
              style={{ color: 'var(--theme-text-dimmed)', fontSize: '11px' }}
            >
              {category.category}:
            </span>
            <span style={{ color: 'var(--theme-text)', opacity: 0.75, fontSize: '11px' }}>
              {category.skills.length > 4
                ? `${category.skills.slice(0, 4).join(', ')} +${category.skills.length - 4}`
                : category.skills.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};