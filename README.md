DnDGen.Web
==========

This is the website through which people can use the dice roller (RollGen), the equipment generator (TreasureGen), the character generator (CharacterGen), the encounter generator (EncounterGen), and the dungeon generator (DungeonGen), with a creature generator API (CreatureGen) also available.

[![Build Status](https://dev.azure.com/dndgen/DnDGen/_apis/build/status%2FDnDGen.Web%20-%20Build?branchName=main)](https://dev.azure.com/dndgen/DnDGen/_build/latest?definitionId=7&branchName=main) [![Theme Song](https://img.shields.io/badge/theme_song-Suno-ff69b4)](https://suno.com/s/UfzjIXCTb6RlZBt3)

## Website

[DnDGen.com](http://dndgen.com) — an Angular single-page application covering five of the six generators: Roll, Treasure, Character, Encounter, and Dungeon. CreatureGen has an API but no generator page on the site yet. See [dndgen-web/README.md](dndgen-web/README.md) for details.

## APIs

All APIs are written in C# and run as Azure Function Apps. Swagger UI is the authoritative reference for request/response schemas, parameter constraints, and enum values.

### RollGen

Base URL: `https://roll.dndgen.com/api` · [Swagger UI](https://roll.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/roll` | `quantity` (int, query), `die` (int, query) | `int` |
| GET | `v1/roll/validate` | `quantity` (int, query), `die` (int, query) | `bool` |
| GET | `v1/expression/roll` | `expression` (string, query) | `int` |
| GET | `v1/expression/validate` | `expression` (string, query) | `bool` |

**V2**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v2/{quantity}/d/{die}/roll` | `quantity` (int, path), `die` (int, path) | `int` |
| GET | `v2/{quantity}/d/{die}/validate` | `quantity` (int, path), `die` (int, path) | `bool` |
| GET | `v2/expression/roll` | `expression` (string, query) | `int` |
| GET | `v2/expression/validate` | `expression` (string, query) | `bool` |

The expression endpoints accept any dice expression — standard `NdM` notation plus arithmetic, keep-highest (`k`), exploding (`!`), transform (`t`), and compound rolls. See the web app's [expression examples](dndgen-web/src/app/roll/components/rollgen.component.html) for the full syntax.

### TreasureGen

Base URL: `https://treasure.dndgen.com/api` · [Swagger UI](https://treasure.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/{treasureType}/level/{level}/generate` | `treasureType` (string, path), `level` (int, path) | `Treasure` |
| GET | `v1/{treasureType}/level/{level}/validate` | `treasureType` (string, path), `level` (int, path) | `bool` |
| GET | `v1/item/{itemType}/power/{power}/generate` | `itemType` (string, path), `power` (string, path), `name` (string, query, optional) | `Item` |
| GET | `v1/item/{itemType}/power/{power}/validate` | `itemType` (string, path), `power` (string, path), `name` (string, query, optional) | `bool` |

**V2**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v2/{treasureType}/level/{level}/generate` | `treasureType` (string, path), `level` (int, path) | `Treasure` |
| GET | `v2/{treasureType}/level/{level}/validate` | `treasureType` (string, path), `level` (int, path) | `bool` |
| GET | `v2/item/{itemType}/power/{power}/generate` | `itemType` (string, path), `power` (string, path), `name` (string, query, optional) | `Item` |
| GET | `v2/item/{itemType}/power/{power}/validate` | `itemType` (string, path), `power` (string, path), `name` (string, query, optional) | `bool` |

### CreatureGen

Base URL: `https://creature.dndgen.com/api` · [Swagger UI](https://creature.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/creature/{creatureName}/generate` | `creatureName` (string, path), `templates` (string[], query, optional) | `Creature` |
| GET | `v1/creature/{creatureName}/validate` | `creatureName` (string, path), `templates` (string[], query, optional) | `bool` |
| GET | `v1/creature/generate` | `alignment` (string, query, optional), `templates` (string[], query, optional), `type` (string, query, optional), `cr` (string, query, optional) | `Creature` |
| GET | `v1/creature/validate` | `alignment` (string, query, optional), `templates` (string[], query, optional), `type` (string, query, optional), `cr` (string, query, optional) | `bool` |

### CharacterGen

Base URL: `https://character.dndgen.com/api` · [Swagger UI](https://character.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/character/generate` | Randomizer params — see Swagger | `Character` |
| GET | `v1/character/validate` | Randomizer params — see Swagger | `bool` |
| GET | `v1/leadership/level/{level}/generate` | `level` (int, path), `leaderCharismaBonus` (int, query, optional), `leaderAnimal` (string, query, optional) | `Leadership` |
| GET | `v1/cohort/score/{cohortScore}/generate` | `cohortScore` (int, path), `leaderLevel` (int, query), `leaderAlignment` (string, query), `leaderClassName` (string, query) | `Character` |
| GET | `v1/follower/level/{followerLevel}/generate` | `followerLevel` (int, path), `leaderAlignment` (string, query), `leaderClassName` (string, query) | `Character` |

Character generation accepts six randomizer type params (`alignmentRandomizerType`, `classNameRandomizerType`, `levelRandomizerType`, `baseRaceRandomizerType`, `metaraceRandomizerType`, `abilitiesRandomizerType`) plus corresponding `set*` values for each. See Swagger for all options.

### EncounterGen

Base URL: `https://encounter.dndgen.com/api` · [Swagger UI](https://encounter.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level}/generate` | `temperature`, `environment`, `timeOfDay` (string, path); `level` (int, path); `allowAquatic`, `allowUnderground` (bool, query, optional); `creatureTypeFilters` (string[], query, optional) | `Encounter` |
| GET | `v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level}/validate` | same as generate | `bool` |

### DungeonGen

Base URL: `https://dungeon.dndgen.com/api` · [Swagger UI](https://dungeon.dndgen.com/api/swagger/ui)

**V1**

| Method | Route | Parameters | Returns |
|--------|-------|------------|---------|
| GET | `v1/dungeon/level/{dungeonLevel}/door/{temperature}/{environment}/{timeOfDay}/level/{partyLevel}/generate` | `dungeonLevel`, `partyLevel` (int, path); `temperature`, `environment`, `timeOfDay` (string, path); `allowAquatic`, `allowUnderground` (bool, query, optional); `creatureTypeFilters` (string[], query, optional) | `Area[]` |
| GET | `v1/dungeon/level/{dungeonLevel}/hall/{temperature}/{environment}/{timeOfDay}/level/{partyLevel}/generate` | same as door | `Area[]` |

This will incrementally generate a dungeon, allowing the DM to map-as-you-go or apply their own map constraints as they see fit.

### Web BFF

Base URL: `https://web.dndgen.com/api` · [Swagger UI](https://web.dndgen.com/api/swagger/ui)

Serves the Angular app's initial view models.

**V1**

| Method | Route | Returns |
|--------|-------|---------|
| GET | `v1/roll/viewmodel` | `RollViewModel` |
| GET | `v1/treasure/viewmodel` | `TreasureViewModel` |
| GET | `v1/creature/viewmodel` | `CreatureViewModel` |
| GET | `v1/character/viewmodel` | `CharacterViewModel` |
| GET | `v1/encounter/viewmodel` | `EncounterViewModel` |
| GET | `v1/dungeon/viewmodel` | `DungeonViewModel` |

## Testing

Tests run across three layers:

- **Unit** — fast, isolated tests for each API; in each API's `*.Tests.Unit` project
- **Integration** — end-to-end tests against the live deployed endpoints; in each API's `*.Tests.Integration` project
- **Smoke** — Postman collections run with Newman after each deployment, one per API; in `cicd/smoke-tests/`

For website (Angular) tests, see [dndgen-web/README.md](dndgen-web/README.md).

## Theme Song

"By Command of the DM, Generate!" — a royal herald fanfare for DnDGen.Web. [Record](https://github.com/DnDGen/DnDGen.Web/blob/main/docs/theme-song/README.md) | **Listen on [Suno](https://suno.com/s/UfzjIXCTb6RlZBt3).**
