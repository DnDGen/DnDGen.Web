# Contract: CreatureService (website → APIs)

`dndgen-web/src/app/creature/services/creature.service.ts`, `@Injectable({ providedIn: 'root' })`, same style as `CharacterService`.

| Method | HTTP | Query |
|--------|------|-------|
| `getViewModel(): Observable<CreatureGenViewModel>` | `GET https://web.dndgen.com/api/v1/creature/viewmodel` | none |
| `validateCreature(creature: string, templates: string[]): Observable<boolean>` | `GET https://creature.dndgen.com/api/v1/creature/{creature}/validate` | `templates` appended once per entry, in order |
| `generateCreature(creature: string, templates: string[]): Observable<Creature>` | `GET https://creature.dndgen.com/api/v1/creature/{creature}/generate` | same |
| `validateRandom(templates: string[], challengeRating: string, alignment: string, creatureType: string): Observable<boolean>` | `GET https://creature.dndgen.com/api/v1/creature/validate` | `templates` (ordered, repeated); `cr`, `alignment`, `type` only when non-empty |
| `generateRandom(...same...)`: `Observable<Creature>` | `GET https://creature.dndgen.com/api/v1/creature/generate` | same |

- `{creature}` is URL-encoded (names contain spaces, commas, and parentheses).
- Example: `.../creature/Human/validate?templates=Ghost&templates=Lich` → `false`; `...?templates=Ghost` → `true`.

# Contract: UI components

| Selector | Inputs | Outputs | Location |
|----------|--------|---------|----------|
| `dndgen-creaturegen` (route `/creature`) | — | — | `creature/components/creaturegen.component.*` |
| `dndgen-creature` | `creature: Creature` | — | `creature/components/creature.component.*` |
| `dndgen-attack` | `attack: Attack` | — | `creature/components/attack.component.*` |
| `dndgen-template-list` | `id: string`, `templates: string[]` (options, all of them, including "None"), `selected: string[]` (may repeat), `emptyText: string` | `selectedChange: string[]` | `creature/components/template-list.component.*` |
| `dndgen-searchable-select` | `id: string`, `options: string[]`, `value: string`, `placeholder?: string`, `clearOnSelect = false` | `valueChange: string` | `shared/components/searchable-select.component.*` |

# Contract: Element ids (for tests and smoke checks)

Set tab: `creatureName`, `creatureTemplates`, `generateCreatureButton`, `creatureValidating` (small `dndgen-loading` beside the button, as `treasureValidating`). Random tab: `randomTemplates`, `randomChallengeRating`, `randomAlignment`, `randomCreatureType`, `generateRandomButton`, `randomValidating`. Output: `creatureSection`, `noCreature`, `generatingSection`, `downloadButton`. Navigation: `creaturegenCodeLink`, `creaturegenApiLink`, plus the nav link to `/creature`. Exact ids follow the neighbouring pages' naming during implementation.

# Contract: API documentation corrections (FR-029)

`GenerateRandomCreatureFunction` and `ValidateRandomCreatureFunction` OpenAPI attributes:

- `alignment`: `Required = false`.
- `type`: `Type = typeof(string)`, "The desired type or subtype of the generated creature (single value)."
- `cr`: `Type = typeof(string)`, "The desired Challenge Rating of the generated creature (single value)."

The root README CreatureGen route table is changed to match. No runtime behaviour changes.
