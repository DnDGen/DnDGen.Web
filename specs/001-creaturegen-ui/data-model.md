# Data Model: CreatureGen Page

**Feature**: [spec.md](spec.md) | **Research**: [research.md](research.md)

All models live in `dndgen-web/src/app/creature/models/` unless marked **reused**. They follow the existing style: an exported class whose constructor declares public properties with defaults. Field names match the API's camelCase JSON. Only fields the page displays or downloads are modelled; others in the JSON are ignored.

## CreatureGenViewModel (`creaturegen-view-model.model.ts`)

| Field | Type | Notes |
|-------|------|-------|
| creatures | string[] | 659 names, API order |
| templates | string[] | Includes "None", which is selectable (forces no template) |
| alignments | string[] | 9 |
| creatureTypes | string[] | Types then subtypes |
| challengeRatings | string[] | Ascending ("0", "1/10", …, "1", "2", …) |

## UI state (in `CreatureGenComponent`, not a model file)

| State | Type | Initial | Rule |
|-------|------|---------|------|
| creatureName | string | `creatures[0]` | Required for Set |
| creatureTemplates | string[] | `[]` | Ordered; repeats and "None" allowed; validity decided by the service |
| randomTemplates | string[] | `[]` | Same rules. `[]` = any (may be templated); `[None]` = forcibly untemplated |
| randomChallengeRating | string | `''` ("Any") | Sent only when non-empty |
| randomAlignment | string | `''` | Sent only when non-empty |
| randomCreatureType | string | `''` | Sent only when non-empty |
| validCreature / validRandom | signal<boolean> | false → validated on init | Generate is disabled unless valid and not validating/generating |
| validating / generating / loading | signal<boolean> | | As in other pages |
| creature | signal<Creature \| null> | null | Replaced on each generate; cleared on error |

**State transitions**: load → validate both tabs → idle. Input change → validating → valid or invalid. Generate → generating → creature shown (or error → cleared + alert).

## Creature (`creature.model.ts`)

| Field | Type |
|-------|------|
| name, summary | string |
| type | CreatureType `{ name: string, subTypes: string[], allTypes: string[] }` |
| size | string |
| challengeRating | string |
| alignment | **reused** `Alignment` |
| levelAdjustment, casterLevel | number \| null |
| templates | string[] (ordered) |
| isAdvanced, canUseEquipment, hasSkeleton | boolean |
| numberOfHands | number |
| abilities | `{ [name: string]: CreatureAbility }` (Strength … Charisma) |
| hitPoints | HitPoints |
| speeds | `{ [movement: string]: CreatureMeasurement }` (Land, Fly, Swim, Burrow, Climb…) |
| armorClass | CreatureArmorClass |
| initiativeBonus, totalInitiativeBonus | number |
| baseAttackBonus, grappleBonus | number (grapple may be null for creatures that can't grapple) |
| space, reach | CreatureMeasurement |
| saves | `{ [name: string]: Save }` (Fortitude, Reflex, Will) |
| skills | CreatureSkill[] |
| feats, specialQualities | **reused** `Feat[]` |
| attacks, fullMeleeAttack, fullRangedAttack, specialAttacks | Attack[] |
| languages | string[] |
| magic | CreatureMagic |
| equipment | CreatureEquipment |
| demographics | Demographics |

## Nested models

- **CreatureAbility**: `name`, `fullScore: number`, `modifier: number`, `hasScore: boolean`. When `hasScore` is false, the ability is displayed as "—" with no modifier (e.g., a Ghost's Constitution).
- **CreatureMeasurement**: `value: number`, `unit: string`, `description: string`. It is structurally compatible with the **reused** `Measurement`, so `MeasurementPipe` is used directly.
- **Bonus**: `value: number`, `condition: string`, `isConditional: boolean`.
- **HitPoints**: `total`, `defaultTotal`, `hitDiceQuantity`, `roundedHitDiceQuantity`, `hitDice: HitDice[] {hitDie, quantity, roundedQuantity, defaultRoll}`, `defaultRoll`, `conditionalBonuses: Bonus[]`, `summary`.
- **CreatureArmorClass**: `totalBonus`, `touchBonus`, `flatFootedBonus`, `isConditional`, `sizeModifier`, `dexterityBonus`, `armorBonus`, `shieldBonus`, `naturalArmorBonus`, `deflectionBonus`, `dodgeBonus`, `bonuses: Bonus[]`.
- **Save**: `totalBonus`, `isConditional`, `hasSave`, `bonuses: Bonus[]`. A save with `hasSave` false is shown as "—".
- **CreatureSkill**: `name`, `focus`, `totalBonus`, `ranks`, `effectiveRanks`, `classSkill`, `circumstantialBonus`, `armorCheckPenalty`, `hasArmorCheckPenalty`, `baseAbility: CreatureAbility`, `bonuses: Bonus[]`. Display name is `name (focus)` when there is a focus, sorted like Character.
- **Attack**: `name`, `attackType`, `isMelee`, `isNatural`, `isPrimary`, `isSpecial`, `totalAttackBonus`, `fullAttackBonuses: number[]`, `attackBonuses: Bonus[]`, `damageSummary`, `damageEffect`, `frequency` (**reused** `Frequency`), `maxNumberOfAttacks`.
- **CreatureMagic**: `casterLevel`, `caster`, `arcaneSpellFailure`, `domains: string[]`, `spellsPerDay: CreatureSpellQuantity[]`, `knownSpells: CreatureSpell[]`, `preparedSpells: CreatureSpell[]`.
  - **CreatureSpellQuantity**: `source`, `level`, `quantity`, `bonusSpells`, `hasDomainSpell`, `totalQuantity`.
  - **CreatureSpell**: `source`, `level`, `name`, `metamagic: string[]`.
- **CreatureEquipment**: `weapons: Weapon[]`, `armor: Armor | null`, `shield: Item | null`, `items: Item[]` (**reused** TreasureGen `Weapon`, `Armor`, `Item`).
- **Demographics**: `gender`, `age`, `maximumAge`, `height`, `length`, `weight`, `wingspan` (CreatureMeasurement), `skin`, `hair`, `eyes`, `other` (string). Measurements with value 0 show their description only (existing `MeasurementPipe` behaviour); empty strings are omitted.

## Validation rules (from the spec)

- The Set request requires a non-empty `creatureName` (local short-circuit to invalid; the server decides everything else).
- Template lists are ordered and sent exactly as shown, including "None" and repeats. The page never filters them; the service's validation decides.
- Random filters are each a single value or empty. Empty means the filter is omitted from the request.
