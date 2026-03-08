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
    
    // JUnit reporter for CI (equivalent to karma-junit-reporter)
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './Results/junit.xml'  // Matches karma junitReporter.outputDir
    },
    
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

**Note**: Vitest doesn't need separate browser configurations like Karma (Firefox vs Chrome). It runs in jsdom, which is faster and more consistent across environments.

### Configuration File Usage

This approach mirrors the Karma setup exactly:
- **vitest.config.ts** - Default config for local development (like karma.conf.js)
- **vitest.config.ci.ts** - CI/CD config (like karma.conf.ci.js)

**Usage in package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:ci": "vitest run --config vitest.config.ci.ts",
    "test:cd:rollgen": "vitest run --config vitest.config.ci.ts src/app/roll",
    "test:cd:treasuregen": "vitest run --config vitest.config.ci.ts src/app/treasure",
    "test:cd:charactergen": "vitest run --config vitest.config.ci.ts src/app/character",
    "test:cd:encountergen": "vitest run --config vitest.config.ci.ts src/app/encounter",
    "test:cd:dungeongen": "vitest run --config vitest.config.ci.ts src/app/dungeon",
    "test:cd:web": "vitest run --config vitest.config.ci.ts src/app/roll src/app/treasure src/app/character src/app/encounter src/app/dungeon"
  }
}
```

**Note on test:cd:web syntax**:
- **Karma/Angular CLI**: Used `--include='**/app/{roll,treasure,...}/**/*.spec.ts'` (Angular CLI flag with glob pattern)
- **Vitest**: Accepts multiple directory paths as space-separated arguments
- Both approaches achieve the same result: running tests from multiple feature directories
- Vitest will automatically find all `*.spec.ts` files in the specified directories (based on the `include` pattern in vitest.config.ts)

**Rationale for two config files**:
- Mirrors existing Karma setup (familiar to team)
- No environment variable complexity
- Explicit and clear which config is being used
- Easy to test CI config locally: `npm run test:ci`
- No additional dependencies needed (no cross-env)

**CI/CD Pipeline Usage**:
```bash
# Simply use the npm script
npm run test:ci

# Or directly
vitest run --config vitest.config.ci.ts
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
  fixture.detectChanges();
  
  expect(component.result()).toBe(expected);
});
```

#### Pattern 3: Jasmine Spies to Vitest Mocks
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

#### Pattern 4: Router Navigation Tests
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

The TestHelper class needs minimal updates:
- `waitForService()` method already uses `fixture.whenStable()` which works with Vitest
- No changes needed for DOM query methods
- Assertion methods remain the same (Vitest's expect API is compatible)

Potential addition for timing control:
```typescript
public async waitForTimers(ms: number = 0) {
  if (ms > 0) {
    await vi.advanceTimersByTimeAsync(ms);
  }
  await this.fixture.whenStable();
  this.fixture.detectChanges();
}
```

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
   - **Solution**: Use `await fixture.whenStable()` and `fixture.detectChanges()` after async operations
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
   - Use `fixture.whenStable()` for async operations
   - Add `fixture.detectChanges()` after state changes

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
- Create vitest.config.ts
- Update angular.json
- Update tsconfig.spec.json
- Update package.json scripts

**Phase 2: Sample Migration**
- Migrate 3-5 representative test files:
  - 1 simple unit test (pipe or service)
  - 1 component test with TestBed
  - 1 test with heavy fakeAsync/tick usage
  - 1 router test
- Document patterns and solutions
- Validate approach

**Phase 3: Bulk Migration**
- Migrate remaining test files by category:
  - Low complexity first (pipes, models, simple services)
  - Medium complexity next (services with HTTP, simple components)
  - High complexity last (generator components with debouncing)
- Run tests frequently to catch issues early

**Phase 4: Cleanup and Verification**
- Remove Karma configuration files
- Remove Karma dependencies
- Remove zone.js from test configuration
- Verify all test commands work
- Update CI/CD pipelines
- Run full test suite

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
    "karma-junit-reporter": "^2.0.1"
  }
}
```

**Keep** (still needed for Angular testing):
```json
{
  "devDependencies": {
    "zone.js": "^0.16.1"  // May be needed for some Angular testing utilities
  }
}
```

Note: zone.js might still be needed as a dev dependency for Angular's testing utilities, but it should NOT be loaded in the test environment polyfills.

## Implementation Notes

### Critical Success Factors

1. **Incremental Approach**: Migrate in phases to catch issues early
2. **Pattern Documentation**: Document solutions to common problems as they're discovered
3. **Test Frequently**: Run tests after each file migration to catch regressions
4. **Preserve Behavior**: Ensure migrated tests verify the same functionality
5. **CI/CD Validation**: Verify all CI/CD commands work before considering migration complete

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

