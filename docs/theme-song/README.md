# By Command of the DM, Generate! -DnDGen.Web Theme-

[![DnDGen.Web](cover.png)](https://suno.com/s/PLACEHOLDER)

The DnDGen.Web theme song: a royal herald fanfare, where each generator is proclaimed to the kingdom in increasingly absurd detail.
Its lyrics come from the [DnDGen.Web README](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md), sung in plain English.

## Updating

This song follows the [DnDGen.Web README](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md).
Every pull request that changes the README gets a song check:

1. If the change rewords or removes a phrase in the Sources table below, the song needs updating.
   The tests catch this one: they fail and list every quoted phrase that is no longer in the README.
2. Otherwise, if the change alters the README's high-level ideas or vibe, the song needs updating.
3. Otherwise, it doesn't. Changes to the README's Theme Song badge or section never need a song update.

When the song needs updating, it happens in the same pull request:

1. The contributor updates the Lyrics and Sources here to match the new README.
   Names are sung as words, never as code.
2. The maintainer makes the new song in Suno:
   - **Cover the current song**, so the theme stays recognizably the same song as it evolves.
   - Use the Title, Style, and Lyrics from this page. **Leave the Style as it is**: only the lyrics change.
   - **Turn Variety all the way down**, so Suno keeps to the Style instead of straying from it.
   - Pick the take. The new take replaces the old one.
   - **Publish it**, so anyone with the link can find and hear it.
3. The maintainer updates the Suno link here and in the README, and adds anything learned to the Suno Notes.

## Title

```
By Command of the DM, Generate! -DnDGen.Web Theme-
```

## Style

```
Royal court herald fanfare singalong, bright uptempo march in 4/4, Solo herald trumpet calling out proclamations over pizzicato strings and a crisp military side-drum, answered by a massed brass ensemble of muted trumpets, trombones and French horns, Bright woodwinds doubling the brass into the choruses, Staccato, crisply enunciated delivery from a solo tenor herald who sounds like he is formally reading from a royal proclamation scroll, A crowd of courtiers echoing every line back with growing delight, building call-and-response throughout, The choruses grow longer and more absurdly specific with each pass, A conspiratorial bridge that drops to near-silence — just the herald and a quiet string pizzicato — before the full brass ensemble erupts louder than ever for the final chorus, Triumphant and playfully pompous, the comedy coming from great ceremony applied to increasingly technical parameter lists, Clear, regal, and deadly serious about generating everything by command of the DM
```

## Lyrics

```
[Intro - Solo herald trumpet fanfare, brass and strings enter on the downbeat]
Hear ye! Hear ye!

[Verse 1 - First herald, rapid and breathless, one staccato brass punch per generator]
The website through which people can use
The dice roller!
The equipment generator!
The character generator!
The encounter generator!
The dungeon generator!

[Pre-Chorus 1 - building]
All APIs run as Azure Function Apps!
The Swagger UI — the authoritative reference!
Generate!
Validate!

[Chorus 1 - full ensemble enters, bright and triumphant]
By command of the DM — generate!
Roll the dice!
(Roll the dice!)
Generate!
By command of the DM — generate!
An Angular single-page application!
At DnDGen.com!
Generate!

[Verse 2 - Second herald, rapid patter, the Web BFF]
Serves the Angular app's initial data on load —
The roll viewmodel! The treasure viewmodel!
The character viewmodel! The encounter viewmodel!
The dungeon viewmodel!
All ready before you even ask!

[Verse 3 - Third herald, rapid patter, the six character randomizers]
Character generation accepts six randomizer type params —
(Six!)
The alignment randomizer type!
The class name randomizer type!
The level randomizer type!
The base race randomizer type!
The metarace randomizer type!
The abilities randomizer type!
Plus the set values for each!
(Set them all!)

[Pre-Chorus 2]
Five of the six generators!
Roll, Treasure, Character,
Encounter, and Dungeon!
At DnDGen.com!

[Chorus 2 - fuller, adds the first few parameters]
By command of the DM — generate!
Roll four-d-six!
(Roll four-d-six!)
Generate Goods, level five!
Generate a character — alignment, class, level!
Generate!
By command of the DM — generate!
An Angular single-page application!
At DnDGen.com!
Generate!

[Bridge - conspiratorial, near-silence, just herald and pizzicato]
(Each one builds upon the one before it!)
(CreatureGen has an API but no generator page on the site yet!)
(Five of the six on the site — all six through the APIs!)
Six by Azure Function Apps!
Generate!
Validate!

[Final Chorus - full ensemble, absurdly extended proclamation, building to the end]
By command of the DM — generate!
Roll the quantity on the die!
Validate the expression!
Generate the treasure type at level five!
Generate the item type by power!
Generate the creature — alignment, templates, type, challenge rating!
Generate the character —
Alignment randomizer! Class name randomizer! Level randomizer!
Base race randomizer! Metarace randomizer! Abilities randomizer!
Generate the encounter —
Temperature! Environment! Time of day!
Level! Allow underground!
Generate the dungeon through the door —
Dungeon level! Party level!
Temperature! Environment! Time of day!
Generate!
(Generate!)
Generate!
(Generate!)
GENERATE!

[Outro - brass pulls back to a solo trumpet]
Hear ye! Hear ye!
By command of the DM!
At DnDGen.com!
Generate!
```

## Sources

| Lyric | From the README |
|---|---|
| Hear ye! Hear ye! | Not from the README: traditional herald opening |
| The website through which people can use | "the website through which people can use" |
| The dice roller! | "the dice roller (RollGen)" |
| The equipment generator! | "the equipment generator (TreasureGen)" |
| The character generator! | "the character generator (CharacterGen)" |
| The encounter generator! | "the encounter generator (EncounterGen)" |
| The dungeon generator! | "the dungeon generator (DungeonGen)" |
| All APIs run as Azure Function Apps! | "All APIs run as Azure Function Apps" |
| The Swagger UI — the authoritative reference! | "Swagger UI is the authoritative reference" |
| Generate! | "generate" (route suffix throughout the API tables) |
| Validate! | "validate" (route suffix throughout the API tables) |
| By command of the DM — generate! | Not from the README: D&D herald framing |
| Roll the dice! | Not from the README: action implied by the RollGen routes |
| An Angular single-page application! | "an Angular single-page application" |
| At DnDGen.com! | "DnDGen.com" |
| Serves the Angular app's initial data on load — | "Serves the Angular app's initial data on load" |
| The roll viewmodel! The treasure viewmodel!<br>The character viewmodel! The encounter viewmodel!<br>The dungeon viewmodel! | "RollViewModel", "TreasureViewModel", "CharacterViewModel", "EncounterViewModel", "DungeonViewModel" from the Web BFF routes |
| All ready before you even ask! | Not from the README: herald flavor |
| Character generation accepts six randomizer type params — | "Character generation accepts six randomizer type params" |
| The alignment randomizer type!<br>The class name randomizer type!<br>The level randomizer type!<br>The base race randomizer type!<br>The metarace randomizer type!<br>The abilities randomizer type! | "alignmentRandomizerType", "classNameRandomizerType", "levelRandomizerType", "baseRaceRandomizerType", "metaraceRandomizerType", "abilitiesRandomizerType" |
| Plus the set values for each! | "corresponding `set*` values for each" |
| Five of the six generators! | "five of the six generators" |
| Roll, Treasure, Character,<br>Encounter, and Dungeon! | "Roll, Treasure, Character, Encounter, and Dungeon" |
| Roll four-d-six! | Not from the README: example values for "quantity" and "die" parameters |
| Generate Goods, level five! | Not from the README: example values for "treasureType" and "level" parameters |
| Generate a character — alignment, class, level! | Not from the README: example using "alignmentRandomizerType", "classNameRandomizerType", "levelRandomizerType" |
| Six by Azure Function Apps! | "All APIs run as Azure Function Apps" (six APIs) |
| Roll the quantity on the die! | "quantity" and "die" from the RollGen route parameters |
| Validate the expression! | "validate" and "expression" from the RollGen routes |
| Generate the treasure type at level five! | "treasureType" and "level" from the TreasureGen route parameters |
| Generate the item type by power! | "itemType" and "power" from the TreasureGen route parameters |
| Generate the creature — alignment, templates, type, challenge rating! | "alignment", "templates", "type", "cr" from the CreatureGen route parameters |
| Generate the character — | "alignmentRandomizerType" and the other randomizer params from CharacterGen |
| Alignment randomizer! Class name randomizer! Level randomizer!<br>Base race randomizer! Metarace randomizer! Abilities randomizer! | "alignmentRandomizerType", "classNameRandomizerType", "levelRandomizerType", "baseRaceRandomizerType", "metaraceRandomizerType", "abilitiesRandomizerType" |
| Generate the encounter — | "temperature", "environment", "timeOfDay", "level" from EncounterGen route parameters |
| Temperature! Environment! Time of day! | "temperature", "environment", "timeOfDay" from the EncounterGen and DungeonGen route parameters |
| Level! Allow underground! | "level" and "allowUnderground" from the EncounterGen route parameters |
| Generate the dungeon through the door — | "door" route in DungeonGen |
| Dungeon level! Party level! | "dungeonLevel" and "partyLevel" from the DungeonGen route parameters |
| GENERATE! | "generate" (emphatic finale) |
| By command of the DM! | Not from the README: D&D herald flavor |

## Suno Notes

Lessons from generating this song, for the next update:

_(To be filled in after the first generation.)_

## Album Art

**Listen on [Suno](https://suno.com/s/PLACEHOLDER).**

`cover.png` will be rendered from `cover.html`, which you can open in any browser.
To render it again at 1500 × 1500, from this folder:

```
msedge --headless --hide-scrollbars --allow-file-access-from-files --window-size=1500,1500 --screenshot=cover.png cover.html
```

If Edge reads `cover.html` as a web address, pass it as a full `file:///` URL instead.
