# Design Document

## Overview

This design outlines the migration from Karma + Jasmine + zone.js testing utilities to Vitest for the DnDGen Angular v21 application. The migration involves replacing the test runner, updating test syntax, removing zone.js dependencies from tests, and ensuring all tests work correctly with the zoneless application architecture. The application has approximately 50+ test files across multiple feature modules (roll, treasure, character, encounter, dungeon, shared, nav-menu, error, home).

Source of changes: https://angular.dev/update-guide?v=20.0-21.0&l=3

## Architecture

### Current Testing Architecture
- **Test Runner**: Karma (browser-based test runner)
- **Test Framework**: Jasmine (BDD-style assertions and spies)
- **Async Testing**: zone.js utilities (fakeAsync, tick, flush)
- **Test Configuration**: angular.json with Karma builder, karma.conf.js, karma.conf.ci.js
- **Test Utilities**: Custom TestHelper class for component testing
- **Asset Handling**: Karma proxy configuration for serving static assets

### Target Testing Architecture
- **Test Runner**: Vitest (fast, modern test runner with native ESM)
- **Test Framework**: Vitest (compatible API with Jasmine for most assertions)
- **Async Testing**: Native async/await with Vitest timing utilities
- **Test Configuration**: angular.json with Vitest builder, vitest.config.ts
- **Test Utilities**: Updated TestHelper class compatible with Vitest
- **Asset Handling**: Vitest configuration for static assets

## Components and Interfaces

### Configuration Files

#### vitest.config.ts (Local/Development)

Replaces karma.conf.js - default configuration for local development

```typescript
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    
    // Local settings (from karma.conf.js):
    testTimeout: 10000,  // 10 seconds
    hookTimeout: 10000,
    bail: 1,  // Fail fast (equivalent to oneFailurePerSpec, stopSpecOnExpectationFailure, failFast)
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },
    
    reporters: ['default'],  // Progress only
    
    server: {
      deps: {
        inline: ['@angular/**', '@ng-bootstrap/**']
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

#### vitest.config.ci.ts (CI/CD)

Replaces karma.conf.ci.js - configuration for CI/CD pipelines

```typescript
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    
    // CI settings (from karma.conf.ci.js):
    testTimeout: 60000,  // 60 seconds (1000 * 60)
    hookTimeout: 60000,
    // No bail - run all tests (equivalent to disabling oneFailurePerSpec, etc.)
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },
    
    // JUnit reporter for CI
    // Note: outputFile is specified via CLI argument (--outputFile.junit) in package.json scripts
    // This allows each test command to specify its own output filename
    reporters: ['default', 'junit'],
    
    server: {
      deps: {
        inline: ['@angular/**', '@ng-bootstrap/**']
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

**Note**: Output file is not configured here - it's specified via CLI argument in each npm script for explicit control.

### Configuration File Usage

This approach mirrors the Karma setup exactly:
- **vitest.config.ts** - Default config for local development (like karma.conf.js)
- **vitest.config.ci.ts** - CI/CD config (like karma.conf.ci.js)

**Usage in package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:ci": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-DnDGen-Website.xml",
    "test:cd:rollgen": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-RollGen-Website.xml src/app/roll",
    "test:cd:treasuregen": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-TreasureGen-Website.xml src/app/treasure",
    "test:cd:charactergen": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-CharacterGen-Website.xml src/app/character",
    "test:cd:encountergen": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-EncounterGen-Website.xml src/app/encounter",
    "test:cd:dungeongen": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-DungeonGen-Website.xml src/app/dungeon",
    "test:cd:web": "vitest run --config vitest.config.ci.ts --reporter=default --reporter=junit --outputFile.junit=./TestResults-AllGenerators-Website.xml src/app/roll src/app/treasure src/app/character src/app/encounter src/app/dungeon"
  }
}
```

**Note on explicit output files**:
- Each test command explicitly specifies its output filename via `--outputFile.junit`
- Naming follows pattern: `TestResults-{Component}-Website.xml`
- Consistent with Postman test naming convention (e.g., `RollGen-API.postman_collection.json`)
- Eliminates ambiguity about where test results are written
- Makes it easy to identify which test suite produced which results

**Note on test:cd:web syntax**:
- **Karma/Angular CLI**: Used `--include='**/app/{roll,treasure,...}/**/*.spec.ts'` (Angular CLI flag with glob pattern)
- **Vitest**: Accepts multiple directory paths as space-separated arguments
- Both approaches achieve the same result: running tests from multiple feature directories
- Vitest will automatically find all `*.spec.ts` files in the specified directories (based on the `include` pattern in vitest.config.ts)
- **test:cd:web runs all generator tests** (roll, treasure, character, encounter, dungeon) - equivalent to the Web_Api deployment validation in the release pipeline

**Rationale for two config files**:
- Mirrors existing Karma setup (familiar to team)
- No environment variable complexity
- Explicit and clear which config is being used
- Easy to test CI config locally: `npm run test:ci`
- No additional dependencies needed (no cross-env)

**CI/CD Pipeline Usage**:
```bash
# Build pipeline - runs all tests
npm run test:ci
# Outputs: TestResults-DnDGen-Website.xml

# Release pipeline - runs subset tests per deployment
npm run test:cd:rollgen
# Outputs: TestResults-RollGen-Website.xml

npm run test:cd:treasuregen
# Outputs: TestResults-TreasureGen-Website.xml

# etc.
```

#### src/test-setup.ts
```typescript
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment for zoneless applications
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
```

**Note**: No zone.js import needed since the application is zoneless. Angular's testing utilities work without zone.js when using async/await patterns.

### Test Syntax Migration Patterns

#### Pattern 1: Basic Test Structure
**Before (Jasmine)**:
```typescript
describe('Component', () => {
  beforeEach(() => {
    // setup
  });
  
  it('should do something', () => {
    expect(value).toBe(expected);
  });
});
```

**After (Vitest)**: Same syntax - no changes needed

#### Pattern 2: Async Tests with fakeAsync/tick
**Before (Jasmine + zone.js)**:
```typescript
it('should handle async operation', fakeAsync(() => {
  component.doAsyncThing();
  
  tick(500); // Simulate 500ms passing
  
  expect(component.result()).toBe(expected);
  
  flush(); // Complete all pending async operations
}));
```

**After (Vitest + native async)**:
```typescript
it('should handle async operation', async () => {
  component.doAsyncThing();
  
  await vi.advanceTimersByTimeAsync(500); // Simulate 500ms passing
  
  expect(component.result()).toBe(expected);
});
```

Or using fixture.whenStable():
```typescript
it('should handle async operation', async () => {
  component.doAsyncThing();
  
  await fixture.whenStable(); // Wait for all async operations
  
  expect(component.result()).toBe(expected);
});
```

#### Pattern 3: Zoneless Change Detection (Critical for Zoneless Apps)
**Before (with zone.js - automatic change detection)**:
```typescript
it('should update view', async () => {
  component.value.set('new value');
  
  fixture.detectChanges(); // Manually trigger change detection
  
  expect(compiled.querySelector('div')?.textContent).toBe('new value');
});
```

**After (zoneless - use whenStable instead of detectChanges)**:
```typescript
it('should update view', async () => {
  component.value.set('new value');
  
  await fixture.whenStable(); // Wait for change detection and async operations
  
  expect(compiled.querySelector('div')?.textContent).toBe('new value');
});
```

**Important**: Angular recommends avoiding `fixture.detectChanges()` in zoneless applications. Use `await fixture.whenStable()` instead, which properly handles change detection in zoneless mode.

#### Pattern 4: Jasmine Spies to Vitest Mocks
**Before (Jasmine)**:
```typescript
const serviceSpy = jasmine.createSpyObj('Service', ['method1', 'method2']);
serviceSpy.method1.and.returnValue(of(data));
serviceSpy.method2.and.callFake(() => getFakeDelay(result));

expect(serviceSpy.method1).toHaveBeenCalledWith(arg);
expect(serviceSpy.method1).toHaveBeenCalledTimes(1);
```

**After (Vitest)**:
```typescript
const serviceSpy = {
  method1: vi.fn().mockReturnValue(of(data)),
  method2: vi.fn().mockImplementation(() => getFakeDelay(result))
};

expect(serviceSpy.method1).toHaveBeenCalledWith(arg);
expect(serviceSpy.method1).toHaveBeenCalledTimes(1);
```

#### Pattern 5: Router Navigation Tests
**Before**:
```typescript
it('routes to page', async () => {
  await harness.navigateByUrl('/path');
  const heading = harness.routeNativeElement?.querySelector('h1');
  expect(heading?.textContent).toBe('Expected');
});
```

**After (with additional microtask handling)**:
```typescript
it('routes to page', async () => {
  await harness.navigateByUrl('/path');
  await vi.waitFor(() => {
    const heading = harness.routeNativeElement?.querySelector('h1');
    expect(heading?.textContent).toBe('Expected');
  });
});
```

### TestHelper Updates

The TestHelper class needs updates for zoneless compatibility:

**Current waitForService() method**:
```typescript
public async waitForService() {
  this.fixture.detectChanges();
  await this.fixture.whenStable();

  //update view
  this.fixture.detectChanges();
}
```

**Updated for zoneless (remove detectChanges)**:
```typescript
public async waitForService() {
  await this.fixture.whenStable();
  // No detectChanges needed - whenStable handles change detection in zoneless mode
}
```

**Rationale**: In zoneless applications, `fixture.detectChanges()` should be avoided. `fixture.whenStable()` properly handles both async operations and change detection.

## Data Models

### Test File Categories

1. **Unit Tests** (~30 files)
   - Service tests (roll.service.spec.ts, treasure.service.spec.ts, etc.)
   - Pipe tests (bonus.pipe.spec.ts, bonuses.pipe.spec.ts, etc.)
   - Model tests (treasuregenViewModel.model.spec.ts)
   - Simple component tests

2. **Integration Tests** (~20 files)
   - Component tests with TestBed (rollgen.component.spec.ts, treasuregen.component.spec.ts, etc.)
   - Router tests (app.routes.spec.ts, app.component.spec.ts)
   - Complex component interactions

3. **Helper/Utility Tests** (1 file)
   - testHelper.spec.ts

### Migration Complexity Levels

**Low Complexity** (no fakeAsync/tick):
- Pipe tests
- Simple service tests
- Model tests
- Basic component tests

**Medium Complexity** (some fakeAsync/tick):
- Service tests with HTTP calls
- Component tests with simple async operations

**High Complexity** (heavy fakeAsync/tick usage):
- rollgen.component.spec.ts (extensive use of tick for debouncing and delays)
- treasuregen.component.spec.ts
- charactergen.component.spec.ts
- encountergen.component.spec.ts
- dungeongen.component.spec.ts

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


Property 1: Asset loading works across all tests
*For any* test that requires static assets, the test should pass without asset loading errors
**Validates: Requirements 1.3**

Property 2: Assertion API compatibility
*For any* test assertion using expect(), the Vitest API should provide equivalent functionality to Jasmine
**Validates: Requirements 4.1**

Property 3: Spy API compatibility
*For any* spy or mock usage, the Vitest vi.fn() and vi.spyOn() APIs should provide equivalent functionality to Jasmine spies
**Validates: Requirements 4.4**

Property 4: All tests pass with Vitest
*For any* test file in the codebase, when executed with Vitest, the test should pass
**Validates: Requirements 4.5, 7.4**

Property 5: Navigation completion before assertions
*For any* router navigation test, assertions should only execute after navigation has fully completed
**Validates: Requirements 5.1, 5.4**

Property 6: Router tests are reliable
*For any* router test, when executed multiple times, it should pass consistently without timing-related failures
**Validates: Requirements 5.5**

Property 7: Consistent migration patterns
*For any* two migrated test files, they should follow the same patterns for async handling, mocking, and test structure
**Validates: Requirements 7.1**

Property 8: Test coverage preservation
*For any* test file, the migrated version should test the same functionality as the original version
**Validates: Requirements 7.2**

Property 9: TestHelper compatibility
*For any* test using TestHelper methods, the test should work correctly in the Vitest environment
**Validates: Requirements 8.1, 8.4**

Property 10: TestHelper behavior preservation
*For any* TestHelper method, the behavior should be the same before and after migration
**Validates: Requirements 8.2, 8.5**

Property 11: TestBed component creation works
*For any* component test using TestBed, component creation and testing should work correctly in the zoneless environment
**Validates: Requirements 9.3**

Property 12: Component tests pass
*For any* component test, when executed with Vitest and zoneless TestBed, the test should pass
**Validates: Requirements 9.5**

Property 13: Test subset filtering works
*For any* subset test command (e.g., test:cd:rollgen), only the specified tests should execute
**Validates: Requirements 10.3**

## Error Handling

### Migration Errors

1. **Timing Issues**
   - **Problem**: Tests fail due to async operations not completing
   - **Solution**: Use `await fixture.whenStable()` after async operations
   - **Fallback**: Use `vi.advanceTimersByTimeAsync()` for specific timing control

2. **Spy/Mock Incompatibilities**
   - **Problem**: Jasmine spy syntax doesn't work in Vitest
   - **Solution**: Replace `jasmine.createSpyObj()` with object containing `vi.fn()` methods
   - **Pattern**: `serviceSpy.method.and.returnValue(x)` → `serviceSpy.method.mockReturnValue(x)`

3. **Router Navigation Timing**
   - **Problem**: Navigation tests fail due to Angular v21 timing changes
   - **Solution**: Add `await vi.waitFor()` wrapper around assertions
   - **Alternative**: Use `await fixture.whenStable()` after navigation

4. **TestBed Configuration**
   - **Problem**: Tests fail with PlatformLocation errors
   - **Solution**: Add `provideLocationMocks()` to TestBed providers (already in TestHelper)
   - **Alternative**: Provide `MockPlatformLocation` explicitly if needed

5. **Asset Loading**
   - **Problem**: Tests fail to load static assets
   - **Solution**: Configure Vitest to serve assets from src/assets directory
   - **Configuration**: Add to vitest.config.ts server.fs.allow

### Test Execution Errors

1. **Import Errors**
   - **Problem**: Cannot find module errors for Angular packages
   - **Solution**: Configure Vitest to inline Angular dependencies
   - **Configuration**: `server.deps.inline: ['@angular/**', '@ng-bootstrap/**']`

2. **Zone.js Conflicts**
   - **Problem**: Zone.js loaded when it shouldn't be
   - **Solution**: Remove zone.js from test polyfills in angular.json
   - **Verification**: Check `typeof Zone === 'undefined'` in tests

3. **Coverage Reporting**
   - **Problem**: Coverage reports include test files
   - **Solution**: Exclude test files in vitest.config.ts coverage configuration
   - **Pattern**: `exclude: ['**/*.spec.ts', '**/*.config.ts']`

## Testing Strategy

### Unit Testing Approach

Unit tests will be migrated with minimal changes since most don't use fakeAsync/tick:

1. **Service Tests**: Replace Jasmine spies with Vitest mocks
2. **Pipe Tests**: No changes needed (pure functions)
3. **Model Tests**: No changes needed (simple object tests)
4. **Simple Component Tests**: Update spy syntax only

### Integration Testing Approach

Integration tests require more careful migration:

1. **Component Tests with TestBed**:
   - Keep TestBed configuration (already compatible)
   - Replace fakeAsync/tick with async/await
   - Use `fixture.whenStable()` for async operations and state changes, preferrably via the test helper (the waitForService function)

2. **Router Tests**:
   - Keep RouterTestingHarness usage
   - Add `await vi.waitFor()` around assertions if needed
   - Ensure navigation completes before assertions

3. **Complex Async Tests**:
   - Identify debouncing patterns (e.g., 500ms delays in rollgen)
   - Replace `tick(500)` with `await vi.advanceTimersByTimeAsync(500)`
   - Or use `await fixture.whenStable()` if timing doesn't matter

### Migration Phases

**Phase 1: Configuration Setup**
- Install Vitest and dependencies
- Create vitest.config.ts and vitest.config.ci.ts
- Create src/test-setup.ts
- Update angular.json
- Update tsconfig.spec.json
- Update package.json scripts
- Verify basic Vitest execution works

**Phase 2: Foundation Tests (TestHelper, App, Shared)**
- Migrate testHelper.spec.ts
- Update TestHelper class for zoneless compatibility (remove detectChanges)
- Migrate app.component.spec.ts
- Migrate app.routes.spec.ts
- Migrate shared component tests (loading.component.spec.ts, details.component.spec.ts)
- Migrate shared service tests (logger.service.spec.ts, sweetAlert.service.spec.ts, fileSaver.service.spec.ts)
- Migrate shared pipe tests (bonus.pipe.spec.ts, bonuses.pipe.spec.ts)
- Migrate nav-menu tests
- Migrate home and error page tests
- Document patterns and solutions discovered
- Validate TestHelper changes work correctly

**Phase 3: RollGen Migration**
- Migrate roll service tests (roll.service.spec.ts)
- Migrate rollgen.component.spec.ts in chunks:
  - Unit tests - setup and validation
  - Unit tests - rolling operations
  - Unit tests - expression handling
  - Integration tests - setup and rendering
  - Integration tests - standard tab
  - Integration tests - custom tab
  - Integration tests - expression tab
- Run rollgen tests to verify
- Document any rollgen-specific patterns

**Phase 4: TreasureGen Migration**
- Migrate treasure service tests (treasure.service.spec.ts)
- Migrate treasure pipe tests (treasure.pipe.spec.ts, item.pipe.spec.ts)
- Migrate treasure model tests (treasuregenViewModel.model.spec.ts)
- Migrate treasuregen.component.spec.ts in chunks:
  - Unit tests
  - Integration tests - treasure tab
  - Integration tests - item tab
- Migrate treasure.component.spec.ts
- Migrate item.component.spec.ts
- Run treasuregen tests to verify

**Phase 5: CharacterGen Migration**
- Migrate character service tests
- Migrate character model tests
- Migrate charactergen.component.spec.ts in chunks:
  - Unit tests (describe('unit'))
  - Integration tests - setup and basic tests (describe('integration') - before nested describes)
  - Integration tests - character tab (describe('the character tab'))
  - Integration tests - leadership tab (describe('the leadership tab'))
- Migrate character.component.spec.ts
- Run charactergen tests to verify

**Phase 6: EncounterGen Migration**
- Migrate encounter service tests
- Migrate encounter model tests
- Migrate encountergen.component.spec.ts in chunks:
  - Unit tests (describe('unit'))
  - Integration tests (describe('integration'))
- Migrate encounter.component.spec.ts
- Run encountergen tests to verify

**Phase 7: DungeonGen Migration**
- Migrate dungeon service tests
- Migrate dungeon model tests
- Migrate dungeongen.component.spec.ts in chunks:
  - Unit tests (describe('unit'))
  - Integration tests (describe('integration'))
- Migrate dungeon component tests (dungeonTreasure.component.spec.ts, area.component.spec.ts)
- Run dungeongen tests to verify

**Phase 8: Cleanup and Verification**
- Remove Karma configuration files (karma.conf.js, karma.conf.ci.js)
- Remove Karma dependencies from package.json
- Remove zone.js from test configuration (angular.json polyfills)
- Verify zone.js is not loaded in tests
- Run full test suite with Vitest
- Verify all test commands work (test, test:ci, test:cd:*)
- Update CI/CD pipelines (if needed - see CI/CD Pipeline Compatibility section)
- Update README.md and documentation
- Final validation of all tests passing

### CI/CD Pipeline Compatibility

**Analysis**: The migration requires explicit test result file naming and pipeline updates to eliminate ambiguity and follow existing naming conventions.

**Current State**:
- Build pipeline: Uses npm scripts with pattern `**/TESTS-*.xml`
- Release pipeline: Uses npm scripts with pattern `...\**\TESTS-*.xml`
- Karma outputs: `Results/TESTS-FirefoxHeadless.xml`, `Results/TESTS-ChromeHeadless.xml`
- Postman tests: Use explicit naming like `rollgen.junitReport.xml`, `treasuregen.junitReport.xml`

**Proposed Changes**:

**1. Explicit Test Result Filenames** (via Vitest CLI `--outputFile.junit` argument):

Following Postman test naming convention pattern:
- `test:ci` → `TestResults-DnDGen-Website.xml`
- `test:cd:rollgen` → `TestResults-RollGen-Website.xml`
- `test:cd:treasuregen` → `TestResults-TreasureGen-Website.xml`
- `test:cd:charactergen` → `TestResults-CharacterGen-Website.xml`
- `test:cd:encountergen` → `TestResults-EncounterGen-Website.xml`
- `test:cd:dungeongen` → `TestResults-DungeonGen-Website.xml`
- `test:cd:web` → `TestResults-AllGenerators-Website.xml`

**Naming Convention Rationale**:
- Follows pattern similar to Postman tests (e.g., `RollGen-API.postman_collection.json`, `DnDGen-Website.postman_collection.json`)
- Explicit component identification in filename
- `-Website` suffix distinguishes website tests from API tests
- `TestResults-` prefix clearly identifies as test output
- No ambiguity about which test suite produced which file

**2. Update build.yml** (DnDGen_Web job, line ~304):

Change from:
```yaml
testResultsFiles: '**/TESTS-*.xml'
```

To:
```yaml
testResultsFiles: 'dndgen-web/TestResults-DnDGen-Website.xml'
```

Full task:
```yaml
- task: PublishTestResults@2
  displayName: 'Publish Test Results'
  condition: always()
  inputs:
    testResultsFiles: 'dndgen-web/TestResults-DnDGen-Website.xml'
    failTaskOnFailedTests: true
    failTaskOnMissingResultsFile: true
```

**3. Update release.yml** (6 deployment jobs):

Each deployment job has a "Publish Website Test Results" task that needs updating:

- **RollGen_Api** (line ~72): 
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-RollGen-Website.xml'`

- **TreasureGen_Api** (line ~151):
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-TreasureGen-Website.xml'`

- **CharacterGen_Api** (line ~230):
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-CharacterGen-Website.xml'`

- **EncounterGen_Api** (line ~309):
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-EncounterGen-Website.xml'`

- **DungeonGen_Api** (line ~388):
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-DungeonGen-Website.xml'`

- **Web_Api** (line ~467):
  - Change from: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\**\TESTS-*.xml'`
  - To: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-AllGenerators-Website.xml'`

**Benefits**:
- Explicit configuration eliminates reliance on defaults
- Clear identification of which test suite produced which results
- Consistent with existing Postman test naming patterns
- No future mystery about test result locations
- Each deployment validates its specific generator subset

**Action Items for Phase 8**:
1. Update package.json scripts to use explicit `--outputFile.junit` arguments
2. Update build.yml PublishTestResults task to use explicit file path
3. Update release.yml (6 PublishTestResults tasks) to use explicit file paths
4. Verify test results are published correctly in CI/CD after migration
- Web_Api: `testResultsFiles: '$(Pipeline.Workspace)\DnDGen.Web\dndgen-deployment-website-tests\TestResults-AllGenerators-Website.xml'`

**Benefits**:
- Explicit configuration eliminates reliance on defaults
- Clear identification of which test suite produced which results
- Consistent with existing Postman test naming patterns
- No future mystery about test result locations
- Each deployment validates its specific generator subset

### Test Execution Commands

**Development**:
```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:ui             # Run tests with Vitest UI
npm run test:coverage       # Run tests with coverage
```

**CI/CD**:
```bash
npm run test:ci             # Run all tests with CI reporter
npm run test:cd:rollgen     # Run only RollGen tests
npm run test:cd:treasuregen # Run only TreasureGen tests
npm run test:cd:charactergen # Run only CharacterGen tests
npm run test:cd:encountergen # Run only EncounterGen tests
npm run test:cd:dungeongen  # Run only DungeonGen tests
npm run test:cd:web         # Run all generator tests
```

### Dependencies

**Add**:
```json
{
  "devDependencies": {
    "@analogjs/vite-plugin-angular": "^1.x.x",
    "@vitest/ui": "^2.x.x",
    "jsdom": "^25.x.x",
    "vite": "^6.x.x",
    "vitest": "^2.x.x"
  }
}
```

**Remove**:
```json
{
  "devDependencies": {
    "@types/jasmine": "^6.0.0",
    "karma": "^6.4.4",
    "karma-firefox-launcher": "^2.1.3",
    "karma-chrome-launcher": "^3.2.0",
    "karma-jasmine": "^5.1.0",
    "karma-junit-reporter": "^2.0.1",
    "zone.js": "^0.16.1"
  }
}
```

## Implementation Notes

### Critical Success Factors

1. **Incremental Approach**: Migrate in phases to catch issues early
2. **Pattern Documentation**: Document solutions to common problems as they're discovered
3. **Test Frequently**: Run tests after each file migration to catch regressions
4. **Preserve Behavior**: Ensure migrated tests verify the same functionality
5. **CI/CD Validation**: Verify all CI/CD commands work before considering migration complete

### Large Test File Strategy

**Problem**: Some test files are very large (3000+ lines, e.g., rollgen.component.spec.ts, treasuregen.component.spec.ts). Attempting to migrate entire files at once has historically caused:
- Compilation errors from incomplete replacements
- Lost context in the middle of large edits
- Difficult-to-debug issues spanning multiple describe blocks

**Solution**: Break large test file migrations into small, digestible chunks.

**Recommended Approach - Per Describe Block**:

For files with multiple top-level describe blocks:
1. **Task per top-level describe block**
   - Example: "Migrate RollGen Component - unit tests describe block"
   - Example: "Migrate RollGen Component - integration tests describe block"

For files with nested describe blocks:
2. **Task per nested describe block**
   - Example: "Migrate RollGen Component - integration tests - standard tab describe block"
   - Example: "Migrate RollGen Component - integration tests - custom tab describe block"
   - Example: "Migrate RollGen Component - integration tests - expression tab describe block"

**Task Granularity Guidelines**:
- **Target**: 200-500 lines per task (manageable chunk size)
- **Maximum**: 800 lines per task (absolute limit)
- **Minimum**: 1 complete describe block (maintain logical grouping)
- **Exception**: For files >2000 lines without nested describes, break by logical test groups (e.g., initialization tests, validation tests, generation tests)

**Example Breakdown for charactergen.component.spec.ts (~3490 lines)**:
```
Unit tests (lines 21-2288, 2268 lines total) - break into logical groups:
  Task 1: Unit tests - setup, initialization, and validation tests (lines 21-600, ~580 lines)
  Task 2: Unit tests - validation with randomizers (lines 601-1200, ~600 lines)
  Task 3: Unit tests - generation setup and basic generation (lines 1201-1800, ~600 lines)
  Task 4: Unit tests - leadership generation and download (lines 1801-2288, ~488 lines)

Integration tests (lines 2289-3490, 1201 lines total):
  Task 5: Integration - setup and basic rendering (lines 2289-2414, ~126 lines)
  Task 6: Integration - character tab (lines 2415-3547, ~1133 lines) - STILL TOO BIG, break further:
    Task 6a: Integration - character tab - form controls and validation (lines 2415-2900, ~485 lines)
    Task 6b: Integration - character tab - generation and display (lines 2901-3547, ~647 lines)
  Task 7: Integration - leadership tab (lines 3548-3490, ~60 lines at end, but check actual end)
```

**Example Breakdown for character.pipe.spec.ts (~2780 lines)**:
```
Single unit describe block (lines 27-2780, 2753 lines) - 27 test cases:
  Task 1: Character pipe - tests 1-7 (lines 27-900, ~873 lines)
  Task 2: Character pipe - tests 8-14 (lines 901-1700, ~800 lines)
  Task 3: Character pipe - tests 15-21 (lines 1701-2400, ~700 lines)
  Task 4: Character pipe - tests 22-27 (lines 2401-2780, ~380 lines)
```

**Example Breakdown for treasuregen.component.spec.ts (~1761 lines)**:
```
Task 1: Unit tests (lines 26-986, 961 lines) - break into 2 chunks:
  Task 1a: Unit tests - initialization and validation (lines 26-500, ~475 lines)
  Task 1b: Unit tests - generation and operations (lines 501-986, ~486 lines)
Task 2: Integration - setup (lines 987-1060, ~74 lines)
Task 3: Integration - treasure tab (lines 1061-1281, ~221 lines)
Task 4: Integration - item tab (lines 1282-1761, ~480 lines)
```

**Example Breakdown for rollgen.component.spec.ts (~1092 lines)**:
```
Task 1: Unit tests - part 1 (lines 12-300, ~289 lines)
Task 2: Unit tests - part 2 (lines 301-537, ~237 lines)
Task 3: Integration - setup (lines 538-597, ~60 lines)
Task 4: Integration - standard tab (lines 598-822, ~225 lines)
Task 5: Integration - custom tab (lines 823-1048, ~226 lines)
Task 6: Integration - expression tab (lines 1049-1092, ~44 lines)
```

**Benefits of This Approach**:
- Smaller, focused edits reduce error risk
- Each task can be tested independently
- Easier to identify and fix issues
- Clear progress tracking
- Can pause/resume migration more easily
- Compilation errors are isolated to specific sections

**Implementation Pattern for Each Task**:
1. Read the specific describe block section
2. Identify patterns to migrate (fakeAsync, tick, spies, detectChanges)
3. Apply migrations using targeted string replacements
4. Run tests for that file to verify
5. Fix any issues before moving to next describe block
6. Mark task complete only when tests pass

**Verification After Each Task**:
```bash
# Run tests for the specific file being migrated
vitest run src/app/roll/components/rollgen.component.spec.ts
```

This ensures each chunk is working before moving to the next.

### Known Challenges

1. **Debouncing Tests**: Tests with `tick(500)` for debouncing need careful handling
2. **Multiple tick() Calls**: Tests with multiple tick() calls need to be converted to multiple awaits
3. **flush() Usage**: Need to identify what flush() is waiting for and use appropriate alternative
4. **Spy Chaining**: Jasmine's `and.returnValue().and.callFake()` chaining needs to be split
5. **Router Timing**: Angular v21 router timing changes may require additional awaits

### Performance Expectations

- **Vitest vs Karma**: Expect 2-5x faster test execution
- **Watch Mode**: Near-instant re-runs on file changes
- **Parallel Execution**: Vitest runs tests in parallel by default
- **Startup Time**: Significantly faster than Karma's browser startup

### Rollback Plan

If critical issues are discovered:
1. Keep Karma configuration files until migration is complete
2. Maintain both test commands during transition
3. Can run Karma tests as fallback if needed
4. Only remove Karma after full validation

