# DnDGen.Web Theme Song

## Updating

If the root README changes, run the integration tests to see if `Sources_EveryQuotedPhraseIsStillInTheReadme` fails. For each failing quoted phrase:

1. Find the lyric line that quotes it in the Sources table below
2. Update the source cell with the new phrasing (or mark it `Not from the README:` if the lyric no longer traces to the README)
3. If the lyrics themselves need changing, regenerate on Suno using the updated ## Title, ## Style, and ## Lyrics below
4. Replace the Suno share link in ## Album Art and in the root README badge
5. Replace `cover.png` with the new album art

## Title

```
By Command of the DM, Generate!
```

## Style

```
Broadway showtune, Rodgers and Hammerstein, royal herald fanfare, bright staccato brass and winds, breathless proclamation, patter song, male ensemble herald voices, triumphant and playfully pompous, pizzicato strings, building to grand finale, uptempo, town crier energy, Cinderella The Prince Is Giving A Ball style
```

## Lyrics

```
[Intro - Bright brass fanfare, triumphant]
Hear ye! Hear ye!

[Verse 1 - Herald, rapid and breathless]
The website through which people can use
The dice roller!
The equipment generator!
The character generator!
The creature generator!
The encounter generator!
The dungeon generator!

[Pre-Chorus - Building]
All APIs run as Azure Function Apps!
Generate!
Validate!

[Chorus - Full ensemble, triumphant]
Generate! Generate!
At DnDGen.com!
An Angular single-page application!
Five of the six generators!
Roll, Treasure, Character,
Encounter, and Dungeon!
Generate!

[Verse 2 - Second herald]
The Swagger UI — the authoritative reference!
Serves the Angular app's initial data on load!
Generate!
Validate!

[Bridge - Conspiratorial aside, quieter]
(CreatureGen has an API but no generator page on the site yet!)
(But five of the six are open — don't be late!)
Five of the six generators!
Roll, Treasure, Character,
Encounter, and Dungeon!

[Chorus - Grand full ensemble]
Generate! Generate!
At DnDGen.com!
An Angular single-page application!
Five of the six generators!
Roll, Treasure, Character,
Encounter, and Dungeon!
Generate!

[Outro - Building to triumphant finale]
Hear ye! Hear ye!
By command of the DM!
At DnDGen.com!
Generate!
```

## Sources

| Lyric | From the README |
|-------|-----------------|
| Hear ye! Hear ye! | Not from the README: traditional herald opening |
| The website through which people can use | "the website through which people can use" |
| The dice roller! | "the dice roller (RollGen)" |
| The equipment generator! | "the equipment generator (TreasureGen)" |
| The character generator! | "the character generator (CharacterGen)" |
| The creature generator! | "the creature generator (CreatureGen)" |
| The encounter generator! | "the encounter generator (EncounterGen)" |
| The dungeon generator! | "the dungeon generator (DungeonGen)" |
| All APIs run as Azure Function Apps! | "All APIs run as Azure Function Apps" |
| Generate! | "generate" (route suffix throughout the API tables) |
| Validate! | "validate" (route suffix throughout the API tables) |
| Generate! Generate! | "generate" (stylistic repetition) |
| At DnDGen.com! | "DnDGen.com" |
| An Angular single-page application! | "an Angular single-page application" |
| Five of the six generators! | "five of the six generators" |
| Roll, Treasure, Character,<br>Encounter, and Dungeon! | "Roll, Treasure, Character, Encounter, and Dungeon" |
| The Swagger UI — the authoritative reference! | "Swagger UI is the authoritative reference" |
| Serves the Angular app's initial data on load! | "Serves the Angular app's initial data on load" |
| By command of the DM! | Not from the README: D&D herald flavor |

## Suno Notes

- Open with a lone herald trumpet fanfare before the ensemble joins
- Each generator name in Verse 1 should be a separate staccato call, like a town crier barking
- The bridge should quiet significantly — almost conspiratorial — before the final chorus erupts
- End with a sustained, full brass chord

## Album Art

[![DnDGen.Web](cover.png)](https://suno.com/s/PLACEHOLDER)

**Listen on [Suno](https://suno.com/s/PLACEHOLDER).**
