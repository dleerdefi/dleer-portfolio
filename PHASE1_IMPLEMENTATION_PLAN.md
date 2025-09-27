# Phase 1 Implementation Plan: Foundation
## Navigation Focus Management System

**Phase Duration**: Day 1-2 (16 hours estimated)
**Status**: In Progress
**Last Updated**: December 2024

---

## Objective
Establish a robust state management foundation for unified focus and navigation control across the Tile Portfolio Template.

## Completed Components ✅

### 1. FocusContext Implementation (Complete)
**Location**: `/contexts/FocusContext.tsx`

#### Features Implemented:
- ✅ Centralized focus state management
- ✅ Type-safe state interfaces
- ✅ State transition validation
- ✅ Focus history tracking (10 items max)
- ✅ Scroll request queueing
- ✅ Debug logging in development mode

#### Key Types:
```typescript
- TileType: 'neofetch' | 'navigation' | 'content'
- ContentType: Union of all content variations
- FocusState: Complete state snapshot with timestamps
- FocusTransition: Transition metadata with triggers
```

### 2. Custom Hooks Library (Complete)
**Location**: `/hooks/useFocus.ts`

#### Hooks Created:
- ✅ `useScrollToFocus` - Manages scroll behavior with animations
- ✅ `useFocusOnMount` - Handles initial focus with SSR support
- ✅ `useFocusTrap` - Implements focus trap for modals
- ✅ `useClickOutside` - Detects clicks outside elements
- ✅ `useFocusRestoration` - Save/restore focus state
- ✅ `useArrowKeyNavigation` - Arrow key list navigation

## Remaining Tasks 📋

### 3. LayoutManager Integration (2-3 hours)
**Priority**: HIGH
**Complexity**: Medium

#### Steps:
1. **Wrap App with FocusProvider**
   ```typescript
   // app/layout.tsx or appropriate parent
   import { FocusProvider } from '@/contexts/FocusContext';

   <FocusProvider>
     <LayoutManager />
   </FocusProvider>
   ```

2. **Replace State Management**
   - Remove local `activeContent` and `focusedTile` states
   - Import and use `useFocus` hook
   - Update all state setters to use context methods

3. **Update Event Handlers**
   ```typescript
   // Replace existing handlers with context methods
   const { handleTabNavigation, handlePolybarNavigation } = useFocus();
   ```

4. **Connect Scroll Management**
   - Replace existing scroll useEffect with context-based scroll

### 4. Component Updates (2-3 hours)
**Priority**: HIGH
**Complexity**: Low

#### Components to Update:
1. **Polybar.tsx**
   - Use `useFocusState()` for read-only access
   - Remove prop drilling of `activeContent`

2. **NavigationTile.tsx**
   - Use `useFocusNavigation()` for navigation
   - Update click handlers to use context methods

3. **ContentViewer.tsx**
   - Use `handleContentNavigation` from context
   - Ensure proper focus on navigation

4. **NeofetchTile.tsx**
   - Use `useFocusState()` for blur detection
   - No behavior changes needed

### 5. State Validation Rules (1-2 hours)
**Priority**: MEDIUM
**Complexity**: Low

#### Implement Validation:
- ✅ Neofetch → About content enforcement
- ✅ Content tile → Non-about content preference
- ✅ Navigation tile → Content preservation
- ⏳ Add custom validation for edge cases

### 6. Testing Suite (2-3 hours)
**Priority**: HIGH
**Complexity**: Medium

#### Test Categories:

##### Unit Tests
```typescript
// __tests__/contexts/FocusContext.test.tsx
- State initialization
- Transition validation
- History management
- Scroll queue behavior
```

##### Integration Tests
```typescript
// __tests__/integration/navigation.test.tsx
- Tab navigation flow
- Polybar synchronization
- Content navigation
- Focus restoration
```

##### Manual Testing Checklist
- [ ] Tab through all tiles (forward)
- [ ] Shift+Tab (reverse)
- [ ] Click navigation items
- [ ] Polybar workspace switching
- [ ] Content link navigation
- [ ] Mobile/stacked mode
- [ ] Browser back/forward
- [ ] Focus indicators visible
- [ ] No console errors

## Implementation Schedule

### Day 1 (8 hours)
**Morning (4 hours)**
- [x] Create FocusContext - 2 hours
- [x] Implement custom hooks - 1 hour
- [x] Write TypeScript interfaces - 1 hour

**Afternoon (4 hours)**
- [ ] Integrate with LayoutManager - 2 hours
- [ ] Update child components - 2 hours

### Day 2 (8 hours)
**Morning (4 hours)**
- [ ] Complete integration - 2 hours
- [ ] Add validation rules - 1 hour
- [ ] Fix any TypeScript errors - 1 hour

**Afternoon (4 hours)**
- [ ] Write unit tests - 2 hours
- [ ] Integration testing - 1 hour
- [ ] Documentation update - 1 hour

## Success Criteria

### Functional Requirements
- [ ] All state managed through FocusContext
- [ ] No prop drilling for focus/content state
- [ ] Validation prevents invalid states
- [ ] History enables back navigation
- [ ] Debug logging aids development

### Performance Metrics
- [ ] Context updates < 16ms
- [ ] No unnecessary re-renders
- [ ] Smooth 60fps animations
- [ ] Memory usage stable

### Code Quality
- [ ] 100% TypeScript coverage
- [ ] No any types used
- [ ] All functions documented
- [ ] Test coverage > 80%

## Migration Guide

### Before (Current Implementation)
```typescript
const [activeContent, setActiveContent] = useState<ContentType>({ type: 'about' });
const [focusedTile, setFocusedTile] = useState<'neofetch' | 'navigation' | 'content'>('content');

// Direct state updates
setActiveContent({ type: 'projects-overview' });
setFocusedTile('content');
```

### After (With FocusContext)
```typescript
const { activeContent, focusedTile, handleContentNavigation } = useFocus();

// Managed state updates with validation
handleContentNavigation({ type: 'projects-overview' });
// Automatically sets both content and tile with validation
```

## Risk Mitigation

### Potential Issues & Solutions

1. **Breaking Changes**
   - Risk: Existing functionality breaks
   - Mitigation: Incremental migration with fallbacks
   - Solution: Keep old state as backup during transition

2. **Performance Regression**
   - Risk: Context causes excessive re-renders
   - Mitigation: Use React.memo and useMemo strategically
   - Solution: Profile with React DevTools

3. **TypeScript Conflicts**
   - Risk: Type mismatches during migration
   - Mitigation: Use gradual typing with // @ts-expect-error
   - Solution: Fix types incrementally

## Rollback Plan

If critical issues arise:

1. **Quick Revert**
   ```bash
   git revert HEAD~1  # Revert FocusContext integration
   npm run dev  # Verify old implementation works
   ```

2. **Feature Flag Alternative**
   ```typescript
   const USE_FOCUS_CONTEXT = process.env.NEXT_PUBLIC_USE_FOCUS_CONTEXT === 'true';

   if (USE_FOCUS_CONTEXT) {
     // New implementation
   } else {
     // Old implementation
   }
   ```

## Next Steps (Phase 2 Preview)

After Phase 1 completion:
1. **Tab Navigation Enhancement** (Phase 2)
   - Complete keyboard navigation
   - Add arrow key support
   - Implement skip links

2. **Content Focus Fix** (Phase 3)
   - Event coordination
   - Click handler optimization
   - Visual feedback

3. **Scroll Optimization** (Phase 4)
   - Unified scroll controller
   - Framer Motion integration
   - Performance optimization

## Support & Resources

### Documentation
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)

### Team Contacts
- Technical Lead: Review PR before merge
- QA Team: Manual testing checklist
- DevOps: Monitor performance metrics

## Appendix: Quick Commands

```bash
# Run development server
npm run dev

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build
```

---

**Document Status**: Active
**Next Review**: After Phase 1 completion
**Approval**: Pending technical review