// Extends the built-in ImportMeta interface so that import.meta.env?.VITE_*
// compiles cleanly in both Vitest (where env is defined) and Angular production
// builds (where import.meta.env is undefined — the ?. handles that at runtime).
interface ImportMetaEnv {
  readonly VITE_WEB_API_URL?: string;
  readonly VITE_ROLL_API_URL?: string;
  readonly VITE_TREASURE_API_URL?: string;
  readonly VITE_CHARACTER_API_URL?: string;
  readonly VITE_ENCOUNTER_API_URL?: string;
  readonly VITE_DUNGEON_API_URL?: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}
