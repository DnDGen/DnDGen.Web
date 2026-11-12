# Research: CreatureGen Page

**Feature**: [spec.md](spec.md) | **Date**: 2026-11-10

All findings were checked against this repository and the live services on 2026-11-10.

## R1. Is the CreatureGen view model available?

- **Decision**: Consume the existing `GET https://web.dndgen.com/api/v1/creature/viewmodel`. No Web API work.
- **Rationale**: `GetCreatureViewModelFunction` and `CreatureViewModel` already exist, are covered by tests, and are deployed (HTTP 200; 659 creatures, 44 templates, 9 alignments, 42 types and subtypes, 34 CRs). JSON keys: `creatures`, `templates`, `alignments`, `creatureTypes`, `challengeRatings`.
- **Gap found**: `cicd/smoke-tests/Web-API.postman_collection.json` has no "CreatureGen View Model" request (it has one for every other generator). Added to scope (FR-025).

## R2. CreatureGen API parameters

| Route | Parameters (actual behaviour) |
|-------|-------------------------------|
| `GET v1/creature/{creatureName}/validate` → `bool` | `templates` (repeatable, ordered, optional) |
| `GET v1/creature/{creatureName}/generate` → `Creature` | `templates` (repeatable, ordered, optional) |
| `GET v1/creature/validate` → `bool` | `templates` (repeatable, ordered, optional); `alignment`, `type`, `cr` (each a single optional value) |
| `GET v1/creature/generate` → `Creature` | same as random validate |

- **Decision**: The website sends `templates` as repeated query params in display order (`HttpParams.append`), and sends `alignment`, `type`, `cr` only when chosen.
- **Rationale**: `CreatureValidator.GetValid` reads `request.Query.GetValues("templates")` (ordered, many) but `request.Query["type"]`/`["cr"]`/`["alignment"]` (single value; multiple values join into one invalid value). Validating with no filters returns `true`, so alignment is optional.
- **No other set-creature parameters exist.** `asCharacter` is hard-coded `false` on purpose (the maintainer confirmed it is reserved for CharacterGen's future use of CreatureGen; FR-030).
- **The validator also accepts the aliases `creatureType` and `challengeRating`.** The website uses the documented names `type` and `cr`.

## R2a. Example random filters for tests

Sampled 2026-11-11: 12 generates per creature type, with CR 5 + Neutral Evil + that type and no templates ("any"), plus a validate call with [None]:

| Type | Templated | Untemplated | [None] valid |
|------|-----------|-------------|--------------|
| Undead | 11 | 1 | true |
| Humanoid | 11 (all lycanthropes) | 0 | **false** |
| Giant | 10 | 2 | true |
| Monstrous Humanoid | 5 | 5 | true |
| **Aberration** | 5 | 7 | true |
| Magical Beast | 2 | 7 | true |
| Outsider | 1 | 10 | true |

- **Decision**: Tests use **CR 5 + Neutral Evil + Aberration**. No template grants the Aberration type, whereas Undead (Ghost, Lich, Vampire, Zombie, Skeleton), Outsider (Half-Fiend, Half-Celestial), Dragon (Half-Dragon) and Magical Beast (Celestial/Fiendish Creature on animals and vermin) can all be produced by templates. So Aberration doesn't skew toward templated results, and it produces both kinds.
- **Observation for the maintainer**: Even outside template-granted types, "any templates" often comes back templated (e.g. Giant 10/12, mostly Ghost and Werewolf Merrow and Ogre), and no untemplated CR 5 Neutral Evil Humanoid exists. Whether random selection is meant to weight templated and untemplated results this way is a CreatureGen question, not website scope (III.3).

## R3. Swagger and README mismatches (FR-029)

- **Decision**: Correct the documentation only; behaviour is right.
  - `GenerateRandomCreatureFunction` and `ValidateRandomCreatureFunction`: `alignment` becomes `Required = false`; `type` and `cr` become `Type = typeof(string)` with descriptions saying they take a single value.
  - Root `README.md` CreatureGen table: `alignment` (string, query, optional); `type` (string, query, optional); `cr` (string, query, optional).
- **Rationale**: Constitution III.1.c (correct stale documentation). No behaviour change, so no new test cases are needed (there are no tests asserting OpenAPI attributes). Coverage is unaffected.
- **Alternatives considered**: Making `type`/`cr` accept many values. That is a behaviour change (III.3), so it is out of scope and can be filed as an issue if wanted.

## R4. Searchable dropdown

- **Decision**: Use ng-bootstrap's `NgbTypeahead`, which is already a dependency (`@ng-bootstrap/ng-bootstrap` ^20). Wrap it once as a shared `dndgen-searchable-select` component (`shared/components/`). It filters case-insensitively by substring, opens the full list on focus/click, rejects free text (`[editable]="false"`), and emits the chosen value.
- **Rationale**: There is no searchable select anywhere in the site yet (every list is a plain `<select class="form-select">`), so this is a new pattern (I.2). It is clearer for a 659-item list (I.2.a) and it uses no new package. One shared component used in three places (creature, set templates, random templates) gives one answer for future long lists (I.2.c).
- **Alternatives considered**:
  - A plain `<select>`, which is unusable at 659 items.
  - A `<datalist>`: inconsistent across browsers, can't restrict to list values, and is hard to test in jsdom.
  - `ng-select`: a new dependency when ng-bootstrap already covers this.
- **No keypress debounce.** RollGen's expression box waits 500 ms (`debounceTime(500)` in `rollgen.component.ts`) because each keystroke would otherwise call the validate API. Here, typing only filters the already-loaded list in the browser. Validation runs once, when an item is chosen, not per keystroke. NgbTypeahead doesn't debounce on its own (its docs add `debounceTime` in the search function); with local filtering there is nothing to throttle, so none is added.
- **Results are not truncated.** NgbTypeahead's docs examples cap at 10, but a search like "colossal" has 15 legitimate matches. All matches show in a scrollable dropdown.
- **Short lists** (alignment 9, CR 34, type 42) stay plain `<select class="form-select">` with a leading "Any" option, which is consistent with every other page.

## R5. Ordered template list

- **Decision**: New shared `dndgen-ordered-multi-select` component (`shared/components/`), used by both tabs and generic enough to replace lists of checkboxes elsewhere later (e.g. EncounterGen/DungeonGen environments). It has an add selector (`dndgen-searchable-select` over the options not yet chosen, including "None") and an ordered list where each row has its 1-based position, the name, a move-up and a move-down button (disabled at the ends), and a remove button. It emits the new `string[]` on every change, and the parent then re-validates.
- **Rationale**: Order changes validity (Human+Ghost valid; Human+Ghost+Lich invalid), so order must be visible and editable. Two tabs need identical behaviour, so one component.
- **Alternatives considered**: Drag-and-drop is harder to test, less accessible, and has no precedent; a multi-select `<select multiple>` cannot express order.
- **"None"** is a real template (maintainer, 2026-11-10). For random creatures, `[]` means "any: may be templated" and `[None]` means "forcibly untemplated". It can be combined with other templates. When the list is empty the component shows "Any templates" on the Random tab and "No templates" on the Set tab. That matches the API: verified 2026-11-10, a set creature with no templates came back with `templates: []`, while a random creature with no templates may be templated.
- **Repeats** are not offered: once chosen, a template leaves the add selector until removed (maintainer, PR review 2026-11-11: a repeated template makes no sense to a user). The API does accept some repeats (verified 2026-11-10: Human + [None, None] → true, Human + [Ghost, Ghost] → false), and validation still decides every list the page can build.
- **Connection failures while probing (2026-11-11, investigated; not a CreatureGen defect)**: An early probe showed one empty result. That came from piping `curl -s` straight into a JSON parser, which hides transport errors. Re-probed with status codes:
  - 40 sequential no-filter random generates: all `200`, 16–62 KB, 0.7–3.4 s.
  - Under 6-way parallel load: 8 of 180 generate calls failed with curl exit 28, "Failed to connect to creature.dndgen.com:443 after ~19.5 s". That is a TCP connect timeout, with no HTTP response at all. One call failed with exit 35, "connection reset".
  - The same failures appeared against CreatureGen **validate** (1 of 60) and **CharacterGen** validate (1 of 60), but not against `api.github.com` (0 of 60).
  - **No request ever returned a successful status with an empty or missing body.**

  Conclusion: these are intermittent connection failures between this machine (corporate network) and the Azure App Service front end. They hit every DnDGen API, not just generation. CI integration tests already retry (`retry.count: 2` in `vitest.config.ci.integration.ts`) for all generators, so CreatureGen needs nothing extra. If CI shows connect failures from the Azure pipeline agents too, that would be an infrastructure issue for all APIs and gets its own issue (III.3).

## R6. Validation flow

- **Decision**: Follow `TreasureGenComponent`, which has per-tab validity: signals `validating`, `validCreature`, `validRandom`. `ngOnInit` loads the view model, sets the initial values, then validates both tabs in sequence via `switchMap`, then `finishInit`. `validateCreature(...)` and `validateRandom(...)` run on every `(change)`/emit, short-circuit to invalid locally when the creature is empty, and otherwise call the service. Errors go to `handleError`, which logs, clears the creature, resets the flags, and calls `sweetAlertService.showError()`.
- **Rationale**: I.1. The existing pages do not cancel in-flight validations; the spec was aligned to that behaviour rather than introducing `switchMap`-on-input-stream cancellation here. If wanted site-wide, that is its own issue (III.3).

## R7. Creature model vs. existing Character models

The CreatureGen `Creature` JSON differs from CharacterGen's in most nested shapes, so most of the Creature model is new under `creature/models/`. It reuses models only where the JSON shape matches exactly:

| Creature JSON | Reuse? |
|---------------|--------|
| `feats[]`, `specialQualities[]` `{name, foci, power, frequency, canBeTakenMultipleTimes}` | **Reuse** `Feat`/`Frequency` and `FeatComponent`, `FrequencyPipe` |
| `alignment {lawfulness, goodness, full}` | **Reuse** `Alignment` |
| `equipment.weapons[]/armor/shield/items[]` (TreasureGen items) | **Reuse** `Weapon`, `Armor`, `Item` and `ItemComponent`, `ItemPipe` |
| `abilities` map with `fullScore`, `modifier`, `hasScore`, `summary` | New `CreatureAbility` (character `Ability` is `{name,value,bonus}`) |
| `speeds`, `space`, `reach`, `demographics.*` `{unit, value, description, bonuses}` | New `CreatureMeasurement` (adds `bonuses`), displayed with the existing `MeasurementPipe` (structurally compatible) |
| `skills[]` (has `baseAbility` as `CreatureAbility`, `bonuses[]`) | New `CreatureSkill` |
| `saves` map, `armorClass`, `hitPoints`, `attacks[]` | New models |
| `magic.knownSpells[]` `{source, level, name, metamagic}` | New `CreatureSpell` (character `Spell` has a `sources` map) |
| `magic.spellsPerDay[]` `{source, level, quantity, bonusSpells, hasDomainSpell, totalQuantity}` | New `CreatureSpellQuantity` |

- **Decision**: Model classes follow the existing constructor-with-defaults style. `Creature` holds everything listed in [data-model.md](data-model.md).
- **Bonuses**: Use the shared `BonusPipe`/`BonusesPipe` for "+N" formatting and conditional marking, as Character does.

## R8. Display and download

- **Decision**: `CreatureComponent` (`dndgen-creature`) mirrors `CharacterComponent`: a top-level `dndgen-details` with the summary as heading, then nested `dndgen-details` sections: Overview, Hit Points, Combat (AC, initiative, BAB/grapple, saves, space/reach, speeds), Attacks, Abilities, Skills, Feats, Special Qualities, Languages, Magic, Equipment, Demographics. Sub-components: `dndgen-attack` (new; reused for attacks/full melee/full ranged/special attacks), `dndgen-feat` (reused), `dndgen-item` (reused), and a creature spell list rendered inline grouped by source and level.
- **Download**: New `CreaturePipe` (text, same indentation and labelling conventions as `CharacterPipe`, reusing `ItemPipe`, `BonusPipe`, `BonusesPipe`, `MeasurementPipe`, `FrequencyPipe`). `CreatureGenComponent.download()` calls `fileSaverService.save(creaturePipe.transform(creature), creature.summary)`, the same as Character.

## R9. Navigation, routing, links

- **Decision**: Route `creature` → `CreatureGenComponent`. Nav, GitHub, and API menu entries inserted between TreasureGen and CharacterGen with ids `creatureGenLink`-style matching neighbours: `creaturegenCodeLink` → `https://github.com/DnDGen/CreatureGen`, `creaturegenApiLink` → `https://creature.dndgen.com/api/swagger/ui`. Update `app.routes.unit.spec.ts` and the navigation-menu specs.

## R10. CI/CD and smoke tests

- **Decision** (mirrors CharacterGen):
  - `package.json`: add `test:creaturegen` and `test:integration:ci:creaturegen` (`src/app/creature/**`).
  - `cicd/release.yml` CreatureGen_Api: remove `hasWebsiteTests: false`; set `websiteTestScript: test:integration:ci:creaturegen`, `websiteResultFile: creaturegen.website.xml`.
  - `Web-API.postman_collection.json`: add "CreatureGen View Model" (status 200; JSON has the five non-empty arrays).
  - `DnDGen-Website.postman_collection.json`: add "CreatureGen Page" mirroring "CharacterGen Page".
- **To verify during implementation**: whether `cicd/templates/api-deploy-steps.yml` has other conditionals that reference `hasWebsiteTests`, and whether `build.yml` publishes per-API website results, so CreatureGen matches CharacterGen exactly.

## R11. Documentation and theme song

- **Decision**: Update the root `README.md` (the site covers six generators; remove "CreatureGen has an API but no generator page on the site yet"; fix the route table per R3) and `dndgen-web/README.md` (add the Creature page; remove "not yet implemented").
- **Theme song**: `docs/theme-song/README.md` lyric lines 45 ("But there isn't any page for it yet.") and 58 ("(And creature generation will be coming very soon.)") cite the README sentence being removed. The README phrase tests will fail until they change. Following the song's "Updating" process, the contributor updates the Lyrics and Sources in this PR, and **the maintainer makes the new Suno cover** and updates the link. This step is the maintainer's, so the PR will call it out.

## R12. Testing approach

- **Unit** (`*.unit.spec.ts`, TestBed with mocked services, as in `charactergen.component.unit.spec.ts`): service (URLs, params, template order, omitted filters), generator component (init, validation per input, generate, download, error handling, button states), template list, searchable select, creature component (every section, empty sections, no-score ability), pipes (text output for every field).
- **Integration** (`*.integration.spec.ts`, real HTTP against live APIs, as in `character.service.integration.spec.ts`): service view model, validate and generate for set (0, 1, 2 templates; valid and invalid order) and random (no filters, each filter, all filters, an incompatible combination); generator component rendering end to end.
- **Sampling (II.2)**: templates at 0, 1, 2 (plus one chain of 3); every filter individually; the "Any" boundary for each filter; order swapped for a 2-template chain.
- **Coverage**: 100% line and branch for `dndgen-web` (II.2.c (Web)).
