'use client';

import React, { RefObject, ReactNode } from 'react';
import NeofetchTile from '@/components/tiles/NeofetchTile';

interface Section {
  id: string;
  title: string;
}

interface ParallaxScrollContainerProps {
  scrollRef: RefObject<HTMLDivElement>;
  borderPadding: number;
  /** The fixed neofetch hero; useParallaxScroll fades it as the page scrolls */
  heroRef: RefObject<HTMLDivElement | null>;
  sections: Section[];
  renderSection: (sectionId: string) => ReactNode;
}

/**
 * ParallaxScrollContainer Component
 * Manages the scrollable content area with fixed Neofetch background
 * Handles section rendering with separators and transitions
 *
 * Section divider design inspired by Kyrre Gjerstad's portfolio (https://www.kyrre.dev/)
 * Clean thin lines with gradient dots for minimal, elegant separation between content sections
 */
export const ParallaxScrollContainer: React.FC<ParallaxScrollContainerProps> = ({
  scrollRef,
  borderPadding,
  heroRef,
  sections,
  renderSection
}) => {
  return (
    <div
      ref={scrollRef}
      className="fixed overflow-y-auto hide-scrollbar"
      style={{
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        padding: `${borderPadding}px`,
        zIndex: 2,
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling']
      }}
      role="main"
      aria-label="Main content"
    >
      {/* Fixed Neofetch Background - Now inside scroll container for clickability */}
      <div
        ref={heroRef}
        className="fixed flex items-center justify-center"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          height: '65vh',
          opacity: 0.7,
          // No backdrop-filter: the wallpaper behind is already blurred, and a 65vh backdrop blur
          // re-samples on every scroll frame on phones (docs/PORTFOLIO_V2_SPEC.md, P5)
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <div className="w-full max-w-4xl mx-auto" style={{
          marginTop: `${borderPadding}px`,
          paddingLeft: '48px',
          paddingRight: '48px',
          pointerEvents: 'none'
        }}>
          <NeofetchTile isBlurred={false} layout="parallax" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--theme-bg))'
          }}
        />
      </div>

      {/* Spacer for fixed background */}
      <div
        style={{
          height: `calc(65vh + ${borderPadding}px)`
        }}
      />

      {/* Content Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={`section-${section.id}`}
          className={`relative flex flex-col`}
          style={{
            paddingTop: index === 0 ? '24px' : '32px',
            paddingBottom: '32px',
            paddingLeft: '16px',
            paddingRight: '16px',
            backgroundColor: 'var(--theme-bg)',
            zIndex: 2,
            scrollMarginTop: '0px'
          }}
          role="region"
          aria-label={`${section.title} section`}
        >
          {/* Dot gradient transition from Neofetch to content */}
          {index === 0 && (
            <>
              <div
                className="absolute left-0 right-0"
                style={{
                  top: '-75px',
                  height: '75px',
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--theme-bg-rgb), 0.8) 0.8px, transparent 0.8px)`,
                  backgroundSize: '3px 3px',
                  backgroundPosition: '0 0',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              />
              {/* Line after gradient transition */}
              <div
                className="absolute max-w-3xl mx-auto w-full"
                style={{
                  top: '0',
                  left: '0',
                  right: '0',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                  }}
                />
              </div>
            </>
          )}

          <div
            className="flex-1 flex flex-col justify-start max-w-4xl mx-auto w-full"
            style={{
              paddingLeft: `${borderPadding}px`,
              paddingRight: `${borderPadding}px`
            }}
          >
            {renderSection(section.id)}
          </div>

          {/* Section divider */}
          {index < sections.length - 1 && (
            <div
              className="absolute max-w-3xl mx-auto w-full"
              style={{
                bottom: '0',
                left: '0',
                right: '0',
                paddingLeft: '24px',
                paddingRight: '24px'
              }}
            >
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'rgba(var(--accent-color-rgb), 0.2)'
                }}
              />
            </div>
          )}
        </section>
      ))}
    </div>
  );
};