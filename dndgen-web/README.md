# DndgenWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running tests

Tests are split into unit (`.unit.spec.ts`) and integration (`.integration.spec.ts`) files, colocated with their source.

Run `npm run test` to execute all tests via [vitest](https://vitest.dev/), or target a subset:

| Script | Runs |
|--------|------|
| `npm run test` | All tests (unit + integration) |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run test:rollgen` | All tests for RollGen |
| `npm run test:treasuregen` | All tests for TreasureGen |
| `npm run test:charactergen` | All tests for CharacterGen |
| `npm run test:encountergen` | All tests for EncounterGen |
| `npm run test:dungeongen` | All tests for DungeonGen |

The `:ci` variants (`test:unit:ci`, `test:integration:ci`, `test:integration:ci:*`) are used by the CI/CD pipelines — they add a JUnit reporter and write XML output files.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## File Naming Conventions

This project follows the [Angular style guide](https://angular.dev/style-guide) for file naming:

- All file names use **kebab-case** (e.g., `spell-group.service.ts`, `armor-class.model.ts`)
- File names follow the pattern: `<feature-name>.<type>.ts`
  - Components: `my-feature.component.ts`
  - Services: `my-feature.service.ts`
  - Models: `my-feature.model.ts`
  - Pipes: `my-feature.pipe.ts`
  - Unit specs: `my-feature.component.unit.spec.ts`
  - Integration specs: `my-feature.component.integration.spec.ts`
- Directories also use kebab-case (e.g., `navigation-menu/`, `spell-group/`)
- Do **not** use camelCase in file names (e.g., avoid `spellGroup.service.ts`)
