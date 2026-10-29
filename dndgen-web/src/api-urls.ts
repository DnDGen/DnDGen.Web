// Base URLs for each DnDGen API.
// In Vitest runs, VITE_* env vars override these (set via vitest.config.local.ts for local testing).
// In Angular production builds, import.meta.env is undefined, so the prod URLs are used as fallback.
export const ApiUrls = {
  web:       import.meta.env?.VITE_WEB_API_URL       ?? 'https://web.dndgen.com',
  roll:      import.meta.env?.VITE_ROLL_API_URL      ?? 'https://roll.dndgen.com',
  treasure:  import.meta.env?.VITE_TREASURE_API_URL  ?? 'https://treasure.dndgen.com',
  character: import.meta.env?.VITE_CHARACTER_API_URL ?? 'https://character.dndgen.com',
  encounter: import.meta.env?.VITE_ENCOUNTER_API_URL ?? 'https://encounter.dndgen.com',
  dungeon:   import.meta.env?.VITE_DUNGEON_API_URL   ?? 'https://dungeon.dndgen.com',
};
