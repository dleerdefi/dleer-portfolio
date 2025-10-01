# Parallax About Section Refactor Specification

## Overview
Split the current About section in parallax mode into two distinct sections with independent scroll snap points:
1. **Bio Section** - Extended personal/professional narrative
2. **Technologies Section** - Technical stack and skills display

## Current Issue
- About section currently snaps at halfway point instead of showing full content
- Content is too dense for single viewport
- Bio and skills compete for limited viewport space
- Scroll snap behavior is inconsistent due to `scrollMarginTop: '-55vh'`

## Proposed Architecture

### Section Structure
```
[Neofetch Tile] - 60vh fixed header with system info
    ↓ scroll snap
[Bio Section] - Full viewport with extended bio
    ↓ scroll snap
[Technologies Section] - Full viewport with technical stack
    ↓ scroll snap
[Projects Section] - Existing projects display
    ↓ scroll snap
[Blog Section] - Existing blog posts
    ↓ scroll snap
[Contact Section] - Existing contact form
```

### 1. Bio Section
**Purpose**: Display comprehensive professional narrative

**Content Structure**:
```typescript
{
  title: "Founder & Software Engineer",
  content: {
    paragraph1: "I'm David Leer, a founder and software engineer building the next generation of AI memory. My work connects Large Language Models with knowledge graphs, creating systems capable of context-aware reasoning.",

    paragraph2: "As Chief Product Officer of ConsumerFi, I architected the protocol's core three-layer system. I also developed proprietary agent-based simulators that modeled token economies over $300M, directly guiding strategy for foundations and market makers.",

    paragraph3: "My technical leadership is built on a foundation of shipping complex systems at scale. I previously managed $63M in scope and led teams of 50+ engineers to deliver a $500M hospital campus. Today, my focus is on advanced LLM memory and scalable, user-owned data infrastructure.",

    tagline: "Outside of work, I experiment in my homelab, fly drones, and travel."
  }
}
```

**Visual Design**:
- Full viewport height (`min-h-screen`)
- Centered content with max-width constraint
- Large, readable typography (base: 16px, mobile: 14px)
- Proper line-height for readability (1.6-1.8)
- Subtle fade-in animation on scroll

### 2. Technologies Section
**Purpose**: Showcase technical expertise and skills

**Content Structure**:
```typescript
{
  title: "Technologies",
  subtitle: "Technical Stack & Expertise",
  categories: [
    {
      name: "Frontend",
      skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
    },
    {
      name: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "Neo4j"]
    },
    {
      name: "Blockchain",
      skills: ["Solidity", "Hardhat", "Foundry", "OpenZeppelin"]
    },
    {
      name: "AI & Data",
      skills: ["LangChain", "Knowledge Graphs", "Vector DBs", "RAG Systems"]
    }
  ]
}
```

**Visual Design**:
- Full viewport height (`min-h-screen`)
- Grid layout for skill categories
- Visual hierarchy with category headers
- Responsive columns (2 on mobile, 4 on desktop)
- Color-coded categories using theme variables

## Implementation Plan

### Phase 1: Configuration Updates
1. Update `portfolio.config.ts`:
   - Split bio into structured paragraphs
   - Reorganize skills into technology-focused categories
   - Add environment variable support for all content

### Phase 2: Component Refactoring
1. Create new component structure:
   ```
   components/layout/parallax/sections/
   ├── ParallaxBioSection.tsx       (new)
   ├── ParallaxTechSection.tsx      (new)
   └── ParallaxAboutSection.tsx     (remove)
   ```

2. Update `MobileParallaxLayout.tsx`:
   - Add Bio and Technologies as separate sections
   - Update section array and navigation
   - Fix scroll snap alignment for each section

### Phase 3: Scroll Behavior Fixes
1. Remove problematic `scrollMarginTop: '-55vh'`
2. Set all sections to `scrollSnapAlign: 'start'`
3. Ensure consistent `min-h-screen` for all content sections
4. Add proper padding to prevent content cutoff

### Phase 4: Content Optimization
1. Bio Section:
   - Optimize text length for mobile viewport
   - Implement responsive font sizing
   - Add proper spacing between paragraphs

2. Technologies Section:
   - Create compact skill display
   - Implement expandable categories if needed
   - Add visual indicators for expertise level

## Technical Requirements

### Scroll Snap Configuration
```tsx
// Each section container
style={{
  minHeight: '100vh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  paddingTop: '3rem',
  paddingBottom: '3rem'
}}
```

### Viewport Constraints
- Mobile (< 768px):
  - Font size: 14px base
  - Padding: 1.5rem
  - Max content width: 100%

- Tablet/Desktop (≥ 768px):
  - Font size: 16px base
  - Padding: 3rem
  - Max content width: 64rem

### Animation Timing
- Section fade-in: 600ms ease-out
- Viewport trigger: 30% visible
- Stagger children: 100ms delay

## Success Criteria
1. ✅ Each section fills exactly one viewport
2. ✅ Scroll snap points align perfectly with section starts
3. ✅ Content is fully visible without cutoff
4. ✅ Bio text is readable and well-spaced
5. ✅ Technologies are clearly organized
6. ✅ Smooth scrolling between sections
7. ✅ Mobile-optimized typography and spacing

## File Changes Required
1. `/config/portfolio.config.ts` - Update bio structure
2. `/components/layout/MobileParallaxLayout.tsx` - Add new sections
3. `/components/layout/parallax/sections/ParallaxBioSection.tsx` - Create
4. `/components/layout/parallax/sections/ParallaxTechSection.tsx` - Create
5. `/.env.local` - Add bio content variables
6. `/.env.example` - Document new variables

## Testing Checklist
- [x] Test on iPhone SE (smallest viewport)
- [x] Test on iPhone 14 Pro
- [x] Test on iPad
- [x] Verify scroll snap behavior
- [x] Check content visibility at all breakpoints
- [x] Validate animation performance
- [x] Ensure keyboard navigation works

## Implementation Status: ✅ COMPLETED

### What Was Built

#### 1. **Bio Section** (`ParallaxBioSection.tsx`)
- Full viewport dedicated to professional narrative
- Structured content: intro, experience, leadership, tagline
- Smooth fade-in animations with staggered timing
- Responsive typography: 18px base on desktop, 14px mobile
- Gradient accent line for visual polish

#### 2. **Technologies Section** (`ParallaxTechSection.tsx`)
- **Three-Pillar Architecture**: Languages & Frameworks, Data & Knowledge Graphs, Systems & Infra
- **Metric-Driven Display**: Shows scale/impact ($300M+, 20K users, 100M+ datapoints)
- **Full Viewport Usage**: 3-column grid on desktop, stacks on mobile
- **Visual Hierarchy**:
  - Technology name: Bold, monospace (JetBrains Mono)
  - Metric: Accent color, prominent
  - Context: Dimmed, readable description
- **Design Elements**:
  - Gradient top bar per pillar
  - Glass morphism card backgrounds
  - Vertical accent lines
  - Staggered fade-in animations
  - Bottom accent bars for visual completion

#### 3. **Configuration System**
- Added `TechnologyItem`, `TechnologyPillar`, `TechnologiesConfig` types
- New `technologies` field in portfolio config
- Helper function `useTechnologies()` in lib/config.ts
- Environment variable support for all bio fields

#### 4. **Scroll Snap Fixes**
- Changed all sections to `min-h-screen` for full viewport
- Removed problematic `scrollMarginTop: '-55vh'`
- Added flexbox centering for proper content alignment
- Updated ScrollProgress to show 6 sections (Neofetch + 5 content)

### Key Design Decisions

**Why Three Pillars?**
- Balances information density with scannability
- Natural categorization for technical expertise
- Uses full viewport width effectively
- Mobile-friendly (stacks vertically)

**Why Metrics Over Logos?**
- Demonstrates real-world impact, not just tool knowledge
- "$300M+ Token Economies" is more memorable than "Python: 5 years"
- Shows HOW technologies are used, not just THAT they're known
- Differentiates from typical portfolio tech lists

**Typography Choices**:
- Monospace for tech names: Reinforces technical/terminal aesthetic
- Accent colors for metrics: Draws eye to impact
- Dimmed context text: Readable but non-competing
- Generous line-height (1.6): Improves mobile readability

### Performance Notes
- Lazy animations with `whileInView` prevent excessive renders
- Staggered animations create professional polish
- Glass morphism uses efficient `backdrop-filter`
- No heavy icons or images needed

## Notes
- ScrollProgress component successfully updated for 6 sections
- Bio content fully configurable via environment variables
- Technologies section extensible for future categories
- Could add hover states showing related projects (future enhancement)