# Requirements Document

## Introduction

The DnDGen web application has been upgraded to Angular v21, which introduces Vitest as the default testing framework. The application currently uses Karma + Jasmine for testing with heavy reliance on zone.js testing utilities (fakeAsync, tick, flush). Since the application has already migrated to zoneless change detection in production, the test suite needs to be modernized to align with Angular v21 best practices by migrating to Vitest and removing zone.js dependencies from tests.

## Glossary

- **Karma**: Legacy test runner for Angular applications that runs tests in real browsers
- **Jasmine**: BDD-style testing framework currently used for assertions and test structure
- **Vitest**: Modern, fast test runner that is the default for Angular v21, with native ESM support
- **fakeAsync**: Zone.js testing utility that wraps tests to enable synchronous-style async testing
- **tick**: Zone.js testing utility that simulates the passage of time in fakeAsync tests
- **flush**: Zone.js testing utility that flushes all pending asynchronous tasks
- **TestBed**: Angular's primary testing utility for configuring and creating test instances
- **RouterTestingHarness**: Angular utility for testing routing behavior
- **TestHelper**: Custom utility class in the codebase for simplifying test assertions
- **Zone.js**: Angular's change detection library (removed from production but still used in tests)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to migrate from Karma to Vitest as the test runner, so that tests run faster and align with Angular v21 defaults.

#### Acceptance Criteria

1. WHEN Vitest is configured THEN the system SHALL use Vitest as the test runner instead of Karma
2. WHEN test scripts are executed THEN the system SHALL run tests through Vitest with appropriate configuration
3. WHEN tests run THEN the system SHALL serve static assets correctly without Karma's proxy configuration
4. WHEN CI/CD pipelines execute THEN the system SHALL run tests using Vitest with appropriate reporters
5. WHEN the migration is complete THEN the system SHALL remove all Karma-related dependencies and configuration files

### Requirement 2

**User Story:** As a developer, I want to replace zone.js testing utilities with native async patterns, so that tests work correctly with the zoneless application architecture.

#### Acceptance Criteria

1. WHEN tests use async operations THEN the system SHALL use native async/await instead of fakeAsync
2. WHEN tests need to wait for operations THEN the system SHALL use appropriate Vitest timing utilities instead of tick
3. WHEN tests need to complete all pending operations THEN the system SHALL use Vitest alternatives instead of flush
4. WHEN the migration is complete THEN the system SHALL remove zone.js from test polyfills
5. WHEN tests execute THEN the system SHALL not load zone.js in the test environment

### Requirement 3

**User Story:** As a developer, I want to update test configuration files, so that the test environment is properly configured for Vitest.

#### Acceptance Criteria

1. WHEN angular.json is updated THEN the system SHALL configure the test builder to use Vitest
2. WHEN tsconfig.spec.json is updated THEN the system SHALL include Vitest types instead of Jasmine types
3. WHEN package.json is updated THEN the system SHALL include Vitest dependencies and remove Karma dependencies
4. WHEN test scripts are updated THEN the system SHALL provide commands for running all tests and subset tests
5. WHEN Vitest configuration is created THEN the system SHALL properly configure asset handling, coverage, and test patterns

### Requirement 4

**User Story:** As a developer, I want to migrate test syntax from Jasmine to Vitest, so that all tests use the new testing framework's APIs.

#### Acceptance Criteria

1. WHEN tests use assertions THEN the system SHALL use Vitest's expect API which is largely compatible with Jasmine
2. WHEN tests use test lifecycle hooks THEN the system SHALL use Vitest's beforeEach, afterEach, beforeAll, afterAll
3. WHEN tests use test organization THEN the system SHALL use Vitest's describe and it functions
4. WHEN tests use spies THEN the system SHALL use Vitest's vi.fn() and vi.spyOn() instead of Jasmine spies
5. WHEN tests are executed THEN the system SHALL run successfully with Vitest's test runner

### Requirement 5

**User Story:** As a developer, I want to update router tests to handle Angular v21 timing changes, so that navigation tests work reliably.

#### Acceptance Criteria

1. WHEN router tests navigate THEN the system SHALL ensure navigation completes before assertions
2. WHEN using RouterTestingHarness THEN the system SHALL properly await navigation operations
3. WHEN navigation timing changes THEN the system SHALL handle additional microtasks correctly
4. WHEN tests check navigation results THEN the system SHALL verify navigation has fully completed
5. WHEN router tests execute THEN the system SHALL pass without timing-related failures

### Requirement 6

**User Story:** As a developer, I want to migrate a representative sample of tests first, so that I can validate the migration approach before scaling to all tests.

#### Acceptance Criteria

1. WHEN selecting sample tests THEN the system SHALL choose tests that cover different patterns (simple, async, routing, services)
2. WHEN sample tests are migrated THEN the system SHALL document patterns and solutions for common scenarios
3. WHEN sample tests pass THEN the system SHALL validate that the migration approach is sound
4. WHEN issues are discovered THEN the system SHALL refine the migration approach before proceeding
5. WHEN sample migration is complete THEN the system SHALL provide a clear pattern for migrating remaining tests

### Requirement 7

**User Story:** As a developer, I want to migrate all remaining test files systematically, so that the entire test suite uses Vitest.

#### Acceptance Criteria

1. WHEN migrating test files THEN the system SHALL apply consistent patterns across all tests
2. WHEN tests are migrated THEN the system SHALL maintain test coverage and functionality
3. WHEN migration is complete THEN the system SHALL have no remaining Jasmine or zone.js dependencies in tests
4. WHEN all tests are migrated THEN the system SHALL execute the full test suite successfully with Vitest
5. WHEN the migration is verified THEN the system SHALL confirm all CI/CD test commands work correctly

### Requirement 8

**User Story:** As a developer, I want to update the TestHelper utility class for Vitest compatibility, so that existing test helpers continue to work.

#### Acceptance Criteria

1. WHEN TestHelper is used THEN the system SHALL work correctly with Vitest's testing environment
2. WHEN TestHelper methods are called THEN the system SHALL provide the same functionality as before
3. WHEN TestHelper uses Angular testing utilities THEN the system SHALL integrate properly with TestBed in Vitest
4. WHEN tests use TestHelper THEN the system SHALL execute without compatibility issues
5. WHEN TestHelper is updated THEN the system SHALL maintain backward compatibility with existing test code

### Requirement 9

**User Story:** As a developer, I want to handle TestBed configuration changes for Angular v21, so that component tests work correctly.

#### Acceptance Criteria

1. WHEN TestBed is configured THEN the system SHALL handle the new fake PlatformLocation correctly
2. WHEN tests fail due to PlatformLocation THEN the system SHALL provide MockPlatformLocation as needed
3. WHEN TestBed creates components THEN the system SHALL work correctly in the zoneless environment
4. WHEN tests use TestBed THEN the system SHALL properly handle error rethrowing behavior
5. WHEN component tests execute THEN the system SHALL pass without TestBed-related failures

### Requirement 10

**User Story:** As a developer, I want to update CI/CD pipeline configurations, so that automated testing continues to work with Vitest.

#### Acceptance Criteria

1. WHEN CI/CD runs tests THEN the system SHALL execute tests using Vitest commands
2. WHEN test results are generated THEN the system SHALL produce reports in the expected format
3. WHEN subset tests run THEN the system SHALL execute specific test suites correctly
4. WHEN tests fail in CI/CD THEN the system SHALL provide clear error messages and exit codes
5. WHEN CI/CD completes THEN the system SHALL report test results accurately
