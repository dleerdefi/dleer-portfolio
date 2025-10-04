# CSS Modularization Specification

## Overview
Refactor the monolithic `app/globals.css` (923 LOC) into modular, maintainable CSS files following best practices with a target maximum of 300 LOC per file.

## Current State
- **File**: `app/globals.css`
- **Size**: 923 lines of code
- **Issue**: Violates modular architecture best practices
- **Impact**: Difficult to maintain, find specific styles, and collaborate

## Proposed Architecture

### Directory Structure
```
app/
├── globals.css                 # Entry point (imports only)
└── styles/
    ├── 01-theme-variables.css  # CSS custom properties & theme presets
    ├── 02-theme-effects.css    # Theme-specific visual effects
    ├── 03-fonts.css            # @font-face declarations
    ├── 04-terminal-theme.css   # Terminal color system
    ├── 05-base.css             # Resets & base styles
    ├── 06-typography.css       # Text styles
    ├── 07-terminal-ui.css      # Terminal UI components
    ├── 08-animations.css       # Keyframes & animation utilities
    ├── 09-utilities.css        # Spacing & responsive utilities
    ├── 10-mobile.css           # Mobile-specific optimizations
    └── 11-glass-effects.css    # Glass morphism & visual effects
```

## Module Breakdown

### 1. `01-theme-variables.css` (~165 lines)
**Source lines**: 5-169
**Content**:
- CSS custom properties for themes
- Tokyo Night theme variables (lines 49-92)
- Nord theme variables (lines 94-132)
- Solarized Light theme variables (lines 134-169)
- Accent color classes (lines 171-186)

### 2. `02-theme-effects.css` (~43 lines)
**Source lines**: 188-230
**Content**:
- Theme-specific tile shadow effects
- Theme transition animations
- Background effect controls

### 3. `03-fonts.css` (~23 lines)
**Source lines**: 232-255
**Content**:
- JetBrains Mono @font-face declarations
- Font weight variants (300, 400, 700)

### 4. `04-terminal-theme.css` (~97 lines)
**Source lines**: 257-355
**Content**:
- Catppuccin Latte color palette
- Tokyo Night deep tones
- Terminal color mappings
- @theme inline declarations

### 5. `05-base.css` (~65 lines)
**Source lines**: 360-424
**Content**:
- CSS reset (box-sizing, margin, padding)
- HTML and body base styles
- Selection styles
- Focus styles
- Container utilities

### 6. `06-typography.css` (~66 lines)
**Source lines**: 426-491
**Content**:
- Link styles and hover states
- Heading hierarchy (h1-h6)
- Code and pre block styles
- Typography spacing

### 7. `07-terminal-ui.css` (~49 lines)
**Source lines**: 493-541
**Content**:
- Terminal cursor animation
- Terminal prompt styles
- File listing styles
- ASCII box drawing utilities (lines 573-591)

### 8. `08-animations.css` (~48 lines)
**Source lines**: 593-653
**Content**:
- Typing animation
- @keyframes definitions (blob, blink, pulse)
- Animation utility classes
- Animation delays

### 9. `09-utilities.css` (~161 lines)
**Source lines**: 544-572, 667-704
**Content**:
- Mobile/desktop responsive utilities
- Touch target sizing
- Touch feedback animations
- Spacing utilities (margin, padding)
- Responsive breakpoints

### 10. `10-mobile.css` (~131 lines)
**Source lines**: 736-866
**Content**:
- Safe area insets
- Touch action controls
- Mobile viewport optimization
- iOS bounce prevention
- Sheet UI components
- Landscape adjustments
- Performance optimizations
- Accessibility support

### 11. `11-glass-effects.css` (~54 lines)
**Source lines**: 655-664, 870-923
**Content**:
- Glass morphism effects
- Scrollbar hiding utilities
- Gradient dots pattern
- Dotted border effects
- Z-index utilities

### 12. `globals.css` (Final - ~13 lines)
```css
@import "tailwindcss";

/* Modular style imports - Order matters */
@import "./styles/01-theme-variables.css";
@import "./styles/02-theme-effects.css";
@import "./styles/03-fonts.css";
@import "./styles/04-terminal-theme.css";
@import "./styles/05-base.css";
@import "./styles/06-typography.css";
@import "./styles/07-terminal-ui.css";
@import "./styles/08-animations.css";
@import "./styles/09-utilities.css";
@import "./styles/10-mobile.css";
@import "./styles/11-glass-effects.css";
```

## Implementation Steps

### Phase 1: Preparation
1. Create `app/styles/` directory
2. Back up current `globals.css` to `globals.css.backup`

### Phase 2: Extract Modules
For each module file:
1. Create the file in `app/styles/`
2. Copy relevant lines from `globals.css`
3. Add descriptive header comment
4. Verify no missing dependencies

### Phase 3: Update Entry Point
1. Replace `globals.css` content with imports
2. Ensure import order matches dependency chain

### Phase 4: Testing
1. Run `npm run build` to verify compilation
2. Test in development mode: `npm run dev`
3. Verify all themes work correctly
4. Check mobile responsiveness
5. Validate glass morphism effects

## Benefits

### Maintainability
- Each file has single responsibility
- Easier to locate specific styles
- Reduced cognitive load (max 165 LOC per file)

### Collaboration
- Multiple developers can work on different style modules
- Clearer git diffs and merge conflicts
- Better code review experience

### Performance
- No runtime impact (CSS imports are resolved at build time)
- Same final bundle size
- Potential for future code-splitting

## Migration Checklist

- [ ] Create `app/styles/` directory
- [ ] Backup `globals.css`
- [ ] Create `01-theme-variables.css`
- [ ] Create `02-theme-effects.css`
- [ ] Create `03-fonts.css`
- [ ] Create `04-terminal-theme.css`
- [ ] Create `05-base.css`
- [ ] Create `06-typography.css`
- [ ] Create `07-terminal-ui.css`
- [ ] Create `08-animations.css`
- [ ] Create `09-utilities.css`
- [ ] Create `10-mobile.css`
- [ ] Create `11-glass-effects.css`
- [ ] Update `globals.css` with imports
- [ ] Run build test
- [ ] Test all themes
- [ ] Test mobile layouts
- [ ] Remove backup file after verification

## Notes

### Import Order
The numbered prefixes ensure correct cascade order. Theme variables must load before components that use them.

### Line Count Compliance
- Largest module: `01-theme-variables.css` at ~165 lines
- All modules well under 300 LOC target
- Average module size: ~75 lines

### Future Considerations
- Could further split theme variables into separate theme files if needed
- Animation module could be split if it grows
- Consider CSS-in-JS for component-specific styles in future iterations