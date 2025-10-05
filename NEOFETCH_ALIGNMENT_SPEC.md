# Neofetch Layout Alignment & Scaling Specification

## Overview
Optimize the Neofetch section's alignment, spacing, and responsive scaling to ensure consistent visual hierarchy and proper ASCII art presentation across all viewport sizes.

## Current Issues

### 1. No Left Padding
- ASCII art starts directly at the edge with no spacing from the border
- Creates visual imbalance compared to other sections

### 2. Inconsistent Container Alignment
- **Neofetch section**: Uses `px-6 sm:px-8 md:px-12` with `max-w-4xl`
- **Bio section below**: Uses `p-8 sm:p-10` with `max-w-3xl`
- Results in misaligned content boundaries

### 3. Suboptimal ASCII Art Scaling
- Fixed font sizes don't adapt well to available space
- ASCII art width is either `auto` or `40%` without proper constraints
- Font size clamp values are too small for optimal readability

### 4. Container Structure Issues
- NeofetchTile has no internal padding
- Relies entirely on container for spacing
- No responsive width constraints for ASCII art

## Research Findings

### Responsive ASCII Art Best Practices
Based on web research and Stack Overflow discussions:
- Use viewport units (vw, vh, vmin) for responsive font sizing
- Implement `max()` function to prevent text becoming too small on mobile
- Monospace fonts are essential for ASCII art alignment
- Container queries can help with component-level responsiveness

### Recommended Approach
```css
/* Responsive ASCII art font sizing */
font-size: max(0.5rem, 1.2vmin);

/* With upper bounds */
font-size: clamp(0.5rem, 1.2vw, 0.85rem);
```

### Layout Patterns
- Use percentage-based widths with min/max constraints
- Flexbox for internal component layout
- Consistent padding across all content sections

## Proposed Solution

### 1. Container Alignment (MobileParallaxLayout.tsx)

**Current (line 220):**
```jsx
<div className="w-full max-w-4xl mx-auto px-6 sm:px-8 md:px-12" style={{ marginTop: `${borderPadding}px` }}>
  <NeofetchTile isBlurred={false} />
</div>
```

**Proposed:**
```jsx
<div className="w-full max-w-3xl mx-auto p-8 sm:p-10">
  <NeofetchTile isBlurred={false} />
</div>
```

### 2. ASCII Art Column Sizing (NeofetchTile.tsx)

**Current (line 44):**
```jsx
<div className="flex-shrink-0 flex items-start overflow-hidden"
     style={{ width: logoType === 'dleer' ? 'auto' : '40%' }}>
```

**Proposed:**
```jsx
<div className="flex-shrink-0 flex items-start"
     style={{
       width: logoType === 'dleer' ? '45%' : '35%',
       minWidth: logoType === 'dleer' ? '200px' : '120px',
       maxWidth: logoType === 'dleer' ? '320px' : '200px'
     }}>
```

### 3. Responsive Font Sizing

**Current ASCII art font size (line 53):**
```jsx
fontSize: logoType === 'dleer' ? 'clamp(0.45rem, 1vw, 0.6rem)' : 'clamp(0.35rem, 1.5vw, 0.65rem)'
```

**Proposed:**
```jsx
fontSize: logoType === 'dleer' ?
  'clamp(0.5rem, 1.2vw, 0.75rem)' :
  'clamp(0.4rem, 1.8vw, 0.7rem)'
```

**Current info font size (line 76):**
```jsx
fontSize: 'clamp(0.6rem, 1.3vw, 0.75rem)'
```

**Proposed:**
```jsx
fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)'
```

### 4. Component Structure Enhancement

**Add responsive gap sizing (line 39):**
```jsx
// Current
<div className={`flex gap-2 sm:gap-3 md:gap-4 font-mono text-xs transition-all duration-300`}>

// Proposed
<div className={`flex gap-4 sm:gap-6 md:gap-8 font-mono text-xs transition-all duration-300 w-full`}>
```

## Implementation Plan

### Phase 1: Container Alignment
1. Update MobileParallaxLayout.tsx container classes
2. Remove unnecessary marginTop style
3. Standardize max-width to max-w-3xl

### Phase 2: ASCII Art Scaling
1. Implement percentage-based width with constraints
2. Update font size clamp values
3. Remove overflow:hidden to prevent clipping

### Phase 3: Spacing Optimization
1. Increase gap between ASCII art and info columns
2. Add space-y-1 to info column for better readability
3. Ensure consistent padding throughout

### Phase 4: Testing
1. Test all ASCII art variants (dleer, arch, minimal)
2. Verify across all themes (Tokyo Night, Nord, Solarized)
3. Check mobile responsiveness (320px to 768px)
4. Desktop scaling (1024px to 1920px)

## Success Metrics

1. **Alignment**: Left edge of ASCII art aligns with bio section below
2. **Scaling**: ASCII art occupies 35-45% of container width
3. **Readability**: Font sizes remain legible at all viewport sizes
4. **Consistency**: Padding matches across all content sections
5. **Responsiveness**: Smooth scaling from mobile to desktop

## Testing Checklist

- [ ] ASCII art doesn't touch border edges
- [ ] Content aligns with sections below
- [ ] Font sizes scale smoothly with viewport
- [ ] All theme variants work correctly
- [ ] Mobile view (< 768px) is properly formatted
- [ ] Desktop view maintains optimal proportions
- [ ] No horizontal scrolling on any viewport
- [ ] ASCII art variants display correctly

## Notes

- The `vmin` unit could be considered for truly responsive scaling
- Container queries might be beneficial for future enhancements
- Consider lazy loading ASCII art for performance optimization