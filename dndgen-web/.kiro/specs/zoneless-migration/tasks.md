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
  - Update component methods to use signal setters (`.set()`, `.update()`)
  - Update RollGen template to use signal syntax with `()` for all signal references
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 2.3 Update RollGen error handling


  - Ensure all error handlers reset loading states correctly
  - Verify error states trigger UI updates immediately
  - _Requirements: 2.3_

- [x] 2.4 Update RollGen tests for the implemented solution


  - Update unit tests to match new implementation (property access syntax if signals)
  - Update integration tests to verify loading indicators work correctly
  - Ensure all existing tests pass
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

- [ ] 5.1 Apply fix to TreasureGen component
  - Implement same pattern as RollGen (Option A or B)
  - Convert properties to signals (if Option B) or add change detection triggers (if Option A)
  - Update TreasureGen template if using signals
  - _Requirements: 4.1, 4.2_

- [ ] 5.2 Update TreasureGen error handling
  - Ensure error handlers reset all loading states
  - Verify error states trigger UI updates
  - _Requirements: 4.3_

- [ ] 5.3 Update TreasureGen tests
  - Update test syntax to match implementation
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 5.4 Verify TreasureGen fix
  - Run TreasureGen tests
  - Manually test in browser
  - Verify loading indicators work correctly
  - _Requirements: 4.2, 4.4_

- [ ] 6. Replicate fix to CharacterGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6.1 Apply fix to CharacterGen component
  - Implement same pattern as RollGen
  - Update CharacterGen template if using signals
  - _Requirements: 4.1, 4.2_

- [ ] 6.2 Update CharacterGen error handling
  - Ensure error handlers reset all loading states
  - _Requirements: 4.3_

- [ ] 6.3 Update CharacterGen tests
  - Update test syntax to match implementation
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 6.4 Verify CharacterGen fix
  - Run CharacterGen tests
  - Manually test in browser
  - _Requirements: 4.2, 4.4_

- [ ] 7. Replicate fix to EncounterGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7.1 Apply fix to EncounterGen component
  - Implement same pattern as RollGen
  - Update EncounterGen template if using signals
  - _Requirements: 4.1, 4.2_

- [ ] 7.2 Update EncounterGen error handling
  - Ensure error handlers reset all loading states
  - _Requirements: 4.3_

- [ ] 7.3 Update EncounterGen tests
  - Update test syntax to match implementation
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 7.4 Verify EncounterGen fix
  - Run EncounterGen tests
  - Manually test in browser
  - _Requirements: 4.2, 4.4_

- [ ] 8. Replicate fix to DungeonGen
  - Apply the same solution pattern
  - Update component, template, and tests
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8.1 Apply fix to DungeonGen component
  - Implement same pattern as RollGen
  - Update DungeonGen template if using signals
  - _Requirements: 4.1, 4.2_

- [ ] 8.2 Update DungeonGen error handling
  - Ensure error handlers reset all loading states
  - _Requirements: 4.3_

- [ ] 8.3 Update DungeonGen tests
  - Update test syntax to match implementation
  - Verify all tests pass
  - _Requirements: 4.1_

- [ ] 8.4 Verify DungeonGen fix
  - Run DungeonGen tests
  - Manually test in browser
  - _Requirements: 4.2, 4.4_

- [ ] 9. Update application configuration (if Option B: zoneless)
  - Remove zone.js from polyfills in angular.json
  - Add `provideExperimentalZonelessChangeDetection()` to main.ts
  - Update test configuration to remove zone.js from test polyfills
  - _Requirements: 5.2, 5.3_

- [ ] 10. Final verification and testing
  - Run complete test suite across all generators
  - Manually test all generators in browser
  - Verify no loading indicator freeze issues remain
  - Test error scenarios across all generators
  - _Requirements: 4.5_

- [ ] 11. Checkpoint - Final validation
  - Ensure all tests pass, ask the user if questions arise.
