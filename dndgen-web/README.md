# DndgenWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running tests

Run `npm run test` to execute the tests via [vitest](https://vitest.dev/). You can also run tests for individual generators:
* `npm run test:rollgen`
* `npm run test:treasuregen`
* `npm run test:charactergen`
* `npm run test:encountergen`
* `npm run test:dungeongen`

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
  - Specs: `my-feature.component.spec.ts`
- Directories also use kebab-case (e.g., `navigation-menu/`, `spell-group/`)
- Do **not** use camelCase in file names (e.g., avoid `spellGroup.service.ts`)
