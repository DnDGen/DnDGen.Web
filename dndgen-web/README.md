# DnDGen Web

The Angular single-page application at [DnDGen.com](http://dndgen.com).

## Generators

The site exposes five of the six DnDGen generators:

- **Roll** — Roll dice by quantity and die type (e.g. 3d6), or by arbitrary expression (e.g. 3d6+2)
- **Treasure** — Generate treasure (coin, goods, items) by treasure type and level, or a specific item by type, power, and optional name
- **Character** — Generate full D&D 3.5e characters with configurable randomizers for alignment, class, level, race, and ability scores; also generates leadership packages, cohorts, and followers
- **Encounter** — Generate encounters by temperature, environment, time of day, and party level; supports creature type filters and aquatic/underground options
- **Dungeon** — Generate dungeon areas entered from a door or a hall, by dungeon level, environment, and party level

CreatureGen has an API but the website generator page is not yet implemented.

## How It Calls the Backends

On load, each generator page fetches its initial dropdown data from the **Web BFF**:

```
GET https://web.dndgen.com/api/v1/{feature}/viewmodel
```

Live generation and validation calls go directly to each generator's API (`roll.dndgen.com`, `treasure.dndgen.com`, etc.). See the [main README](../README.md#apis) for the full route tables.

Roll and Treasure use the V2 routes; Character, Encounter, and Dungeon use V1.

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
