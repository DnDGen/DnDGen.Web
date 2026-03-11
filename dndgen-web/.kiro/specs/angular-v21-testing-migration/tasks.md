# Implementation Plan: Angular v21 Testing Migration

## Overview

This plan migrates the DnDGen web application from Karma + Jasmine + zone.js to Vitest for Angular v21. The migration follows 8 phases: configuration setup, foundation tests, then each generator module (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen), and finally cleanup. Large test files are broken into manageable chunks (200-800 lines per task) to ensure reliable migrations.

## Tasks

- [ ] 1. Phase 1: Configuration Setup
  - [x] 1.1 Install Vitest dependencies and remove Karma dependencies
    - Run: `npm install -D @analogjs/vite-plugin-angular @vitest/ui jsdom vite vitest`
    - Run: `npm uninstall @types/jasmine karma karma-firefox-launcher karma-chrome-launcher karma-jasmine karma-junit-reporter`
    - Note: Keep zone.js for now (removed in Phase 8)
    - _Requirements: 1.1, 1.5, 3.3_

  - [x] 1.2 Create Vitest configuration files
    - Create `dndgen-web/vitest.config.ts` for local development
    - Create `dndgen-web/vitest.config.ci.ts` for CI/CD pipelines
    - Configure asset handling, coverage, reporters, and test patterns per design
    - _Requirements: 1.1, 1.3, 3.5_

  - [x] 1.3 Create test setup file
    - Create `dndgen-web/src/test-setup.ts`
    - Initialize Angular testing environment for zoneless applications
    - Do not import zone.js (zoneless architecture)
    - _Requirements: 2.4, 2.5, 3.5_

  - [x] 1.4 Update angular.json for Vitest
    - Change test builder to use Vitest
    - Remove zone.js from test polyfills
    - Update test configuration to reference vitest.config.ts
    - _Requirements: 2.4, 2.5, 3.1_


  - [x] 1.5 Update tsconfig.spec.json
    - Replace Jasmine types with Vitest types
    - Update types array to include "vitest/globals"
    - Remove "@types/jasmine" reference
    - _Requirements: 3.2_

  - [x] 1.6 Update package.json test scripts
    - Add scripts: test, test:watch, test:ui, test:coverage
    - Add CI scripts: test:ci with explicit output file `--outputFile.junit=./TestResults-DnDGen-Website.xml`
    - Add subset scripts: test:cd:rollgen, test:cd:treasuregen, test:cd:charactergen, test:cd:encountergen, test:cd:dungeongen, test:cd:web
    - Each subset script uses explicit `--outputFile.junit` with pattern `TestResults-{Component}-Website.xml`
    - _Requirements: 1.2, 3.4, 10.1, 10.2, 10.3_

  - [x] 1.7 Verify basic Vitest execution
    - Run `npm test` to verify Vitest can execute (tests will fail, that's expected)
    - Verify configuration loads without errors
    - Check that test discovery works
    - _Requirements: 1.2_

- [ ] 2. Phase 2: Foundation Tests (TestHelper, App, Shared)
  - [ ] 2.1 Update TestHelper class for zoneless compatibility
    - Remove `fixture.detectChanges()` calls from `waitForService()` method
    - Keep only `await fixture.whenStable()` (handles change detection in zoneless mode)
    - Update any other methods that use `detectChanges()`
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 9.3_

  - [ ] 2.2 Migrate testHelper.spec.ts
    - Replace Jasmine spies with Vitest mocks (vi.fn(), vi.spyOn())
    - Replace fakeAsync/tick with async/await patterns
    - Update assertions to use Vitest expect API
    - _Requirements: 2.1, 2.2, 4.1, 4.4, 8.4_

  - [ ]* 2.3 Write property test for TestHelper
    - **Property 9: TestHelper compatibility**
    - **Validates: Requirements 8.1, 8.4**


  - [ ] 2.4 Migrate app.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Update router test patterns for Angular v21 timing
    - Use `await vi.waitFor()` around navigation assertions if needed
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.4, 5.1, 5.4, 9.3_

  - [ ] 2.5 Migrate app.routes.spec.ts
    - Update RouterTestingHarness usage for Angular v21
    - Ensure navigation completes before assertions
    - Use `await harness.navigateByUrl()` followed by `await vi.waitFor()`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 2.6 Write property test for router navigation
    - **Property 5: Navigation completion before assertions**
    - **Validates: Requirements 5.1, 5.4**

  - [ ] 2.7 Migrate shared component tests
    - Migrate loading.component.spec.ts
    - Migrate details.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 2.8 Migrate shared service tests
    - Migrate logger.service.spec.ts
    - Migrate sweetAlert.service.spec.ts
    - Migrate fileSaver.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - _Requirements: 4.1, 4.4_

  - [ ] 2.9 Migrate shared pipe tests
    - Migrate bonus.pipe.spec.ts
    - Migrate bonuses.pipe.spec.ts
    - Update assertions to use Vitest expect API
    - _Requirements: 4.1_

  - [ ] 2.10 Migrate nav-menu tests
    - Migrate nav-menu component tests
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 2.11 Migrate home and error page tests
    - Migrate home page component tests
    - Migrate error page component tests
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 9.3_


  - [ ] 2.12 Checkpoint - Verify foundation tests pass
    - Run `npm test` to verify all foundation tests pass
    - Ensure TestHelper changes work correctly
    - Document any patterns discovered
    - Ask user if questions arise
    - _Requirements: 6.3, 6.5_

- [ ] 3. Phase 3: RollGen Migration
  - [ ] 3.1 Migrate roll.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Update HTTP mock patterns for Vitest
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.2 Migrate rollgen.component.spec.ts - Unit tests part 1 (lines 12-300)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle debouncing tests (tick(500) → await vi.advanceTimersByTimeAsync(500))
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.3 Migrate rollgen.component.spec.ts - Unit tests part 2 (lines 301-537)
    - Continue spy and async pattern replacements
    - Handle multiple tick() calls with multiple awaits
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 3.4 Migrate rollgen.component.spec.ts - Integration setup (lines 538-597)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 3.5 Migrate rollgen.component.spec.ts - Integration standard tab (lines 598-822)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 3.6 Migrate rollgen.component.spec.ts - Integration custom tab (lines 823-1048)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 3.7 Migrate rollgen.component.spec.ts - Integration expression tab (lines 1049-1092)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - _Requirements: 2.1, 4.1, 9.3_


  - [ ]* 3.8 Write property test for RollGen async handling
    - **Property 4: All tests pass with Vitest**
    - **Validates: Requirements 4.5, 7.4**

  - [ ] 3.9 Checkpoint - Verify RollGen tests pass
    - Run `vitest run src/app/roll` to verify all RollGen tests pass
    - Document any RollGen-specific patterns
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 4. Phase 4: TreasureGen Migration
  - [ ] 4.1 Migrate treasure.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Update HTTP mock patterns for Vitest
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.2 Migrate treasure pipe tests
    - Migrate treasure.pipe.spec.ts
    - Migrate item.pipe.spec.ts
    - Update assertions to use Vitest expect API
    - _Requirements: 4.1_

  - [ ] 4.3 Migrate treasuregenViewModel.model.spec.ts
    - Update test syntax for Vitest
    - Replace any Jasmine-specific patterns
    - _Requirements: 4.1_

  - [ ] 4.4 Migrate treasuregen.component.spec.ts - Unit tests part 1 (lines 26-500)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle debouncing and timing tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.5 Migrate treasuregen.component.spec.ts - Unit tests part 2 (lines 501-986)
    - Continue spy and async pattern replacements
    - Handle generation and operation tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 4.6 Migrate treasuregen.component.spec.ts - Integration setup (lines 987-1060)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 9.3, 9.5_


  - [ ] 4.7 Migrate treasuregen.component.spec.ts - Integration treasure tab (lines 1061-1281)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 4.8 Migrate treasuregen.component.spec.ts - Integration item tab (lines 1282-1761)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Update async test patterns
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 4.9 Migrate treasure.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ] 4.10 Migrate item.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 4.11 Write property test for TreasureGen migration consistency
    - **Property 7: Consistent migration patterns**
    - **Validates: Requirements 7.1**

  - [ ] 4.12 Checkpoint - Verify TreasureGen tests pass
    - Run `vitest run src/app/treasure` to verify all TreasureGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 5. Phase 5: CharacterGen Migration
  - [ ] 5.1 Migrate character service tests
    - Migrate character.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.2 Migrate character model tests
    - Migrate character model spec files
    - Update test syntax for Vitest
    - _Requirements: 4.1_


  - [ ] 5.3 Migrate charactergen.component.spec.ts - Unit tests part 1 (lines 21-600)
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle setup, initialization, and validation tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.4 Migrate charactergen.component.spec.ts - Unit tests part 2 (lines 601-1200)
    - Continue spy and async pattern replacements
    - Handle validation with randomizers tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.5 Migrate charactergen.component.spec.ts - Unit tests part 3 (lines 1201-1800)
    - Continue spy and async pattern replacements
    - Handle generation setup and basic generation tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.6 Migrate charactergen.component.spec.ts - Unit tests part 4 (lines 1801-2288)
    - Continue spy and async pattern replacements
    - Handle leadership generation and download tests
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 5.7 Migrate charactergen.component.spec.ts - Integration setup (lines 2289-2414)
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle setup and basic rendering tests
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 5.8 Migrate charactergen.component.spec.ts - Integration character tab part 1 (lines 2415-2900)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle form controls and validation tests
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 5.9 Migrate charactergen.component.spec.ts - Integration character tab part 2 (lines 2901-3547)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle generation and display tests
    - _Requirements: 2.1, 4.1, 9.3_

  - [ ] 5.10 Migrate charactergen.component.spec.ts - Integration leadership tab (lines 3548-end)
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle leadership tab tests
    - _Requirements: 2.1, 4.1, 9.3_


  - [ ] 5.11 Migrate character.pipe.spec.ts - Tests 1-7 (lines 27-900)
    - Update test syntax for Vitest
    - Replace any Jasmine-specific patterns
    - _Requirements: 4.1_

  - [ ] 5.12 Migrate character.pipe.spec.ts - Tests 8-14 (lines 901-1700)
    - Continue test syntax updates
    - _Requirements: 4.1_

  - [ ] 5.13 Migrate character.pipe.spec.ts - Tests 15-21 (lines 1701-2400)
    - Continue test syntax updates
    - _Requirements: 4.1_

  - [ ] 5.14 Migrate character.pipe.spec.ts - Tests 22-27 (lines 2401-2780)
    - Complete test syntax updates
    - _Requirements: 4.1_

  - [ ] 5.15 Migrate character.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 5.16 Write property test for CharacterGen test coverage
    - **Property 8: Test coverage preservation**
    - **Validates: Requirements 7.2**

  - [ ] 5.17 Checkpoint - Verify CharacterGen tests pass
    - Run `vitest run src/app/character` to verify all CharacterGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 6. Phase 6: EncounterGen Migration
  - [ ] 6.1 Migrate encounter service tests
    - Migrate encounter.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 6.2 Migrate encounter model tests
    - Migrate encounter model spec files
    - Update test syntax for Vitest
    - _Requirements: 4.1_


  - [ ] 6.3 Migrate encountergen.component.spec.ts - Unit tests
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle all unit test describe blocks
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 6.4 Migrate encountergen.component.spec.ts - Integration tests
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle all integration test describe blocks
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 6.5 Migrate encounter.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 6.6 Write property test for EncounterGen TestBed compatibility
    - **Property 11: TestBed component creation works**
    - **Validates: Requirements 9.3**

  - [ ] 6.7 Checkpoint - Verify EncounterGen tests pass
    - Run `vitest run src/app/encounter` to verify all EncounterGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 7. Phase 7: DungeonGen Migration
  - [ ] 7.1 Migrate dungeon service tests
    - Migrate dungeon.service.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - _Requirements: 2.1, 2.2, 4.1, 4.4_

  - [ ] 7.2 Migrate dungeon model tests
    - Migrate dungeon model spec files
    - Update test syntax for Vitest
    - _Requirements: 4.1_

  - [ ] 7.3 Migrate dungeongen.component.spec.ts - Unit tests
    - Replace Jasmine spies with Vitest mocks
    - Replace fakeAsync/tick with async/await
    - Handle all unit test describe blocks
    - _Requirements: 2.1, 2.2, 4.1, 4.4_


  - [ ] 7.4 Migrate dungeongen.component.spec.ts - Integration tests
    - Update TestBed configuration for zoneless
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - Handle all integration test describe blocks
    - _Requirements: 2.1, 9.3, 9.5_

  - [ ] 7.5 Migrate dungeon component tests
    - Migrate dungeonTreasure.component.spec.ts
    - Migrate area.component.spec.ts
    - Replace Jasmine spies with Vitest mocks
    - Replace `fixture.detectChanges()` with `await fixture.whenStable()`
    - _Requirements: 2.1, 4.1, 4.4, 9.3_

  - [ ]* 7.6 Write property test for DungeonGen component tests
    - **Property 12: Component tests pass**
    - **Validates: Requirements 9.5**

  - [ ] 7.7 Checkpoint - Verify DungeonGen tests pass
    - Run `vitest run src/app/dungeon` to verify all DungeonGen tests pass
    - Ask user if questions arise
    - _Requirements: 6.3_

- [ ] 8. Phase 8: Cleanup and Verification
  - [ ] 8.1 Update CI/CD pipeline - build.yml
    - Update build.yml PublishTestResults task (line ~304)
    - Change from: `testResultsFiles: '**/TESTS-*.xml'`
    - To: `testResultsFiles: 'dndgen-web/TestResults-DnDGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.2 Update CI/CD pipeline - release.yml RollGen_Api
    - Update RollGen_Api PublishTestResults task (line ~72)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-RollGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.3 Update CI/CD pipeline - release.yml TreasureGen_Api
    - Update TreasureGen_Api PublishTestResults task (line ~151)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-TreasureGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_


  - [ ] 8.4 Update CI/CD pipeline - release.yml CharacterGen_Api
    - Update CharacterGen_Api PublishTestResults task (line ~230)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-CharacterGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.5 Update CI/CD pipeline - release.yml EncounterGen_Api
    - Update EncounterGen_Api PublishTestResults task (line ~309)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-EncounterGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.6 Update CI/CD pipeline - release.yml DungeonGen_Api
    - Update DungeonGen_Api PublishTestResults task (line ~388)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-DungeonGen-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.7 Update CI/CD pipeline - release.yml Web_Api
    - Update Web_Api PublishTestResults task (line ~467)
    - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
    - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-AllGenerators-Website.xml'`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.8 Remove Karma configuration files
    - Delete karma.conf.js
    - Delete karma.conf.ci.js
    - _Requirements: 1.5_

  - [ ] 8.9 Remove zone.js dependency
    - Remove zone.js from package.json devDependencies
    - Verify zone.js is not imported anywhere in test files
    - _Requirements: 2.4, 2.5_


  - [ ] 8.10 Run full test suite verification
    - Run `npm test` to verify all tests pass
    - Run `npm run test:ci` to verify CI configuration works
    - Verify test result file is created: TestResults-DnDGen-Website.xml
    - _Requirements: 7.4, 10.1_

  - [ ] 8.11 Verify test subset commands
    - Run each test:cd:* command to verify subset filtering works
    - Verify each command creates its specific output file
    - _Requirements: 10.3_

  - [ ]* 8.12 Write property test for test subset filtering
    - **Property 13: Test subset filtering works**
    - **Validates: Requirements 10.3**

  - [ ] 8.13 Verify zone.js is not loaded in tests
    - Add verification test: `expect(typeof Zone).toBe('undefined')`
    - Ensure no zone.js imports in test files
    - _Requirements: 2.5_

  - [ ] 8.14 Run coverage report
    - Run `npm run test:coverage` to generate coverage report
    - Verify coverage excludes test files
    - Review coverage to ensure no regression
    - _Requirements: 1.3_

  - [ ] 8.15 Update documentation
    - Update README.md with new test commands
    - Document migration patterns and solutions
    - Update any developer documentation referencing Karma
    - _Requirements: 7.5_

  - [ ] 8.16 Final validation checkpoint
    - Verify all tests pass: `npm test`
    - Verify CI commands work: `npm run test:ci`
    - Verify subset commands work: all `npm run test:cd:*` commands
    - Verify CI/CD pipeline changes are correct
    - Ask user for final approval before considering migration complete
    - _Requirements: 7.4, 7.5, 10.4, 10.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster completion
- Each phase builds on the previous phase - complete phases in order
- Large test files are broken into chunks (200-800 lines) to ensure reliable migrations
- Run tests after each file migration to catch issues early
- Use `vitest run <path>` to test specific files or directories
- CI/CD pipeline updates use explicit test result filenames following pattern: `TestResults-{Component}-Website.xml`
- TestHelper changes in Phase 2 are critical - all subsequent phases depend on zoneless compatibility
- Checkpoints ensure incremental validation and provide opportunities to address issues before proceeding
