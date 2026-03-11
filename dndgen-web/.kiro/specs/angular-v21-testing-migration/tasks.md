# Implementation Plan: Angular v21 Testing Migration

## Overview

This plan migrates the DnDGen web application from Karma + Jasmine + zone.js to Vitest for Angular v21. The migration follows 9 phases: configuration setup with temporary shims, foundation tests, then each generator module (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen), cleanup including shim removal, and finally file naming standardization. Large test files are broken into manageable chunks (200-800 lines per task) to ensure reliable migrations.

**Shimming Strategy**: test-shims.d.ts allows unmigrated files to compile (they still use Jasmine globals). As each file is migrated, explicit Vitest imports are added to that file immediately. The shims prevent compilation errors from unmigrated files while you work incrementally. Once all files are migrated, the shims are removed (they're no longer needed).

## Tasks

- [ ] 1. Phase 1: Configuration Setup
  - [x] 1.1 Install Vitest dependencies and remove Karma dependencies
    - Run: `npm install -D jsdom vite vitest`
    - Run: `npm uninstall @types/jasmine karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter`
    - _Requirements: 1.1, 1.5, 3.3_

  - [x] 1.2 Create temporary test shims file for compilation during migration
    - Create `dndgen-web/src/test-shims.d.ts` with global type definitions
    - Shims provide type definitions for UNMIGRATED files that still use Jasmine syntax
    - Migrated files will have explicit Vitest imports and won't use the shims
    - TEMPORARY: Will be removed in Phase 8 after all files are migrated
    - Content: Global declarations for describe, it, expect, beforeEach, afterEach, vi
    - _Requirements: 1.1, 3.2_

  - [ ] 1.3 Update angular.json for Vitest
    - Change test builder to `@angular/build:unit-test`
    - Remove zone.js from test polyfills
    - Add test options: include, testTimeout, hookTimeout, bail, reporters, coverage
    - Add ci configuration with junit reporter
    - Do NOT create separate vitest.config.ts (Angular handles configuration)
    - _Requirements: 1.1, 1.3, 2.4, 2.5, 3.1, 3.5_

  - [ ] 1.4 Update tsconfig.spec.json
    - Change types array from ["jasmine"] to ["vitest"]
    - Keep "@angular/localize" in types
    - Add "src/test-shims.d.ts" to files array (temporary, removed in Phase 8)
    - _Requirements: 3.2_

  - [ ] 1.5 Update package.json test scripts
    - Update scripts to use `ng test` (NOT `vitest` directly)
    - Add: test, test:watch, test:ui, test:coverage
    - Add CI script: test:ci with explicit `--outputFile.junit=./TestResults-DnDGen-Website.xml`
    - Add subset scripts: test:cd:rollgen, test:cd:treasuregen, test:cd:charactergen, test:cd:encountergen, test:cd:dungeongen, test:cd:web
    - Each subset script uses explicit `--outputFile.junit` with pattern `TestResults-{Component}-Website.xml`
    - _Requirements: 1.2, 3.4, 10.1, 10.2, 10.3_

  - [ ] 1.6 Verify basic Vitest execution with ng test
    - Run `ng test` to verify Vitest can execute through Angular CLI
    - Verify test discovery works
    - This confirms the compilation shim approach works
    - _Requirements: 1.2_

  - [ ] 1.7 Verify basic Vitest execution with sample test
    - Create `dndgen-web/src/app/dummy.spec.ts` with explicit Vitest imports
    - Include: `import { describe, it, expect } from 'vitest';`
    - Add simple test: `describe('Dummy', () => { it('should pass', () => { expect(true).toBe(true); }); });`
    - Run `ng test --include='src/app/dummy.spec.ts'` to verify Vitest can find, compile, and execute the test
    - Test MUST PASS - if it fails, fix configuration issues before proceeding
    - Delete dummy.spec.ts after verification
    - _Requirements: 1.2_


- [ ] 2. Phase 2: Foundation Tests (TestHelper, App, Shared)
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 2.1 Update TestHelper class for zoneless compatibility
    - Remove `fixture.detectChanges()` calls from `waitForService()` method
    - Keep only `await fixture.whenStable()` (handles change detection in zoneless mode)
    - Update any other methods that use `detectChanges()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 9.3_

  - [ ] 2.2 Update test-helper.ts for Vitest compatibility
    - File is already named test-helper.ts (utility class, not a test file)
    - Update any Jasmine-specific code if present
    - Ensure compatibility with Vitest testing environment
    - Note: This is the TestHelper class itself, not a test file for it
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 2.3 Write property test for TestHelper
    - **Property 9: TestHelper compatibility**
    - **Validates: Requirements 8.1, 8.4**

  - [ ] 2.4 Migrate app.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Update router test patterns for Angular v21 timing
    - Use `await vi.waitFor()` around navigation assertions if needed
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.4, 5.1, 5.4, 9.3_

  - [ ] 2.5 Migrate app.routes.spec.ts
    - Update RouterTestingHarness usage for Angular v21
    - Ensure navigation completes before assertions
    - Use `await harness.navigateByUrl()` followed by `await vi.waitFor()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 2.6 Write property test for router navigation
    - **Property 5: Navigation completion before assertions**
    - **Validates: Requirements 5.1, 5.4**

  - [ ] 2.7 Migrate shared component tests
    - Migrate loading.component.spec.ts
    - Migrate details.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 2.8 Migrate shared service tests
    - Migrate logger.service.spec.ts
    - Migrate sweetAlert.service.spec.ts
    - Migrate fileSaver.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1, 4.4_

  - [ ] 2.9 Migrate shared pipe tests
    - Migrate bonus.pipe.spec.ts
    - Migrate bonuses.pipe.spec.ts
    - Update assertions to use Vitest expect API
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 2.10 Migrate nav-menu tests
    - Migrate nav-menu component tests
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 2.11 Migrate home and error page tests
    - Migrate home page component tests
    - Migrate error page component tests
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 2.12 Checkpoint - Verify foundation tests pass
    - Run `ng test --include='src/app/shared/**/*.spec.ts' --include='src/app/nav-menu/**/*.spec.ts' --include='src/app/home/**/*.spec.ts' --include='src/app/error/**/*.spec.ts' --include='src/app/app.*.spec.ts'` to verify all foundation tests pass
    - Ensure TestHelper changes work correctly
    - Document any patterns discovered
    - Ask user if questions arise
    - _Requirements: 6.3, 6.5_


- [ ] 3. Phase 3: RollGen Migration
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 3.1 Migrate roll.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Update HTTP mock patterns for Vitest
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.2 Migrate rollgen.component.spec.ts - Unit tests part 1 (lines 12-300)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle debouncing tests (tick(500) → await vi.advanceTimersByTimeAsync(500))
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.3 Migrate rollgen.component.spec.ts - Unit tests part 2 (lines 301-537)
    - Continue spy and async pattern replacements
    - Handle multiple tick() calls with multiple awaits
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.4 Migrate rollgen.component.spec.ts - Integration setup (lines 538-597)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 3.5 Migrate rollgen.component.spec.ts - Integration standard tab (lines 598-822)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 3.6 Migrate rollgen.component.spec.ts - Integration custom tab (lines 823-1048)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 3.7 Migrate rollgen.component.spec.ts - Integration expression tab (lines 1049-1092)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ]* 3.8 Write property test for RollGen async handling
    - **Property 4: All tests pass with Vitest**
    - **Validates: Requirements 4.5, 7.4**

  - [ ] 3.9 Checkpoint - Verify RollGen tests pass
    - Run `ng test --include='src/app/roll/**/*.spec.ts'` to verify all RollGen tests pass
    - Document any RollGen-specific patterns
    - Ask user if questions arise
    - _Requirements: 6.3_


- [ ] 4. Phase 4: TreasureGen Migration
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 4.1 Migrate treasure.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Update HTTP mock patterns for Vitest
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.2 Migrate treasure pipe tests
    - Migrate treasure.pipe.spec.ts
    - Migrate item.pipe.spec.ts
    - Update assertions to use Vitest expect API
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 4.3 Migrate treasuregenViewModel.model.spec.ts
    - Update test syntax for Vitest
    - Replace any Jasmine-specific patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 4.4 Migrate treasuregen.component.spec.ts - Unit tests part 1 (lines 26-500)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle debouncing and timing tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.5 Migrate treasuregen.component.spec.ts - Unit tests part 2 (lines 501-986)
    - Continue spy and async pattern replacements
    - Handle generation and operation tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.6 Migrate treasuregen.component.spec.ts - Integration setup (lines 987-1060)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 4.7 Migrate treasuregen.component.spec.ts - Integration treasure tab (lines 1061-1281)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 4.8 Migrate treasuregen.component.spec.ts - Integration item tab (lines 1282-1761)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 4.9 Migrate treasure.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 4.10 Migrate item.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 4.11 Write property test for TreasureGen migration consistency
    - **Property 7: Consistent migration patterns**
    - **Validates: Requirements 7.1**

  - [ ] 4.12 Checkpoint - Verify TreasureGen tests pass
    - Run `ng test --include='src/app/treasure/**/*.spec.ts'` to verify all TreasureGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_


- [ ] 5. Phase 5: CharacterGen Migration
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 5.1 Migrate character service tests
    - Migrate character.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.2 Migrate character model tests
    - Migrate character model spec files
    - Update test syntax for Vitest
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 5.3 Migrate charactergen.component.spec.ts - Unit tests part 1 (lines 21-600)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle setup, initialization, and validation tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.4 Migrate charactergen.component.spec.ts - Unit tests part 2 (lines 601-1200)
    - Continue spy and async pattern replacements
    - Handle validation with randomizers tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.5 Migrate charactergen.component.spec.ts - Unit tests part 3 (lines 1201-1800)
    - Continue spy and async pattern replacements
    - Handle generation setup and basic generation tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.6 Migrate charactergen.component.spec.ts - Unit tests part 4 (lines 1801-2288)
    - Continue spy and async pattern replacements
    - Handle leadership generation and download tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.7 Migrate charactergen.component.spec.ts - Integration setup (lines 2289-2414)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle setup and basic rendering tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 5.8 Migrate charactergen.component.spec.ts - Integration character tab part 1 (lines 2415-2900)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle form controls and validation tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 5.9 Migrate charactergen.component.spec.ts - Integration character tab part 2 (lines 2901-3547)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle generation and display tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 5.10 Migrate charactergen.component.spec.ts - Integration leadership tab (lines 3548-end)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle leadership tab tests
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 5.11 Migrate character.pipe.spec.ts - Tests 1-7 (lines 27-900)
    - Update test syntax for Vitest
    - Replace any Jasmine-specific patterns
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 5.12 Migrate character.pipe.spec.ts - Tests 8-14 (lines 901-1700)
    - Continue test syntax updates
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 5.13 Migrate character.pipe.spec.ts - Tests 15-21 (lines 1701-2400)
    - Continue test syntax updates
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 5.14 Migrate character.pipe.spec.ts - Tests 22-27 (lines 2401-2780)
    - Complete test syntax updates
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 5.15 Migrate character.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 5.16 Write property test for CharacterGen test coverage
    - **Property 8: Test coverage preservation**
    - **Validates: Requirements 7.2**

  - [ ] 5.17 Checkpoint - Verify CharacterGen tests pass
    - Run `ng test --include='src/app/character/**/*.spec.ts'` to verify all CharacterGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_


- [ ] 6. Phase 6: EncounterGen Migration
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 6.1 Migrate encounter service tests
    - Migrate encounter.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 6.2 Migrate encounter model tests
    - Migrate encounter model spec files
    - Update test syntax for Vitest
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 6.3 Migrate encountergen.component.spec.ts - Unit tests
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle all unit test describe blocks
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 6.4 Migrate encountergen.component.spec.ts - Integration tests
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle all integration test describe blocks
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 6.5 Migrate encounter.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 6.6 Write property test for EncounterGen TestBed compatibility
    - **Property 11: TestBed component creation works**
    - **Validates: Requirements 9.3**

  - [ ] 6.7 Checkpoint - Verify EncounterGen tests pass
    - Run `ng test --include='src/app/encounter/**/*.spec.ts'` to verify all EncounterGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 7. Phase 7: DungeonGen Migration
  
  **Note**: Add explicit Vitest imports to each file as you migrate it. Shims allow unmigrated files to compile.

  - [ ] 7.1 Migrate dungeon service tests
    - Migrate dungeon.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 7.2 Migrate dungeon model tests
    - Migrate dungeon model spec files
    - Update test syntax for Vitest
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 4.1_

  - [ ] 7.3 Migrate dungeongen.component.spec.ts - Unit tests
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle all unit test describe blocks
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 7.4 Migrate dungeongen.component.spec.ts - Integration tests
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle all integration test describe blocks
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 7.5 Migrate dungeon component tests
    - Migrate dungeonTreasure.component.spec.ts
    - Migrate area.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 7.6 Write property test for DungeonGen component tests
    - **Property 12: Component tests pass**
    - **Validates: Requirements 9.5**

  - [ ] 7.7 Checkpoint - Verify DungeonGen tests pass
    - Run `ng test --include='src/app/dungeon/**/*.spec.ts'` to verify all DungeonGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_


- [ ] 8. Phase 8: Cleanup and Verification
  
  **Critical Phase**: Remove temporary shims and verify explicit imports work correctly.

  - [ ] 8.1 Remove test-shims.d.ts file
    - Delete `dndgen-web/src/test-shims.d.ts`
    - This file was temporary scaffolding for migration
    - All spec files now have explicit Vitest imports
    - _Requirements: 3.2_

  - [ ] 8.2 Remove test-shims.d.ts from tsconfig.spec.json
    - Remove "src/test-shims.d.ts" from files array in tsconfig.spec.json
    - Keep other entries in files array
    - _Requirements: 3.2_

  - [ ] 8.3 Verify tests still pass after shim removal
    - Run `ng test` to verify all tests pass with explicit imports
    - If any tests fail, add missing imports to those files
    - This confirms explicit imports are working correctly
    - _Requirements: 7.4_

  - [ ] 8.4 Update CI/CD pipeline - build.yml
    - Update build.yml PublishTestResults task (line ~304)
    - Change from: `testResultsFiles: '**/TESTS-*.xml'`
    - To: `testResultsFiles: 'dndgen-web/TestResults-DnDGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.5 Update CI/CD pipeline - release.yml RollGen_Api
    - Update RollGen_Api PublishTestResults task (line ~72)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-RollGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.6 Update CI/CD pipeline - release.yml TreasureGen_Api
    - Update TreasureGen_Api PublishTestResults task (line ~151)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-TreasureGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.7 Update CI/CD pipeline - release.yml CharacterGen_Api
    - Update CharacterGen_Api PublishTestResults task (line ~230)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-CharacterGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.8 Update CI/CD pipeline - release.yml EncounterGen_Api
    - Update EncounterGen_Api PublishTestResults task (line ~309)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-EncounterGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.9 Update CI/CD pipeline - release.yml DungeonGen_Api
    - Update DungeonGen_Api PublishTestResults task (line ~388)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-DungeonGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.10 Update CI/CD pipeline - release.yml Web_Api
    - Update Web_Api PublishTestResults task (line ~467)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-AllGenerators-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.11 Remove Karma configuration files
    - Delete karma.conf.js
    - Delete karma.conf.ci.js
    - _Requirements: 1.5_

  - [ ] 8.12 Remove zone.js dependency
    - Remove zone.js from package.json devDependencies
    - Verify zone.js is not imported anywhere in test files
    - _Requirements: 2.4, 2.5_

  - [ ] 8.13 Run full test suite verification
    - Run `ng test` to verify all tests pass
    - Run `npm run test:ci` to verify CI configuration works
    - Verify test result file is created: TestResults-DnDGen-Website.xml
    - _Requirements: 7.4, 10.1_

  - [ ] 8.14 Verify test subset commands
    - Run each test:cd:* command to verify subset filtering works
    - Verify each command creates its specific output file
    - Commands: test:cd:rollgen, test:cd:treasuregen, test:cd:charactergen, test:cd:encountergen, test:cd:dungeongen, test:cd:web
    - _Requirements: 10.3_

  - [ ]* 8.15 Write property test for test subset filtering
    - **Property 13: Test subset filtering works**
    - **Validates: Requirements 10.3**

  - [ ] 8.16 Verify zone.js is not loaded in tests
    - Add verification test: `expect(typeof Zone).toBe('undefined')`
    - Ensure no zone.js imports in test files
    - _Requirements: 2.5_

  - [ ] 8.17 Run coverage report
    - Run `ng test --coverage` to generate coverage report
    - Verify coverage excludes test files
    - Review coverage to ensure no regression
    - _Requirements: 1.3_

  - [ ] 8.18 Update documentation
    - Update README.md with new test commands
    - Document migration patterns and solutions
    - Update any developer documentation referencing Karma
    - Document that `ng test` should always be used (not `vitest` directly)
    - _Requirements: 7.5_

  - [ ] 8.19 Final validation checkpoint
    - Verify all tests pass: `ng test`
    - Verify CI commands work: `npm run test:ci`
    - Verify subset commands work: all `npm run test:cd:*` commands
    - Verify CI/CD pipeline changes are correct
    - Verify explicit imports are in all spec files
    - Verify test-shims.d.ts is deleted
    - Ask user for final approval before considering migration complete
    - _Requirements: 7.4, 7.5, 10.4, 10.5_


- [ ] 9. Phase 9: Kebab-Case File Naming Standardization
  - [ ] 9.1 Rename shared service files to kebab-case
    - [ ] 9.1.1 Rename fileSaver.service.ts → file-saver.service.ts
      - Rename src/app/shared/services/fileSaver.service.ts
      - Rename src/app/shared/services/fileSaver.service.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.1.2 Rename sweetAlert.service.ts → sweet-alert.service.ts
      - Rename src/app/shared/services/sweetAlert.service.ts
      - Rename src/app/shared/services/sweetAlert.service.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.2 Rename character component files to kebab-case
    - [ ] 9.2.1 Rename spellGroup.component.ts → spell-group.component.ts
      - Rename src/app/character/components/spellGroup.component.ts
      - Rename src/app/character/components/spellGroup.component.spec.ts
      - Rename src/app/character/components/spellGroup.component.html
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.3 Rename character model files to kebab-case
    - [ ] 9.3.1 Rename armorClass.model.ts → armor-class.model.ts
      - Rename src/app/character/models/armorClass.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.2 Rename baseAttack.model.ts → base-attack.model.ts
      - Rename src/app/character/models/baseAttack.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.3 Rename characterClass.model.ts → character-class.model.ts
      - Rename src/app/character/models/characterClass.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.4 Rename charactergenViewModel.model.ts → charactergen-view-model.model.ts
      - Rename src/app/character/models/charactergenViewModel.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.5 Rename featCollection.model.ts → feat-collection.model.ts
      - Rename src/app/character/models/featCollection.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.6 Rename followerQuantities.model.ts → follower-quantities.model.ts
      - Rename src/app/character/models/followerQuantities.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.7 Rename savingThrows.model.ts → saving-throws.model.ts
      - Rename src/app/character/models/savingThrows.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.8 Rename spellGroup.model.ts → spell-group.model.ts
      - Rename src/app/character/models/spellGroup.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.3.9 Rename spellQuantity.model.ts → spell-quantity.model.ts
      - Rename src/app/character/models/spellQuantity.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.4 Rename character pipe files to kebab-case
    - [ ] 9.4.1 Rename inchesToFeet.pipe.ts → inches-to-feet.pipe.ts
      - Rename src/app/character/pipes/inchesToFeet.pipe.ts
      - Rename src/app/character/pipes/inchesToFeet.pipe.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.4.2 Rename spellQuantity.pipe.ts → spell-quantity.pipe.ts
      - Rename src/app/character/pipes/spellQuantity.pipe.ts
      - Rename src/app/character/pipes/spellQuantity.pipe.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.5 Rename character service files to kebab-case
    - [ ] 9.5.1 Rename spellGroup.service.ts → spell-group.service.ts
      - Rename src/app/character/services/spellGroup.service.ts
      - Rename src/app/character/services/spellGroup.service.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.6 Rename dungeon component files to kebab-case
    - [ ] 9.6.1 Rename dungeonTreasure.component.ts → dungeon-treasure.component.ts
      - Rename src/app/dungeon/components/dungeonTreasure.component.ts
      - Rename src/app/dungeon/components/dungeonTreasure.component.spec.ts
      - Rename src/app/dungeon/components/dungeonTreasure.component.html
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.7 Rename dungeon model files to kebab-case
    - [ ] 9.7.1 Rename dungeongenViewModel.model.ts → dungeongen-view-model.model.ts
      - Rename src/app/dungeon/models/dungeongenViewModel.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.7.2 Rename dungeonTreasure.model.ts → dungeon-treasure.model.ts
      - Rename src/app/dungeon/models/dungeonTreasure.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.8 Rename encounter model files to kebab-case
    - [ ] 9.8.1 Rename creatureTypeFilter.model.ts → creature-type-filter.model.ts
      - Rename src/app/encounter/models/creatureTypeFilter.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.8.2 Rename encounterCreature.model.ts → encounter-creature.model.ts
      - Rename src/app/encounter/models/encounterCreature.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.8.3 Rename encounterDefaults.model.ts → encounter-defaults.model.ts
      - Rename src/app/encounter/models/encounterDefaults.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.8.4 Rename encountergenViewModel.model.ts → encountergen-view-model.model.ts
      - Rename src/app/encounter/models/encountergenViewModel.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.9 Rename encounter pipe files to kebab-case
    - [ ] 9.9.1 Rename encounterCreature.pipe.ts → encounter-creature.pipe.ts
      - Rename src/app/encounter/pipes/encounterCreature.pipe.ts
      - Rename src/app/encounter/pipes/encounterCreature.pipe.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.10 Rename roll model files to kebab-case
    - [ ] 9.10.1 Rename rollgenViewModel.model.ts → rollgen-view-model.model.ts
      - Rename src/app/roll/models/rollgenViewModel.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.10.2 Rename standardDie.model.ts → standard-die.model.ts
      - Rename src/app/roll/models/standardDie.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.11 Rename treasure model files to kebab-case
    - [ ] 9.11.1 Rename itemTypeViewModel.model.ts → item-type-view-model.model.ts
      - Rename src/app/treasure/models/itemTypeViewModel.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.11.2 Rename specialAbility.model.ts → special-ability.model.ts
      - Rename src/app/treasure/models/specialAbility.model.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.11.3 Rename treasuregenViewModel.model.ts → treasuregen-view-model.model.ts
      - Rename src/app/treasure/models/treasuregenViewModel.model.ts
      - Rename src/app/treasure/models/treasuregenViewModel.model.spec.ts
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

  - [ ] 9.12 Rename nav-menu to navigation-menu for clarity
    - [ ] 9.12.1 Rename nav-menu directory to navigation-menu
      - Rename src/app/nav-menu → src/app/navigation-menu
      - All component files will move with directory
      - Imports will be updated automatically via smartRelocate
      - _Requirements: 7.5_

    - [ ] 9.12.2 Rename nav-menu component files
      - Rename navigation-menu.component.ts (if needed after directory rename)
      - Rename navigation-menu.component.spec.ts (if needed)
      - Rename navigation-menu.component.html (if needed)
      - Rename navigation-menu.component.css (if needed)
      - Update component selector from 'app-nav-menu' to 'app-navigation-menu' in component decorator
      - Update selector usage in app.component.html
      - _Requirements: 7.5_

  - [ ] 9.13 Verify all renames and run tests
    - Run `ng test` to verify all tests still pass after renaming
    - Verify no broken imports remain
    - Check that production build works: `npm run build:ci`
    - _Requirements: 7.4, 7.5_

  - [ ] 9.14 Update documentation for naming conventions
    - Document kebab-case standard in README.md or contributing guide
    - Note that all file names should use kebab-case per Angular style guide
    - _Requirements: 7.5_


## Notes

- Tasks marked with `*` are optional and can be skipped for faster completion
- Each phase builds on the previous phase - complete phases in order
- Large test files are broken into chunks (200-800 lines) to ensure reliable migrations
- Run tests after each file migration to catch issues early
- Use `ng test --include='<path>'` to test specific files or directories (NOT `vitest` directly)
- CI/CD pipeline updates use explicit test result filenames following pattern: `TestResults-{Component}-Website.xml`
- TestHelper changes in Phase 2 are critical - all subsequent phases depend on zoneless compatibility
- Checkpoints ensure incremental validation and provide opportunities to address issues before proceeding
- Phase 1 creates temporary test-shims.d.ts to enable compilation during migration
- Phases 2-7 migrate tests AND add explicit Vitest imports to each file immediately
- Phase 8 removes shims and verifies everything still works with explicit imports
- Phase 9 standardizes file naming to kebab-case per Angular style guide
- Always use `ng test` commands, never run `vitest` directly - Angular integration requires `ng test`
- **CRITICAL - Failure Handling**: If you encounter a test failure or compilation error, output detailed information about the failure (error messages, stack traces, affected files) and STOP. Let the user decide how to troubleshoot and fix. Do not attempt multiple fix iterations - this prevents thrashing and saves tokens/credits.
