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

## Tech

Built with Angular 21 and TypeScript. Tests use Vitest and live alongside their components as `*.spec.ts` files.

## How It Calls the Backends

On load, each generator page fetches its initial dropdown data from the **Web BFF**:

```
GET https://web.dndgen.com/api/v1/{feature}/viewmodel
```

Live generation and validation calls go directly to each generator's API (`roll.dndgen.com`, `treasure.dndgen.com`, etc.). See the [main README](../README.md#apis) for the full route tables.

The Roll generator uses the V2 routes; all others use V1.
