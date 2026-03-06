# Requirements Document

## Introduction

The DnDGen web application experiences a UI freeze where loading indicators remain visible after API calls complete. The issue manifests when users interact with any generator (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen) and then switch browser tabs. Upon returning to the tab, the UI updates correctly. This behavior suggests a change detection issue potentially related to the Angular v20 to v21 upgrade and Zone.js compatibility.

## Glossary

- **Zone.js**: Angular's change detection mechanism that automatically triggers UI updates when async operations complete
- **Zoneless**: Angular's newer change detection approach using signals that requires manual change detection triggers
- **Change Detection**: The process by which Angular updates the DOM when component state changes
- **Generator Components**: The five main feature components (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen) that make API calls
- **Loading State**: Boolean flags (`loading`, `rolling`, `validating`) that control visibility of loading indicators

## Requirements

### Requirement 1

**User Story:** As a developer, I want to diagnose the root cause of the loading indicator freeze, so that I can confirm whether Zone.js is the issue before implementing a migration.

#### Acceptance Criteria

1. WHEN diagnostic tests are run THEN the system SHALL verify that Zone.js is properly loaded and active
2. WHEN API calls complete THEN the system SHALL log whether change detection is triggered automatically
3. WHEN manual change detection is applied THEN the system SHALL confirm whether the loading indicator updates correctly
4. WHEN the issue is reproduced in a test THEN the system SHALL capture the exact conditions that cause the freeze
5. WHEN diagnostic results are collected THEN the system SHALL provide clear evidence of whether Zone.js or another issue is the root cause

### Requirement 2

**User Story:** As a developer, I want to implement a fix for the RollGen component first, so that I can validate the solution on a simpler component before scaling to others.

#### Acceptance Criteria

1. WHEN RollGen makes an API call THEN the loading indicator SHALL display immediately
2. WHEN the API call completes successfully THEN the loading indicator SHALL hide without requiring a tab switch
3. WHEN the API call fails THEN the loading indicator SHALL hide and error handling SHALL execute
4. WHEN validation occurs THEN the validating indicator SHALL update correctly in real-time
5. WHEN the fix is implemented THEN existing RollGen functionality SHALL remain unchanged

### Requirement 3

**User Story:** As a developer, I want automated tests that reproduce the loading indicator issue, so that I can verify the fix works and prevent regressions.

#### Acceptance Criteria

1. WHEN a test simulates an API call THEN the test SHALL verify the loading state changes correctly
2. WHEN a test simulates tab switching behavior THEN the test SHALL detect if change detection is delayed
3. WHEN the fix is applied THEN the test SHALL pass without manual intervention
4. WHEN tests run in CI/CD THEN the tests SHALL reliably detect the issue across environments
5. WHEN tests complete THEN the tests SHALL provide clear failure messages indicating the specific loading state issue

### Requirement 4

**User Story:** As a developer, I want to replicate the fix to TreasureGen, CharacterGen, EncounterGen, and DungeonGen, so that all generators have consistent and reliable change detection.

#### Acceptance Criteria

1. WHEN the fix pattern is applied to each generator THEN the implementation SHALL be consistent across all components
2. WHEN any generator makes an API call THEN the loading indicators SHALL update correctly without tab switching
3. WHEN generators handle errors THEN the loading states SHALL reset properly
4. WHEN generators perform validation THEN the validation states SHALL update in real-time
5. WHEN all generators are migrated THEN the application SHALL have no remaining loading indicator freeze issues

### Requirement 5

**User Story:** As a developer, I want to choose between Zone.js fixes and zoneless migration based on diagnostic results, so that I implement the most appropriate solution.

#### Acceptance Criteria

1. IF Zone.js is functioning correctly THEN the system SHALL implement targeted change detection fixes
2. IF Zone.js is broken or incompatible THEN the system SHALL migrate to zoneless change detection using signals
3. WHEN implementing zoneless migration THEN the system SHALL convert component properties to signals
4. WHEN implementing zoneless migration THEN the system SHALL update templates to use signal syntax
5. WHEN the solution is chosen THEN the system SHALL document the rationale and implementation approach
