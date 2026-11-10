---
description: "Task list for the CreatureGen page"
---

# Tasks: CreatureGen Page

**Input**: Design documents from `specs/001-creaturegen-ui/` ([plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/creature-service.md](contracts/creature-service.md), [quickstart.md](quickstart.md))

**Tests**: REQUIRED. Constitution II says tests come first and are seen to fail, and II.2.c (Web) requires 100% website line and branch coverage. Every implementation task is preceded by its failing test task. Test cases are named as consumer outcomes (II.1). Assertions compare whole values (II.3.a).

**Patterns to copy (I.1)**: before writing each file, open its CharacterGen/TreasureGen counterpart and copy its structure, naming, and test style:

- **Service**: `dndgen-web/src/app/character/services/character.service.ts` + `.unit.spec.ts` + `.integration.spec.ts`.
- **Generator page**: `dndgen-web/src/app/treasure/components/treasuregen.component.*` (per-tab validity) and `dndgen-web/src/app/character/components/charactergen.component.*` (download, generating section, error handling, `charactergen.component.test-helper.ts`).
- **Display**: `dndgen-web/src/app/character/components/character.component.*` (nested `dndgen-details`).
- **Text pipe**: `dndgen-web/src/app/character/pipes/character.pipe.ts` + `character.pipe.test-helper.ts`.
- **Shared test helpers**: `dndgen-web/src/app/test-helper.ts`.

**Run tests**: from `dndgen-web/`: `npm run test:creaturegen`, `npm run test:unit`, `npm run test:integration`.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

**Purpose**: Folder skeleton and test scripts.

- [X] T001 Create folders `dndgen-web/src/app/creature/{components,models,pipes,services}/` (mirroring `dndgen-web/src/app/character/`)
- [X] T002 Add npm scripts to `dndgen-web/package.json`, matching the charactergen entries: `"test:creaturegen": "ng test --no-watch --include='src/app/creature/**/*.spec.ts'"` (after `test:treasuregen`) and `"test:integration:ci:creaturegen": "ng test --no-watch --runner-config vitest.config.ci.integration.ts --include='src/app/creature/**/*.integration.spec.ts'"` (after `test:integration:ci:treasuregen`). In the same task, add the row `` | `npm run test:creaturegen` | All tests for CreatureGen | `` after the TreasureGen row of the "Running tests" table in `dndgen-web/README.md`. `dndgen-web/src/app/readme.integration.spec.ts` requires every non-CI script to be documented: it fails when the script is added and passes once the row is in.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The API documentation fix, models, service, and the two reusable input components that every story needs.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### API documentation corrections (FR-029; own commit, III.2)

- [X] T003 [P] In `DnDGen.Api.CreatureGen/Functions/GenerateRandomCreatureFunction.cs` and `DnDGen.Api.CreatureGen/Functions/ValidateRandomCreatureFunction.cs`, change only the OpenAPI attributes: `alignment` → `Required = false`; `type` → `Type = typeof(string)`, Description "The desired type or subtype of the generated creature (single value)."; `cr` → `Type = typeof(string)`, Description "The desired Challenge Rating of the generated creature (single value)." No behaviour change.
- [X] T004 [P] In root `README.md` CreatureGen table rows `v1/creature/generate` and `v1/creature/validate`, change the parameters to `alignment` (string, query, optional), `templates` (string[], query, optional), `type` (string, query, optional), `cr` (string, query, optional)
- [X] T005 Run `dotnet test DnDGen.Apis.sln` to confirm all API tests still pass. Then commit T003–T004 as "Correct CreatureGen random route documentation"

### Models (data-model.md)

- [X] T006 [P] Create `dndgen-web/src/app/creature/models/creaturegen-view-model.model.ts`: `CreatureGenViewModel(creatures: string[], templates: string[], alignments: string[], creatureTypes: string[], challengeRatings: string[])`. Note: templates "Includes \"None\", which is selectable (forces no template)"
- [X] T007 [P] Create small creature models, each in its own file in `dndgen-web/src/app/creature/models/` with constructor defaults in the `character/models` style:
  - `bonus.model.ts` (`value`, `condition`, `isConditional`);
  - `creature-type.model.ts` (`name`, `subTypes`, `allTypes`);
  - `creature-ability.model.ts` (`name`, `fullScore`, `modifier`, `hasScore`);
  - `creature-measurement.model.ts` (`value`, `unit`, `description`);
  - `hit-dice.model.ts` (`hitDie`, `quantity`, `roundedQuantity`, `defaultRoll`);
  - `save.model.ts` (`totalBonus`, `isConditional`, `hasSave`, `bonuses: Bonus[]`).
- [X] T008 [P] Create the composite creature models in `dndgen-web/src/app/creature/models/`:
  - `hit-points.model.ts`;
  - `creature-armor-class.model.ts`;
  - `creature-skill.model.ts`;
  - `attack.model.ts` (reuses `Frequency` from `character/models/frequency.model.ts`);
  - `creature-spell.model.ts` (`source`, `level`, `name`, `metamagic`);
  - `creature-spell-quantity.model.ts`;
  - `creature-magic.model.ts`;
  - `creature-equipment.model.ts` (`weapons: Weapon[]`, `armor: Armor | null`, `shield: Item | null`, `items: Item[]`, reusing the treasure models);
  - `demographics.model.ts`.

  All fields are exactly as listed in data-model.md "Nested models".
- [X] T009 Create `dndgen-web/src/app/creature/models/creature.model.ts` with every field in data-model.md "Creature" (reusing `Alignment` and `Feat`), with defaults so `new Creature('summary')` builds a complete empty creature for tests

### Service (contracts/creature-service.md)

- [X] T010 [P] Write failing unit tests in `dndgen-web/src/app/creature/services/creature.service.unit.spec.ts`. They use HttpClient mocks the same way as `character.service.unit.spec.ts`:
  - Each of the 5 methods calls the exact URL.
  - The creature name is URL-encoded, e.g. "Lycanthrope, Dire Wolf (Dire Werewolf, Natural)".
  - `templates` is sent once per entry in order, for 0, 1, 2, and 3 templates and for a swapped order.
  - `cr`, `alignment`, and `type` are sent when non-empty and omitted when empty, each individually and all together.
  - Results are returned unchanged.
- [X] T011 [P] Write failing integration tests in `dndgen-web/src/app/creature/services/creature.service.integration.spec.ts` (live APIs):
  - The view model has non-empty `creatures`/`templates`/`alignments`/`creatureTypes`/`challengeRatings` and contains "Human", "Ghost", "None", "Neutral Evil", "Aberration", "1/2".
  - `validateCreature` for Human + [] → true, Human + [Ghost] → true, Human + [Ghost, Lich] → false.
  - `generateCreature` Human + [] → name "Human", templates [].
  - `generateCreature` Human + [Ghost] → templates ["Ghost"].
  - `validateCreature` Human + [None, None] → true, Human + [None, Ghost] → true, Human + [Ghost, Ghost] → false.
  - `validateRandom` with no filters → true; [None] → true; [None, None] → true; [Ghost, Ghost] → false; Fiendish Creature + "Neutral Good" → false.
  - `generateRandom` with [None] → `templates` is [] (forcibly untemplated).
  - `generateRandom` with cr "5", alignment "Neutral Evil", type "Aberration" (validates as true, verified 2026-11-11) → a creature matching all three (the type matched against `type.allTypes`).
  - `generateRandom` with the same filters and [None] → a creature matching all three with `templates` []. This combination yields both templated and untemplated creatures (verified 2026-11-11: with no templates, 7 of 12 were untemplated, mostly Gibbering Mouther, and 5 were templated: Half-Fiend Ethereal Filcher, Fiendish Creature Mimic, Ghost Ettercap; [None] validates as true). Aberration is used because no template grants the Aberration type, unlike Undead (Ghost/Lich/Vampire/Zombie/Skeleton) or Outsider (Half-Fiend/Half-Celestial), which would skew results toward templates. So the no-template case asserts only the filters, never whether a template was applied.
- [X] T012 Implement `dndgen-web/src/app/creature/services/creature.service.ts` per the contract, using `HttpParams.append('templates', t)` in order and `.set` for non-empty filters, until T010–T011 pass

### Shared searchable select (new pattern, research R4)

- [X] T013 [P] Write failing unit and integration tests for `dndgen-web/src/app/shared/components/searchable-select.component.unit.spec.ts` and `.integration.spec.ts`:
  - Typing a query lists exactly the options whose names contain it, case-insensitive, in view-model order (whole-list comparison, II.3.a). The integration spec uses the real creature list, verified 2026-11-11:
    - "yuan-ti" → exactly the 6 Yuan-ti creatures: Abomination, Pureblood, and 4 Halfblood variants.
    - "red dragon" → exactly the 12 Red Dragon ages (Wyrmling … Great Wyrm) plus "Chimera (Red Dragon head)".
    - "colossal" → exactly the 15 creatures with "Colossal" in their name (11 Animated Objects, Monstrous Centipede, Monstrous Scorpion, and 2 Monstrous Spiders).
    - Mixed case ("YUAN-TI") gives the same results.
  - The unit spec uses a small fixed option list to cover the same behaviours.
  - Focus or click with empty text lists all options.
  - Choosing an option emits `valueChange`.
  - Free text that matches nothing emits nothing and keeps the previous value.
  - With `clearOnSelect`, the input empties after choosing.
  - Long names render in full.
  - The `id` is applied to the input.
- [X] T014 Implement `dndgen-web/src/app/shared/components/searchable-select.component.{ts,html}` (`dndgen-searchable-select`, standalone, `NgbTypeaheadModule`, `[editable]="false"`, focus/click streams merged into the search, `form-control` styling, results not truncated and shown in a scrollable dropdown) until T013 passes. Filtering is local, so there is no `debounceTime` (research R4).

### Ordered template list (research R5)

- [X] T015 [P] Write failing unit and integration tests in `dndgen-web/src/app/creature/components/template-list.component.unit.spec.ts` and `.integration.spec.ts`:
  - Adding appends to the end and emits the new array.
  - Every view-model template is offered, including "None".
  - Already-selected templates are still offered, and adding one again appends a repeat (e.g. [None, None], [Ghost, Ghost]).
  - The empty-list label comes from an `emptyText` input ("Any templates" for Random, "No templates" for Set).
  - Move up/down swaps neighbours and emits.
  - Move up is disabled on the first row and move down on the last.
  - Remove keeps the others' order and emits.
  - The list shows 1-based positions.
  - Sampling at 0, 1, 2, and 3 templates.
- [X] T016 Implement `dndgen-web/src/app/creature/components/template-list.component.{ts,html}` (`dndgen-template-list`; inputs `id`, `templates`, `selected`, `emptyText`; output `selectedChange`) using `dndgen-searchable-select` with `clearOnSelect`, until T015 passes. Add an `//INFO:` comment explaining why the page never filters "None" or repeats: "None" forces an untemplated random creature, and the CreatureGen validation decides which repeats are valid.

**Checkpoint**: Foundation ready. User stories can begin.

---

## Phase 3: User Story 1 - Generate a specific creature (Priority: P1) 🎯 MVP

**Goal**: The Set tab picks one creature via search, validates, and generates; the creature summary is shown.

**Independent Test**: Open `/creature`, pick Hill Giant with no templates, generate, and see "Hill Giant".

### Tests for User Story 1 ⚠️ (write first, see them fail)

- [ ] T017 [P] [US1] Create `dndgen-web/src/app/creature/components/creaturegen.component.test-helper.ts` (mirroring `charactergen.component.test-helper.ts`) with helpers to set the creature, read validity, click generate, and wait for loading
- [ ] T018 [P] [US1] Write failing unit tests in `dndgen-web/src/app/creature/components/creaturegen.component.unit.spec.ts` (mock `CreatureService`, `FileSaverService`, `SweetAlertService`, `LoggerService`):
  - Init loads the view model, sets `creatureName = creatures[0]`, validates the Set tab, and clears `loading`/`validating`.
  - Changing the creature calls `validateCreature` with the new name and current templates.
  - An empty creature is invalid without calling the service.
  - `validCreature` follows the service.
  - Generate is disabled while invalid, validating, or generating.
  - `generateCreature()` sets `generating`, clears the old creature, then sets the new one.
  - Errors from init, validate, or generate log, clear the creature, reset flags, and call `showError`.
  - Rendering: tabs "Set" and "Random"; `noCreature` text "No creature has been generated"; generating section with message "Generating creature...".
- [ ] T019 [P] [US1] Write failing integration tests in `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts` (live APIs, real child components):
  - The page loads with a valid default creature.
  - Searching "giant" and choosing Hill Giant validates as valid.
  - Generate shows a creature whose summary contains "Hill Giant".

### Implementation for User Story 1

- [ ] T020 [US1] Create a minimal `dndgen-web/src/app/creature/components/creature.component.{ts,html}` (`dndgen-creature`, input `creature`) rendering the top-level `dndgen-details` with `[heading]="creature.summary"`, so US1 is demonstrable. Add `creature.component.unit.spec.ts` and `.integration.spec.ts` with the heading case; US4 expands these.
- [ ] T021 [US1] Implement `dndgen-web/src/app/creature/components/creaturegen.component.ts` (`dndgen-creaturegen`, standalone, imports `LoadingComponent`, `FormsModule`, `NgbNavModule`, `SearchableSelectComponent`, `TemplateListComponent`, `CreatureComponent`), with:
  - signals `creatureModel`, `loading`, `validating`, `generating`, `validCreature`, `validRandom`, `creature`, `generatingMessage`;
  - inputs `creatureName`, `creatureTemplates`;
  - methods `ngOnInit`, `setInitialValues`, `validateCreature(creatureName?, templates?)`, `generateCreature()`, `handleError`, `finishInit`, `finishGeneration`.

  Follow `treasuregen.component.ts` and `charactergen.component.ts`.
- [ ] T022 [US1] Implement `dndgen-web/src/app/creature/components/creaturegen.component.html` with:
  - `<h1>CreatureGen</h1>`, then `dndgen-loading`;
  - left `col-sm-6` holding `ngbNav` tabs "Set" (form with `dndgen-searchable-select` id `creatureName`, `dndgen-template-list` id `creatureTemplates`, button `generateCreatureButton` "Generate" disabled when `!validCreature() || validating() || generating()`, and `<dndgen-loading id="creatureValidating" [isLoading]="validating()" [size]="sizes.Small">` beside it, as in `treasuregen.component.html`) and "Random" (placeholder filled by US3);
  - right `col-sm-6` holding the `downloadButton` slot, `creatureSection` / `noCreature`, and `generatingSection`.

  Copy the layout and classes from `charactergen.component.html`.
- [ ] T023 [US1] Add route `{ path: 'creature', component: CreatureGenComponent, pathMatch: 'full' }` between treasure and character in `dndgen-web/src/app/app.routes.ts`, with a failing-first case in `dndgen-web/src/app/app.routes.unit.spec.ts`. In the same task, update `dndgen-web/README.md` "Generators":
  - "five of the six" becomes "all six".
  - Add a `**Creature**` bullet after Treasure: "Generate a specific creature with optional ordered templates, or a random creature filtered by challenge rating, alignment, creature type, and ordered templates (including None to force an untemplated creature); download as text".
  - Remove "CreatureGen has an API but the website generator page is not yet implemented."

  `readme.integration.spec.ts` requires a `**Name**` bullet for every generator route.

**Checkpoint**: US1 works at `/creature`. This is the MVP.

---

## Phase 4: User Story 2 - Apply templates in a specific order (Priority: P1)

**Goal**: Set-tab templates are added, reordered, and removed; each change re-validates and the order is sent.

**Independent Test**: Human + Ghost is valid and generates a Ghost Human; adding Lich after Ghost makes it invalid.

### Tests for User Story 2 ⚠️

- [ ] T024 [P] [US2] Add failing unit cases to `dndgen-web/src/app/creature/components/creaturegen.component.unit.spec.ts`:
  - Each `selectedChange` from `creatureTemplates` updates `creatureTemplates` and calls `validateCreature` with the exact ordered array (0, 1, 2, 3 templates; swapped order).
  - `generateCreature` sends templates in order.
- [ ] T025 [P] [US2] Add failing integration cases to `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`:
  - Human + Ghost → valid, and generating shows templates ["Ghost"] in the summary/output.
  - Human + Ghost + Lich → invalid, and Generate is disabled.
  - Removing Lich → valid again.

### Implementation for User Story 2

- [ ] T026 [US2] Wire `(selectedChange)` of `creatureTemplates` in `creaturegen.component.html` to set `creatureTemplates` and call `validateCreature(creatureName, $event)`. Pass `creatureModel()!.templates` as options. Pass `creatureTemplates` to `creatureService.generateCreature`. Do this until T024–T025 pass.

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Generate a random creature with filters (Priority: P2)

**Goal**: The Random tab has optional ordered templates and single-value CR, alignment, and type filters ("Any" = omitted), validated on every change.

**Independent Test**: No filters → generates. CR 5 + Neutral Evil + Aberration → a matching creature.

### Tests for User Story 3 ⚠️

- [ ] T027 [P] [US3] Add failing unit cases to `dndgen-web/src/app/creature/components/creaturegen.component.unit.spec.ts`:
  - Init also validates the Random tab with all filters empty.
  - Each of `randomChallengeRating`, `randomAlignment`, and `randomCreatureType` (`<select>` with first option "Any" = `''`, options in view-model order) triggers `validateRandom` with the exact args.
  - Template changes trigger `validateRandom` with the ordered array.
  - `generateRandomButton` is disabled while `!validRandom()`, validating, or generating.
  - `generateRandom()` passes all current values.
  - Switching tabs keeps each tab's inputs.
  - Errors are handled as in US1.
- [ ] T028 [P] [US3] Add failing integration cases to `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`:
  - Random with no filters generates a creature.
  - Each filter alone (CR "5", alignment "Neutral Evil", type "Aberration") yields a matching creature.
  - All three together yield a matching creature. With [None] added, the creature also has no templates.
  - Fiendish Creature + Neutral Good is invalid, with Generate disabled.
  - With an empty template list, the label "Any templates" is shown. Adding "None" and generating shows a creature with no templates.
  - [None, None] is valid; [Ghost, Ghost] is invalid.
  - Resetting a filter to "Any" makes it valid again.

### Implementation for User Story 3

- [ ] T029 [US3] Add `randomTemplates`, `randomChallengeRating`, `randomAlignment`, `randomCreatureType` inputs and `validateRandom(templates?, cr?, alignment?, type?)` / `generateRandom()` methods to `dndgen-web/src/app/creature/components/creaturegen.component.ts`. Extend `ngOnInit` to `switchMap` into `validateRandom` after `validateCreature`. Do this until T027 passes.
- [ ] T030 [US3] Fill the "Random" tab in `dndgen-web/src/app/creature/components/creaturegen.component.html`: three `form-select` dropdowns (`randomChallengeRating`, `randomAlignment`, `randomCreatureType`, each with "Any") laid out like the CharacterGen rows (`col-sm-2` label, `col-sm-4` input), `dndgen-template-list` id `randomTemplates`, `generateRandomButton`, and the `randomValidating` small loading indicator beside it. Do this until T028 passes.

**Checkpoint**: US1–US3 work independently.

---

## Phase 6: User Story 4 - Read and download the creature (Priority: P2)

**Goal**: The full creature stat block in nested sections, plus a text download.

**Independent Test**: Generate any creature; every section in spec US4-AS1 is present; the downloaded `<summary>.txt` has the same data.

### Tests for User Story 4 ⚠️

- [ ] T031 [P] [US4] Write failing tests for `dndgen-web/src/app/creature/components/attack.component.unit.spec.ts` and `.integration.spec.ts`:
  - The name is shown with its type (melee/ranged, natural, primary/secondary, special).
  - The total attack bonus uses "+N" formatting, and full attack bonuses are shown as "+15/+10".
  - The damage summary and damage effect are shown.
  - Frequency comes from `FrequencyPipe`.
  - Conditional attack bonuses are marked.
- [ ] T032 [P] [US4] Expand `dndgen-web/src/app/creature/components/creature.component.unit.spec.ts` with failing cases, one per section listed in spec US4-AS1:
  - summary heading; size; type and subtypes; CR; alignment; level adjustment (including none); templates in order;
  - hit points (total, hit dice, conditional bonuses); speeds (each movement, with description); AC total, touch, and flat-footed, plus conditional; initiative; BAB and grapple;
  - space and reach via `MeasurementPipe`; saves (each, plus conditional, plus `hasSave` false → "—"); abilities (score and modifier; `hasScore` false → "—");
  - skills sorted by display name, with focus and circumstantial marking;
  - feats and special qualities via `dndgen-feat`, including empty; attacks, full melee, full ranged, and special attacks via `dndgen-attack`, including empty; languages, including empty;
  - magic (caster level, domains, spells per day, known/prepared spells grouped by source and level, including no magic);
  - equipment (weapons, armor, shield, items via `dndgen-item`, including none);
  - demographics (gender, age, max age, height/length/weight/wingspan; skin/hair/eyes/other omitted when empty).
- [ ] T033 [P] [US4] Expand `dndgen-web/src/app/creature/components/creature.component.integration.spec.ts` with failing cases rendering real generated creatures: Human, Ghost Human (Constitution "—"), Couatl (magic), and Hill Giant (equipment).
- [ ] T034 [P] [US4] Create `dndgen-web/src/app/creature/pipes/creature.pipe.test-helper.ts` and write failing tests in `dndgen-web/src/app/creature/pipes/creature.pipe.unit.spec.ts`. They assert the full expected text output (whole-string comparison, II.3.a) for:
  - a full creature, and a minimal creature;
  - each optional section empty;
  - no-score ability and no-save;
  - conditional bonuses;
  - templates in order;
  - equipment items formatted by `ItemPipe`.

  Copy the indentation and labelling conventions from `character.pipe.ts`.
- [ ] T035 [P] [US4] Add failing cases to `creaturegen.component.unit.spec.ts` and `creaturegen.component.integration.spec.ts`:
  - `downloadButton` is shown only when a creature exists.
  - `download()` calls `fileSaverService.save(creaturePipe.transform(creature), creature.summary)`.
  - `download()` does nothing with no creature.
  - A new generation replaces the displayed creature.

### Implementation for User Story 4

- [ ] T036 [US4] Implement `dndgen-web/src/app/creature/components/attack.component.{ts,html}` (`dndgen-attack`, input `attack`) until T031 passes
- [ ] T037 [US4] Complete `dndgen-web/src/app/creature/components/creature.component.{ts,html}` (imports `DetailsComponent`, `FeatComponent`, `ItemComponent`, `AttackComponent`, `BonusPipe`, `BonusesPipe`, `MeasurementPipe`, `FrequencyPipe`, `DecimalPipe`; provides `DecimalPipe`, `InchesToFeetPipe`) with sections in this order:
  - Overview, Hit Points, Combat, Attacks, Abilities, Skills, Feats, Special Qualities, Languages, Magic, Equipment, Demographics.

  Use nested `dndgen-details` in the same style as `character.component.html`. Do this until T032–T033 pass.
- [ ] T038 [US4] Implement `dndgen-web/src/app/creature/pipes/creature.pipe.ts` (`CreaturePipe`, standalone, injecting `ItemPipe`, `BonusPipe`, `BonusesPipe`, `MeasurementPipe`, `FrequencyPipe`) until T034 passes
- [ ] T039 [US4] Add `download()` and the `downloadButton` to `creaturegen.component.{ts,html}`, providing `CreaturePipe` and its dependencies in the component `providers` like `charactergen.component.ts`. Do this until T035 passes.

**Checkpoint**: US1–US4 complete; the page is feature-complete.

---

## Phase 7: User Story 5 - Discover CreatureGen from the site chrome (Priority: P3)

**Goal**: Nav, GitHub, and API menu entries between TreasureGen and CharacterGen.

**Independent Test**: The nav order is RollGen, TreasureGen, CreatureGen, CharacterGen, EncounterGen, DungeonGen; both menus have working CreatureGen links.

- [ ] T040 [P] [US5] Add failing cases to `dndgen-web/src/app/navigation-menu/navigation-menu.component.unit.spec.ts` and `.integration.spec.ts`:
  - The full ordered list of main links includes CreatureGen → `/creature`.
  - The GitHub menu, in full order, includes `creaturegenCodeLink` → `https://github.com/DnDGen/CreatureGen` with `target="_blank"`.
  - The API menu, in full order, includes `creaturegenApiLink` → `https://creature.dndgen.com/api/swagger/ui` with `target="_blank"`.
- [ ] T041 [US5] Insert the three entries between TreasureGen and CharacterGen in `dndgen-web/src/app/navigation-menu/navigation-menu.component.html`, matching the neighbouring markup, until T040 passes. Also update any other spec that asserts the full nav or route list (e.g. `dndgen-web/src/app/app.component.integration.spec.ts`) if it fails.

---

## Phase 8: User Story 6 - Releases check CreatureGen end to end (Priority: P3)

**Goal**: The release and smoke tests cover CreatureGen like CharacterGen. Own commit (III.2).

**Independent Test**: The release YAML and the Postman collections contain the CreatureGen entries, and the Newman collections run locally.

- [ ] T042 [P] [US6] In `cicd/release.yml` job `CreatureGen_Api`, remove `hasWebsiteTests: false` (the template `cicd/templates/api-deploy-steps.yml` defaults it to `true`) and set `websiteTestScript: test:integration:ci:creaturegen` and `websiteResultFile: creaturegen.website.xml`, matching `CharacterGen_Api`
- [ ] T043 [P] [US6] Add a "CreatureGen View Model" request to `cicd/smoke-tests/Web-API.postman_collection.json`, copying "CharacterGen View Model". URL: `v1/creature/viewmodel`. Tests: status 200, and the JSON has non-empty `creatures`, `templates`, `alignments`, `creatureTypes`, `challengeRatings`. Place it between TreasureGen and CharacterGen.
- [ ] T044 [P] [US6] Add a "CreatureGen Page" request to `cicd/smoke-tests/DnDGen-Website.postman_collection.json`, copying "CharacterGen Page" with path `/creature`, between TreasureGen and CharacterGen
- [ ] T045 [US6] Run both collections with Newman against production for the view model (the page route will 200 via the SPA fallback), and commit T042–T044 as "Add CreatureGen to release and smoke tests"

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T046 [P] Update root `README.md`:
  - The website section covers six generators.
  - Remove "CreatureGen has an API but no generator page on the site yet".
  - Line 4: list the creature generator alongside the others.
- [ ] T047 [P] Re-read `dndgen-web/README.md` against the finished page and correct anything the T002/T023 wording no longer matches
- [ ] T048 Run the README phrase tests (`dndgen-web/src/app/readme.integration.spec.ts` and `DnDGen.Web.Tests.Integration`). Update `docs/theme-song/README.md` Lyrics and Sources for lines 45 and 58 (and any other phrase the tests list) per its "Updating" section, singing names as words. Record in the PR that **the maintainer must make the Suno cover and update the link**.
- [ ] T049 Commit T046–T048 as "Document the CreatureGen page"
- [ ] T050 Run `npm run test:unit` and `npm run test:integration` in `dndgen-web/` with coverage. Confirm 100% line and branch coverage for the website, and add the missing cases for any gap.
- [ ] T051 Run `dotnet test DnDGen.Apis.sln` and the quickstart manual scenarios ([quickstart.md](quickstart.md)) with `npm start`, including a 375px-wide check of the layout
- [ ] T052 Open a PR to `main` with reviewer `cidthecoatrack`, linking DnDGen/DnDGen.Web#1963. Write the description from the diff, state what was and wasn't verified, and call out the theme-song re-record. If wanted, file issues for multi-value CR/type filters and for cancelling stale validations site-wide (III.3).

---

## Dependencies & Execution Order

- **Setup (T001–T002)** → **Foundational (T003–T016)** → user stories.
- **US1 (T017–T023)** is the MVP and blocks US2–US4, because they extend `creaturegen.component.*` and `creature.component.*`.
- **US2 (T024–T026)** and **US3 (T027–T030)** both edit `creaturegen.component.*`, so do them sequentially (US2 first).
- **US4 (T031–T039)**: T031/T034/T036/T038 (attack, pipe) can proceed in parallel with US2/US3; T032/T033/T037 extend the creature component; T035/T039 touch `creaturegen.component.*`, so they come after US3.
- **US5 (T040–T041)** and **US6 (T042–T045)** are independent of US2–US4 and can run any time after US1 (US6 needs the T002 script name only).
- **Polish (T046–T052)** comes last. T048 depends on T046.

## Parallel Opportunities

- Foundational: T003/T004 (docs), T006/T007/T008 (models), T010/T011 (service tests), T013 (select tests), T015 (template-list tests).
- US1 tests: T017/T018/T019 together.
- US4: T031 + T034 (attack + pipe tests) alongside US2/US3 work; then T036 + T038.
- US5 + US6: T040, T042, T043, T044 all in parallel.
- Polish: T046 + T047.

## Implementation Strategy

1. **MVP**: Phases 1–3. Pick a creature, generate, see its name at `/creature`.
2. **+US2**: Ordered templates (the core CreatureGen differentiator).
3. **+US3**: The Random tab.
4. **+US4**: Full display and download. The page is now feature-complete.
5. **+US5/US6**: Discoverability and release safety.
6. **Polish**: Docs, theme song, coverage, PR.

Each checkpoint leaves all tests green and coverage at 100% for the code written so far.
