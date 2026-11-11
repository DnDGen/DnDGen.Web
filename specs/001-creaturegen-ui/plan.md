# Implementation Plan: CreatureGen Page

**Branch**: `001-creaturegen-ui` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md) | **Issue**: [DnDGen/DnDGen.Web#1963](https://github.com/DnDGen/DnDGen.Web/issues/1963)

**Input**: Feature specification from `specs/001-creaturegen-ui/spec.md`

## Summary

Add a CreatureGen page to the Angular site. It has Set and Random tabs, a searchable creature selector, ordered template lists, and single-value CR, alignment, and type filters, with validation on every change. It shows the full creature and offers a text download. All options come from the already-live Web API view model, and the page calls the already-live CreatureGen API. Around the page:

- **Site chrome**: navigation, GitHub, and API links.
- **Release checks**: CreatureGen website tests run in the release; Web API and website smoke checks are added.
- **Documentation**: the CreatureGen Swagger and README docs are corrected to match actual API behaviour, the README is updated, and so is the theme song.

## Technical Context

**Language/Version**: TypeScript ~5.9, Angular ^21.2 (standalone components, signals); C# .NET 10 (CreatureGen API, documentation attributes only)

**Primary Dependencies**: @ng-bootstrap/ng-bootstrap ^20 (NgbNav, NgbTypeahead), Bootstrap 5.3, rxjs 7.8, sweetalert2; existing shared FileSaverService, LoggerService, SweetAlertService, DetailsComponent, LoadingComponent, Bonus/Bonuses/Measurement/Frequency pipes, FeatComponent, ItemComponent/ItemPipe

**Storage**: N/A

**Testing**: Vitest via `ng test` (unit `*.unit.spec.ts` with TestBed mocks; integration `*.integration.spec.ts` against live APIs); NUnit for APIs (unchanged behaviour); Postman/Newman smoke collections

**Target Platform**: Azure Static Web App (dndgen.com), modern browsers, responsive Bootstrap layout

**Project Type**: Web application (Angular SPA + Azure Function APIs in a mono-repo)

**Performance Goals**: Page interactions feel instant; search over 659 creatures filters as the user types; generation time is set by the API

**Constraints**: No new npm packages; follow existing page patterns (I.1); 100% website line/branch coverage (II.2.c (Web)); no API behaviour changes

**Scale/Scope**: 1 new page with 2 tabs, ~5 new components, ~15 new model files, 1 service, 1 pipe, nav/route/CI/doc edits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | How |
|-----------|--------|-----|
| **I.1 Emulate what exists** | ✅ | Page, service, pipe, model, and test structure copy CharacterGen and TreasureGen (per-tab validity like TreasureGen; download like CharacterGen; error handling via logger and sweet alert). Display copies `CharacterComponent`'s nested `dndgen-details`. Existing models and components are reused where the JSON shape matches (R7). |
| **I.2 New pattern worth conforming to** | ✅ justified | `dndgen-searchable-select` (NgbTypeahead wrapper) is the site's first searchable select. Clearer for 659 items (I.2.a); one shared answer for long lists (I.2.c); no new dependency. Short lists stay as plain `<select>`. See R4. |
| **I.3 Prose-like code, no comments** | ✅ | No comments added. |
| **II.1 Tests first, consumer cases** | ✅ | Tasks write failing unit and integration specs before each component, service, and pipe. Cases are named as user outcomes. |
| **II.2 Sampling** | ✅ | Templates at 0/1/2 (+ one chain of 3); each filter alone, "Any", and all together; order swapped; boundary of move-up/down at first/last. |
| **II.2.c (Web) 100% coverage** | ✅ | Required for `dndgen-web`; API DLL coverage unchanged (attribute-only edits). |
| **II.3 Strong assertions** | ✅ | Whole-object/collection comparisons for requests and models, and full-text comparison for `CreaturePipe` output. |
| **III.1.c Correct stale docs** | ✅ | Swagger attributes and README route table (FR-029); `dndgen-web/README.md`; theme song lyrics and sources. |
| **III.2 Own commits** | ✅ | Doc corrections and CI edits are committed separately from the feature code. |
| **III.3 Out of scope → issues** | ✅ | Multi-value CR/type filters and cancelling in-flight validations site-wide are recorded as issues if wanted, not done here. |
| **Release / README contract** | ✅ | README documents the page and corrected routes. Theme song updated per its "Updating" process. **The maintainer makes the Suno cover** (called out in the PR). |
| **Workflow** | ✅ | Branch → PR to `main`, reviewer `cidthecoatrack`; the PR description is written from the diff and says what was and wasn't verified. |

No violations, so Complexity Tracking is empty.

**Post-design re-check**: ✅ Unchanged. The data model reuses `Feat`, `Frequency`, `Alignment`, `Weapon`, `Armor`, and `Item`, and adds creature models only where the JSON shape differs.

## Project Structure

### Documentation (this feature)

```text
specs/001-creaturegen-ui/
├── spec.md
├── plan.md                       # this file
├── research.md                   # R1–R12 decisions
├── data-model.md
├── quickstart.md
├── contracts/creature-service.md
├── checklists/requirements.md
└── tasks.md                      # /speckit-tasks
```

### Source Code (repository root)

```text
dndgen-web/
├── package.json                                  # + test:creaturegen, test:integration:ci:creaturegen
├── README.md                                     # Creature page documented
└── src/app/
    ├── app.routes.ts / app.routes.unit.spec.ts   # + /creature
    ├── navigation-menu/navigation-menu.component.html (+ unit/integration specs)  # nav, GitHub, API links
    ├── test-helper.ts                            # + creature factories/expectations as needed
    ├── shared/components/
    │   └── searchable-select.component.{ts,html} (+ unit/integration specs)   # NEW shared pattern
    └── creature/                                 # NEW, mirrors character/
        ├── components/
        │   ├── creaturegen.component.{ts,html} (+ unit, integration specs, test-helper)
        │   ├── creature.component.{ts,html} (+ unit, integration specs)
        │   ├── attack.component.{ts,html} (+ unit, integration specs)
        │   └── (template list: see shared/components/ordered-multi-select)
        ├── models/        # creaturegen-view-model, creature, creature-type, creature-ability,
        │                  # creature-measurement, bonus, hit-points, hit-dice, creature-armor-class,
        │                  # save, creature-skill, attack, creature-magic, creature-spell,
        │                  # creature-spell-quantity, creature-equipment, demographics
        ├── pipes/
        │   └── creature.pipe.ts (+ unit spec, test-helper)
        └── services/
            └── creature.service.ts (+ unit, integration specs)

DnDGen.Api.CreatureGen/Functions/
├── GenerateRandomCreatureFunction.cs             # OpenAPI attributes only
└── ValidateRandomCreatureFunction.cs             # OpenAPI attributes only

cicd/
├── release.yml                                   # CreatureGen website tests enabled
└── smoke-tests/
    ├── Web-API.postman_collection.json           # + CreatureGen View Model
    └── DnDGen-Website.postman_collection.json    # + CreatureGen Page

README.md                                         # page + corrected route table
docs/theme-song/README.md                         # lyrics + sources (maintainer re-records)
```

**Structure Decision**: Mirror the existing per-generator feature folder (`src/app/character/` → `src/app/creature/`) with `components/`, `models/`, `pipes/`, and `services/`. The one cross-cutting addition goes in `shared/components/`.

## Implementation Order (for /speckit-tasks)

1. **Docs-only API fix** (own commit): Swagger attributes and README route table.
2. **Foundations**: models, `CreatureService` (tests first), `SearchableSelectComponent`, `OrderedMultiSelectComponent`.
3. **US1/US2 Set tab**, then **US3 Random tab**, in `CreatureGenComponent`.
4. **US4 display/download**: `AttackComponent`, `CreatureComponent`, `CreaturePipe`, `download()`.
5. **US5 chrome**: route, nav, GitHub/API links.
6. **US6 CI/CD**: package.json scripts, release.yml, Postman collections (own commit).
7. **Docs**: READMEs, theme song lyrics and sources (own commit). Flag the Suno re-record for the maintainer.
8. **Verify**: full unit + integration runs, coverage at 100%, `dotnet test`, manual quickstart.

## Complexity Tracking

None.
