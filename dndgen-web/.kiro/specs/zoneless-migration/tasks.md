# Implementation Plan

- [x] 1. Create automated diagnostic tests





  - Create test file to diagnose Zone.js and change detection issues
  - Tests will run via `npm test` and output clear diagnostic information
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Create Zone.js health check test


  - Write test that verifies Zone.js is loaded and active
  - Test that Zone.js intercepts async operations (setTimeout, Promise, etc.)
  - Output diagnostic information to console
  - _Requirements: 1.1_

- [x] 1.2 Create change detection diagnostic test for RollGen


  - Write test that reproduces the loading indicator freeze issue
  - Test simulates API call and verifies loading state updates automatically
  - Test checks if DOM updates without manual `detectChanges()` call
  - Output diagnostic information indicating whether Zone.js triggers change detection
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 1.3 Run diagnostic tests and determine root cause


  - Execute diagnostic tests via `npm test`
  - Review test output and console logs
  - Determine whether to implement Option A (Zone.js fix) or Option B (zoneless migration)
  - Document findings
  - _Requirements: 1.5_

- [x] 2. Implement fix for RollGen based on diagnostic results





  - Apply the appropriate solution (Option A or B) to RollGen component
  - Ensure all loading states update correctly
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Implement Option A: Zone.js fix for RollGen (if diagnostics indicate Zone.js is working)

  - Inject `ChangeDetectorRef` and `NgZone` into RollGen component
  - Add explicit `detectChanges()` calls after async operations complete
  - Ensure operations run inside Angular's zone with `ngZone.run()`
  - _Requirements: 2.2, 2.3_

- [x] 2.2 Implement Option B: Zoneless migration for RollGen (if diagnostics indicate Zone.js is broken)


  - Convert component properties to signals (`loading`, `rolling`, `validating`, `roll`, `rollIsValid`, `rollModel`)
  - Keep regular properties for inputs (`@Input()` decorated properties)
  - Keep regular properties for constants (enums, configuration)
  - Update component methods to use signal setters (`.set()`, `.update()`)
  - Use private helper methods for signal updates (e.g., `setRoll()`, `setViewModel()`)
  - Integrate RxJS with signals (observables work seamlessly with signal setters)
  - Use Subject pattern for debounced operations (e.g., expression validation)
  - Update RollGen template to use signal syntax with `()` for all signal references
  - Ensure error handlers reset all loading signals
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 2.3 Update RollGen error handling


  - Ensure all error handlers reset loading states correctly
  - Verify error states trigger UI updates immediately
  - _Requirements: 2.3_

- [x] 2.4 Update RollGen tests for the implemented solution


  - Update unit tests to use signal syntax: `component.property()` instead of `component.property`
  - Update unit tests to use signal setters: `component.property.set(value)` instead of `component.property = value`
  - Keep regular property access unchanged for inputs and constants
  - Update integration tests to use signal setters for state changes
  - Verify test helper methods work with signal values (no changes needed to helpers)
  - Ensure all existing tests pass with signal syntax
  - No new tests required (signals work transparently)
  - _Requirements: 2.5_

- [x] 3. Verify RollGen fix works correctly
  - Run all RollGen tests to ensure they pass
  - Manually test RollGen in browser
  - Verify loading indicators appear and disappear without tab switching
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Replicate fix to TreasureGen
  - Apply the same solution pattern used for RollGen
  - Update component TypeScript and template
  - Update tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5.1 Apply fix to TreasureGen component





  - Implement same pattern as RollGen (zoneless with signals)
  - Convert reactive state properties to signals (loading, generating, validating, etc.)
  - Keep regular properties for inputs (`@Input()` decorated)
  - Keep regular properties for constants (enums, configuration)
  - Use private helper methods for signal updates
  - Integrate RxJS observables with signal setters
  - Update TreasureGen template to add `()` to all signal references
  - Ensure error handlers reset all loading signals
  - _Requirements: 4.1, 4.2_

- [x] 5.2 Update TreasureGen error handling




  - Ensure error handlers reset all loading states
  - Verify error states trigger UI updates
  - _Requirements: 4.3_

- [x] 5.3 Update TreasureGen tests




  - Update unit tests to use signal syntax: `component.property()` and `component.property.set(value)`
  - Keep regular property access unchanged for inputs and constants
  - Update integration tests to use signal setters
  - Verify all tests pass
  - _Requirements: 4.1_

- [x] 5.4 Run TreasureGen automated tests





  - Run TreasureGen tests via `npm test`
  - Verify all tests pass
  - _Requirements: 4.1_

- [x] 5.5 Manual browser testing for TreasureGen (USER ONLY - DO NOT AUTO-COMPLETE)
  - **IMPORTANT**: This task can ONLY be checked off by the user after manual testing
  - Open TreasureGen in browser
  - Test treasure generation with various inputs
  - Verify loading indicators appear and disappear correctly WITHOUT tab switching
  - Test error scenarios (invalid inputs, API failures)
  - Verify validation indicators work correctly
  - Confirm no loading indicator freeze issues
  - _Requirements: 4.2, 4.4_

- [ ] 6. Replicate fix to CharacterGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6.1 Apply fix to CharacterGen component
  - Implement same pattern as RollGen (zoneless with signals)
  - Convert reactive state properties to signals
  - Keep regular properties for inputs and constants
  - Use private helper methods for signal updates
  - Update CharacterGen template to add `()` to all signal references
  - _Requirements: 4.1, 4.2_

- [ ] 6.2 Update CharacterGen error handling
  - Ensure error handlers reset all loading signals
  - _Requirements: 4.3_

- [ ] 6.3 Update CharacterGen tests
  - Update unit tests to use signal syntax
  - Update integration tests to use signal setters
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 6.4 Run CharacterGen automated tests
  - Run CharacterGen tests via `npm test`
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 6.5 Manual browser testing for CharacterGen (USER ONLY - DO NOT AUTO-COMPLETE)
  - **IMPORTANT**: This task can ONLY be checked off by the user after manual testing
  - Open CharacterGen in browser
  - Test character generation with various inputs
  - Verify loading indicators appear and disappear correctly WITHOUT tab switching
  - Test error scenarios (invalid inputs, API failures)
  - Verify validation indicators work correctly
  - Confirm no loading indicator freeze issues
  - _Requirements: 4.2, 4.4_

- [ ] 7. Replicate fix to EncounterGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7.1 Apply fix to EncounterGen component
  - Implement same pattern as RollGen (zoneless with signals)
  - Convert reactive state properties to signals
  - Keep regular properties for inputs and constants
  - Use private helper methods for signal updates
  - Update EncounterGen template to add `()` to all signal references
  - _Requirements: 4.1, 4.2_

- [ ] 7.2 Update EncounterGen error handling
  - Ensure error handlers reset all loading signals
  - _Requirements: 4.3_

- [ ] 7.3 Update EncounterGen tests
  - Update unit tests to use signal syntax
  - Update integration tests to use signal setters
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 7.4 Run EncounterGen automated tests
  - Run EncounterGen tests via `npm test`
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 7.5 Manual browser testing for EncounterGen (USER ONLY - DO NOT AUTO-COMPLETE)
  - **IMPORTANT**: This task can ONLY be checked off by the user after manual testing
  - Open EncounterGen in browser
  - Test encounter generation with various inputs
  - Verify loading indicators appear and disappear correctly WITHOUT tab switching
  - Test error scenarios (invalid inputs, API failures)
  - Verify validation indicators work correctly
  - Confirm no loading indicator freeze issues
  - _Requirements: 4.2, 4.4_

- [ ] 8. Replicate fix to DungeonGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8.1 Apply fix to DungeonGen component
  - Implement same pattern as RollGen (zoneless with signals)
  - Convert reactive state properties to signals
  - Keep regular properties for inputs and constants
  - Use private helper methods for signal updates
  - Update DungeonGen template to add `()` to all signal references
  - _Requirements: 4.1, 4.2_

- [ ] 8.2 Update DungeonGen error handling
  - Ensure error handlers reset all loading signals
  - _Requirements: 4.3_

- [ ] 8.3 Update DungeonGen tests
  - Update unit tests to use signal syntax
  - Update integration tests to use signal setters
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 8.4 Run DungeonGen automated tests
  - Run DungeonGen tests via `npm test`
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 8.5 Manual browser testing for DungeonGen (USER ONLY - DO NOT AUTO-COMPLETE)
  - **IMPORTANT**: This task can ONLY be checked off by the user after manual testing
  - Open DungeonGen in browser
  - Test dungeon generation with various inputs
  - Verify loading indicators appear and disappear correctly WITHOUT tab switching
  - Test error scenarios (invalid inputs, API failures)
  - Verify validation indicators work correctly
  - Confirm no loading indicator freeze issues
  - _Requirements: 4.2, 4.4_

- [ ] 9. Update application configuration for zoneless
  - Remove zone.js from polyfills in angular.json
  - Add `provideExperimentalZonelessChangeDetection()` to main.ts
  - Update test configuration to remove zone.js from test polyfills
  - _Requirements: 5.2, 5.3_

- [x] 9.1 Update app.component.spec.ts change detection tests



  - Remove tests that check for zone.js presence
  - Add tests that verify zoneless change detection is enabled
  - Ensure tests check for `provideExperimentalZonelessChangeDetection()` in app config
  - _Requirements: 5.2, 5.3_

- [x] 9.2 Fix RollGen change detection tests


  - Update all RollGen tests to use signal syntax `component.property()` instead of `component.property`
  - Update property setters to use `component.property.set(value)` instead of `component.property = value`
  - Ensure all tests pass with the new signal-based implementation
  - _Requirements: 2.5_

- [ ] 10. Final verification and testing
  - Run complete test suite across all generators via `npm test`
  - Verify all automated tests pass
  - _Requirements: 4.5_

- [ ] 10.1 Manual browser testing - All generators (USER ONLY - DO NOT AUTO-COMPLETE)
  - **IMPORTANT**: This task can ONLY be checked off by the user after manual testing
  - Test ALL generators in browser (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen)
  - Verify loading indicators work correctly across all generators
  - Test error scenarios across all generators
  - Confirm no loading indicator freeze issues remain in any generator
  - Verify consistent behavior across all generators
  - _Requirements: 4.5_

- [ ] 11. Checkpoint - Final validation
  - Ensure all tests pass, ask the user if questions arise.


---

## GOLD STANDARD ENFORCEMENT

**CRITICAL**: All generator migrations MUST strictly follow the RollGen implementation pattern. This section provides mandatory guidelines for task execution.

### Before Starting Any Generator Migration

1. **Read RollGen Implementation**:
   - `src/app/roll/components/rollgen.component.ts` (component logic)
   - `src/app/roll/components/rollgen.component.html` (template syntax)
   - `src/app/roll/components/rollgen.component.spec.ts` (test patterns)

2. **Review Design Document**:
   - Read "Generator Component Pattern (Option B: Zoneless with Signals) - ACTUAL IMPLEMENTATION"
   - Read "Zoneless Tests (with Signals) - ACTUAL IMPLEMENTATION from RollGen"
   - Read "Gold Standard Enforcement for All Generators"

### Mandatory Patterns for Component Migration

**Signals Declaration:**
```typescript
// ✅ REQUIRED for reactive UI state
public loading = signal(false);
public generating = signal(false);
public validating = signal(false);
public isValid = signal(true);
public result = signal<Type | undefined>(undefined);
public model = signal<ViewModelType | undefined>(undefined);

// ✅ REQUIRED for inputs - NO signals
@Input() quantity = 1;

// ✅ REQUIRED for constants - NO signals
public sizes = Size;
```

**Private Helper Methods:**
```typescript
// ✅ REQUIRED pattern
private setResult(data: Type): void {
  this.result.set(data);
  this.generating.set(false);
}

// ✅ REQUIRED - Reset ALL loading signals
private handleError(error: any): void {
  this.logger.logError(error.message);
  this.result.set(undefined);
  this.generating.set(false);
  this.validating.set(false);
  this.loading.set(false);
  this.sweetAlertService.showError();
}
```

### Mandatory Patterns for Template Migration

**Signal Syntax:**
```html
<!-- ✅ REQUIRED - Signals always use () -->
<dndgen-loading [isLoading]="loading()">
<button [disabled]="!isValid() || validating() || generating()">
@if (!generating()) { ... }

<!-- ✅ REQUIRED - Regular properties never use () -->
<select [(ngModel)]="itemType">
<option [ngValue]="type">{{type.name}}</option>
```

### Mandatory Patterns for Test Migration

**Unit Tests:**
```typescript
// ✅ REQUIRED - Signal access
expect(component.loading()).toBeTrue();
expect(component.result()).toEqual(data);

// ✅ REQUIRED - Regular property access
expect(component.quantity).toEqual(1);
```

**Integration Tests:**
```typescript
// ✅ REQUIRED - Signal setters
component.loading.set(true);
component.result.set(data);

// ✅ REQUIRED - Regular property assignment
component.quantity = 42;

// ✅ REQUIRED - Test helper usage
helper.expectLoading('selector', component.loading(), Size.Large);
```

**Disabled Tests:**
```typescript
// ✅ REQUIRED - Copy xdescribe block to ALL generators
xdescribe('change detection', () => {
  // Copy from RollGen, update selectors
});
```

### Task Execution Rules

**For Tasks 5.1, 6.1, 7.1, 8.1 (Component Migration):**
1. Open rollgen.component.ts side-by-side with target component
2. Identify all reactive UI state → convert to signals
3. Keep all `@Input()` properties as regular properties
4. Keep all constants/enums as regular properties
5. Create private helper methods for signal updates
6. Ensure error handler resets ALL loading signals
7. Verify RxJS integration uses signal setters

**For Tasks 5.1, 6.1, 7.1, 8.1 (Template Migration):**
1. Open rollgen.component.html side-by-side with target template
2. Add `()` to ALL signal references
3. Do NOT add `()` to regular properties
4. Verify property bindings: `[prop]="signal()"`
5. Verify structural directives: `@if (signal())`
6. Verify boolean expressions: `!signal() || signal()`

**For Tasks 5.3, 6.3, 7.3, 8.3 (Test Migration):**
1. Open rollgen.component.spec.ts side-by-side with target tests
2. Update ALL signal assertions: `component.signal()`
3. Update ALL signal setters: `component.signal.set(value)`
4. Keep regular property access unchanged: `component.property`
5. Update test helper calls: pass signal VALUES `component.signal()`
6. Copy and adapt `xdescribe` block from RollGen
7. Run tests and fix any syntax errors

**For Tasks 5.4, 6.4, 7.4, 8.4 (Automated Test Verification):**
1. Run `npm test` for the specific generator
2. Verify all tests pass
3. Fix any test failures
4. Check off the task once tests pass

**For Tasks 5.5, 6.5, 7.5, 8.5, 10.1 (Manual Browser Testing - USER ONLY):**
⚠️ **CRITICAL**: These tasks can ONLY be checked off by the user
⚠️ **DO NOT** auto-complete these tasks
⚠️ **DO NOT** mark these as done without explicit user confirmation

**Why Manual Testing is Critical:**
- The loading indicator bug ONLY occurs in production, not in tests
- Automated tests pass even when the bug exists
- Only manual browser testing can verify the fix works
- This is the ONLY way to confirm loading indicators don't freeze

**Manual Testing Procedure:**
1. Agent completes automated test task (5.4, 6.4, 7.4, or 8.4)
2. Agent informs user that manual testing is required
3. Agent provides specific testing instructions
4. User performs manual testing in browser
5. User confirms loading indicators work correctly
6. User manually checks off the manual testing task (5.5, 6.5, 7.5, 8.5, or 10.1)
7. Agent proceeds to next generator only after user confirmation

### Common Mistakes - DO NOT MAKE THESE

❌ **Component TypeScript:**
- Using regular properties for reactive UI state
- Using signals for `@Input()` properties
- Using signals for constants/enums
- Forgetting to reset all loading signals in error handler
- Not using private helper methods for signal updates

❌ **Component Template:**
- Forgetting `()` on signal references
- Adding `()` to regular properties
- Inconsistent signal syntax across template

❌ **Component Tests:**
- Using `component.signal` instead of `component.signal()`
- Using `component.signal = value` instead of `component.signal.set(value)`
- Using `component.property()` on regular properties
- Passing signal references instead of values to helpers

### Verification Before Completing Tasks

Before marking any generator migration task as complete:

1. **Compare with RollGen**: Side-by-side comparison of component, template, and tests
2. **Run Tests**: All automated tests must pass
3. **Check Syntax**: Use verification checklist from design document
4. **For Automated Tasks**: Can be marked complete once tests pass
5. **For Manual Testing Tasks**: Can ONLY be marked complete by user after browser testing

⚠️ **CRITICAL - Manual Testing Tasks:**
- Tasks 5.5, 6.5, 7.5, 8.5, 10.1 are USER-ONLY tasks
- Agent must NEVER auto-complete these tasks
- Agent must inform user when manual testing is needed
- Agent must wait for explicit user confirmation
- User must manually check off these tasks after browser testing
- These tasks verify the actual fix works (automated tests cannot detect the bug)

### If You Encounter Issues

1. **First**: Re-read the RollGen implementation
2. **Second**: Check the design document gold standard section
3. **Third**: Verify you're following the exact patterns
4. **Do NOT**: Create new patterns or "improvements"
5. **Do NOT**: Skip the verification checklist

The RollGen implementation is proven and tested. Strict adherence to these patterns ensures consistency and correctness across all generators.
