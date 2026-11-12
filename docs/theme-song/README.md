# Generate! -DnDGen.Web Theme-

[![DnDGen.Web](cover.png)](https://suno.com/s/UfzjIXCTb6RlZBt3)

The DnDGen.Web theme song: a cabaret opening number where the Emcee welcomes the audience into the world of DnDGen with brisk patter and a knowing smile.
Its lyrics come from the [DnDGen.Web README](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md), sung in plain English.

## Updating

This song draws from several source files in this repository:

- [`README.md`](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md) - API documentation
- [`dndgen-web/src/app/home/home.component.html`](https://github.com/DnDGen/DnDGen.Web/blob/main/dndgen-web/src/app/home/home.component.html) - the About page text
- [`dndgen-web/src/app/roll/components/rollgen.component.html`](https://github.com/DnDGen/DnDGen.Web/blob/main/dndgen-web/src/app/roll/components/rollgen.component.html) - dice expression examples

Every pull request that changes one of those files gets a song check:

1. If the change rewords or removes a phrase in the Sources table below, the song needs updating.
   The tests automatically catch changes to `README.md` phrases: they fail and list every quoted phrase no longer in the README.
   Changes to `dndgen-web/src/app/home/home.component.html` or `dndgen-web/src/app/roll/components/rollgen.component.html` are not test-covered - check the Sources table manually.
2. Otherwise, if the change alters the site's high-level ideas or vibe, the song needs updating.
3. Otherwise, it doesn't. Changes to the README's Theme Song badge or section never need a song update.

When the song needs updating, it happens in the same pull request:

1. The contributor updates the Lyrics and Sources here to match the changed files.
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
Generate! -DnDGen.Web Theme-
```

## Style

```
Cabaret opening number in the style of Willkommen, a knowing theatrical Emcee welcoming the audience into the show, brisk and playful patter in the manner of Joel Grey, A small Kit Kat Club band: upright piano, accordion, clarinet, muted trumpet and trap drums - intimate and theatrical, A dry, controlled, charismatic Emcee, half-spoken and half-sung, every word shaped for the front row of a small cabaret club, A delighted crowd joining in with every chorus, their response growing warmer and more enthusiastic throughout, A hushed conspiratorial bridge where the Emcee leans in to share a secret, before the full band erupts for the finale, Wit in the phrasing, deadpan timing, the voice of a showman who has done this a thousand times, and a comic aside where the Emcee's train of thought derails mid-credit
```

## Lyrics

```
[Intro - Kit Kat Club band strikes up, Emcee steps forward]
Willkommen, adventurers.

[Verse 1 - quick patter, half-spoken and deadpan]
Welcome to the codebase of D-N-D-Gen,
For Dungeons and Dragons third edition.
Starting a game could be a real bore:
Rolling up characters and dungeons to explore.
And random encounters could pay the highest toll:
"A character party? Nope, reroll."

[Pre-Chorus 1 - building]
This website makes in SECONDS what would take hours.
ALL of the rules, every facet, every power.
Leaving you more time for adventuring and play.
So, dear Dungeon Master, what do you say?

[Drum roll]

[Chorus 1 - crowd joins in]
Generate!

A 20-sided die to see who's going first,
Some 13-sided dice, because physics are the worst.
Roll 4 8-sided dice, transform 2s into 3s.
Any roll you can imagine, if you please.

Generate!

Some Goods at level 7, or just Coin at level 3,
Or is it epic level 30 loot you want to see?
Intelligent Armor, cursed Weapon would be droll,
A Wondrous Item, Minor ring, or Major scroll?

GENERATE!

[Verse 2 - faster patter, rattled off nonchalantly]
All APIs are Azure Function Apps and serverless.
They're written in C-Sharp and compile with success.
They are documented with Swagger and grace,
Request, response, and even their parameter constraints.
A backend-for-the-frontend (BFF, you may deduce),
Providing useful view-models for this website to use.

[Pre-Chorus 2 - anticipation building]
But dice and gold are trifles - Random Number Deities
Can summon creatures, characters, anything you please.
Player class and level? Template of Half-Dragon Black?
Dungeon Master (DUNGEON MASTER!) - Bring the chorus back.

[Music swell]

[Chorus 2 - crowd more enthusiastic, chiming in with the asides]
Generate!

A creature, Neutral Evil, at Challenge Rating 5,
An Aberration, maybe? Or Undead, not alive.
(Roll up the hit dice: 4-d-8-plus-24,)
(And maybe it already has some armor, shield, and sword.)
Chain a couple templates, if you need it to be tough.
Or "None" to keep it plain - Mariliths are hard enough.

Generate!

A character, High-level, alignment should be Good.
Fighter, Bard, Spellcaster, or Stealthy, if you would.
(But don't forget abilities, roll 4-d-6-k-3.)
(And oh, they need equipment - weapons, armor, instantly.)
Human, Elf, Non-Standard - even monsters, if you wish.
No meta-race? Or Lycanthrope? Or Undead like a Lich.

GENERATE! (GENERATE!)

[Bridge - conspiratorial; hushed]
... Sneak a peek backstage, there's tons to show:
The code is open-source, each file and workflow,
So if you want to know, there you go.

[Full ensemble erupts]

[Verse 3 - proud patter]
An Angular application is featured center-stage.
Components, models, services, and pipes build every page.
Automated tests abound, and coverage is complete.
Integration, Unit, Smoke - a comprehensive suite.
The build status badged in green: "I'm healthy!" it attests,
And even THIS SONG is covered like the rest.

[Comic aside - the Emcee gets derailed, deadpan recovery]
But now, I must confess, I will give credit where it's due:
I do not own the content that I present to you.
TSR Incorporated is the owner true -
Nope. Wizards of the Coast is the owner, on review -
Woops. Hasbro bought the rights - screw that up, and they might sue -
Actually, Creative Commons means it's me and you.

[Pre-Chorus 3 - grand buildup, slow and deliberate, hushed reverence]
Roll, Treasure, Creature, Character - a lot to do,
And then we make Encounters, and chaos will ensue.
But one more generator was forged to rule them all:
(DUN-GEON MAS-TER!) The Dungeon heeds your call.

[Final Chorus - Emcee poised, crowd in full voice]
Generate!

A Temperate Plains encounter - at the break of Day.
Or Cold and Underground at Night - the monsters come to play.
(You've found a rival party - before initiative,)
(We roll up race and spells, and equipment we should give.)
Party level, creature types, aquatic, underground -
So many different options, variety astounds.

Generate!

An area - through a DOOR - at dungeon level 8.
Within Cold Mountains, a HALL we shall create.
(The room ahead has a chest with Goods inside,)
(But it's trapped - roll d-20 to save or hide.)
A party level 3 might meet a sneaky, stabby fate.
Survive the Orcs or Oozes, and treasure shall await.

The incremental dungeon can ever propagate.

Generate! Generate! Generate!

[Coda - building]
And though it's getting quite late,
The players huddle and debate
If they should walk through the gate.
And the DM doesn't wait:
Maybe level escalates,
Challenge Rating is too great,
TPK's an awful fate -
But have no fear - just recreate.

[Finale - full ensemble fortissimo, everyone joins in]
(Generate!) A set of dice.
(Generate!) A treasure trove.
(Generate!) A creature.
(Generate!) A character.
(Generate!) Encounters.
(Generate!) The dungeon.

Everyone will have a ball.
Click, and you create it all.

GENERATE!
```

## Sources

| # | Lyric | Sources |
|---|---|---|
| 1 | Willkommen, adventurers. | Not from source files: Willkommen is the opening number from Cabaret |
| 2 | Welcome to the codebase of D-N-D-Gen, | `README.md`: [DnDGen.com](http://dndgen.com) |
| 3 | For Dungeons and Dragons third edition. | `dndgen-web/src/app/home/home.component.html`: Dungeons and Dragons 3.X |
| 4 | Starting a game could be a real bore: | `dndgen-web/src/app/home/home.component.html`: the start was always the most arduous part of the adventure |
| 5 | Rolling up characters and dungeons to explore. | `dndgen-web/src/app/home/home.component.html`: creating characters, building dungeons |
| 6 | And random encounters could pay the highest toll: | `dndgen-web/src/app/home/home.component.html`: if you randomly generated a battle, and the opponent was another character party |
| 7 | "A character party? Nope, reroll." | `dndgen-web/src/app/home/home.component.html`: A character party? Nope, reroll. |
| 8 | This website makes in SECONDS what would take hours. | `dndgen-web/src/app/home/home.component.html`: generate these things in seconds instead of hours |
| 9 | ALL of the rules, every facet, every power. | `dndgen-web/src/app/home/home.component.html`: ALL of the rules, every rich little facet |
| 10 | Leaving you more time for adventuring and play. | `dndgen-web/src/app/home/home.component.html`: leaving you more time to play |
| 11 | So, dear Dungeon Master, what do you say? | Not from source files |
| 12 | Generate! | `README.md`: /generate |
| 13 | A 20-sided die to see who's going first, | `dndgen-web/src/app/roll/components/rollgen.component.ts`: new StandardDie('20', 20) |
| 14 | Some 13-sided dice, because physics are the worst. | `dndgen-web/src/app/roll/components/rollgen.component.html`: 5d13-4 - Roll 5 13-sided dice, then subtract 4 |
| 15 | Roll 4 8-sided dice, transform 2s into 3s. | `dndgen-web/src/app/roll/components/rollgen.component.html`: 4d8t2:3 - Roll 4 8-sided dice, transform 2s into 3s |
| 16 | Any roll you can imagine, if you please. | `README.md`: The expression endpoints accept any dice expression |
| 17 | Some Goods at level 7, or just Coin at level 3, | `DnDGen.Api.Web/Models/Treasures/TreasureTypes.cs`: public enum TreasureTypes { Treasure, Coin, Goods, Items, }<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: MaxTreasureLevel = 100 |
| 18 | Or is it epic level 30 loot you want to see? | `DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: MaxTreasureLevel = 100 |
| 19 | Intelligent Armor, cursed Weapon would be droll, | `dndgen-web/src/app/treasure/models/magic.model.ts`: public intelligence: Intelligence<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: new ItemTypeViewModel { ItemType = ItemTypes.Armor.ToString(), DisplayName = ItemTypeConstants.Armor },<br>`dndgen-web/src/app/treasure/models/magic.model.ts`: public curse: string<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: new ItemTypeViewModel { ItemType = ItemTypes.Weapon.ToString(), DisplayName = ItemTypeConstants.Weapon }, |
| 20 | A Wondrous Item, Minor ring, or Major scroll? | `DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: new ItemTypeViewModel { ItemType = ItemTypes.WondrousItem.ToString(), DisplayName = ItemTypeConstants.WondrousItem },<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: Powers = [ PowerConstants.Mundane, PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major ];<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: new ItemTypeViewModel { ItemType = ItemTypes.Ring.ToString(), DisplayName = ItemTypeConstants.Ring },<br>`DnDGen.Api.Web/Models/Treasures/TreasureViewModel.cs`: new ItemTypeViewModel { ItemType = ItemTypes.Scroll.ToString(), DisplayName = ItemTypeConstants.Scroll },  |
| 21 | GENERATE! | `README.md`: /generate |
| 22 | All APIs are Azure Function Apps and serverless.<br>They're written in C-Sharp and compile with success. | `README.md`: All APIs are written in C# and run as Azure Function Apps |
| 23 | They are documented with Swagger and grace,<br>Request, response, and even their parameter constraints. | `README.md`: Swagger UI is the authoritative reference for request/response schemas, parameter constraints |
| 24 | A backend-for-the-frontend (BFF, you may deduce), | `README.md`: Web BFF |
| 25 | Providing useful view-models for this website to use. | `README.md`: Serves the Angular app's initial view models. |
| 26 | But dice and gold are trifles - Random Number Deities | Not from source files: Pun on Random Number Gods, or Random Number Generators, or RNGs |
| 27 | Can summon creatures, characters, anything you please. | `README.md`: v1/creature/{creatureName}/generate<br>`README.md`: /character/generate |
| 28 | Player class and level? Template of Half-Dragon Black? | `README.md`: `classNameRandomizerType`, `levelRandomizerType`<br>`README.md`: `templates` (string[], query, optional) |
| 29 | Dungeon Master (DUNGEON MASTER!) - Bring the chorus back. | Not from source files |
| 30 | A creature, Neutral Evil, at Challenge Rating 5, | `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: setSelect('#randomAlignment', 'Neutral Evil');<br>`dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: setSelect('#randomChallengeRating', '5'); |
| 31 | An Aberration, maybe? Or Undead, not alive. | `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: setSelect('#randomCreatureType', 'Aberration');<br>`dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: toContain('Undead') |
| 32 | (Roll up the hit dice: 4-d-8-plus-24,) | `dndgen-web/src/app/roll/components/rollgen.component.html`: 4d8+24 - Roll 4 8-sided dice, then add 24 |
| 33 | (And maybe it already has some armor, shield, and sword.) | `dndgen-web/src/app/creature/models/creature-equipment.model.ts`: public armor: Armor<br>`dndgen-web/src/app/creature/models/creature-equipment.model.ts`: public shield: Armor<br>`dndgen-web/src/app/creature/models/creature-equipment.model.ts`: public weapons: Weapon[] = [] |
| 34 | Chain a couple templates, if you need it to be tough. | `README.md`: `templates` (string[], query, optional) |
| 35 | Or "None" to keep it plain - Mariliths are hard enough. | `dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: setTemplates('#randomTemplates', ['None']);<br>`dndgen-web/src/app/creature/components/creaturegen.component.integration.spec.ts`: toContain('Marilith') |
| 36 | A character, High-level, alignment should be Good. | `DnDGen.Api.Web/Models/CharacterViewModel.cs`: LevelRandomizerTypeConstants.High,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: AlignmentRandomizerTypeConstants.Good |
| 37 | Fighter, Bard, Spellcaster, or Stealthy, if you would. | `DnDGen.Api.Web/Models/CharacterViewModel.cs`: CharacterClassConstants.Fighter,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: CharacterClassConstants.Bard,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: ClassNameRandomizerTypeConstants.Spellcaster,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: ClassNameRandomizerTypeConstants.Stealth, |
| 38 | (But don't forget abilities, roll 4-d-6-k-3.) | `dndgen-web/src/app/roll/components/rollgen.component.html`: 4d6k3 - Roll 4 6-sided dice, keep the highest 3 |
| 39 | (And oh, they need equipment - weapons, armor, instantly.) | `dndgen-web/src/app/character/models/equipment.model.ts`: public primaryHand: Weapon | null = null<br>`dndgen-web/src/app/character/models/equipment.model.ts`: public armor: Armor | null = null |
| 40 | Human, Elf, Non-Standard - even monsters, if you wish. | `DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceConstants.BaseRaces.Human,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceConstants.BaseRaces.HighElf,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceRandomizerTypeConstants.BaseRace.NonStandardBase,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceRandomizerTypeConstants.BaseRace.MonsterBase, |
| 41 | No meta-race? Or Lycanthrope? Or Undead like a Lich. | `DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceRandomizerTypeConstants.Metarace.NoMeta,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceRandomizerTypeConstants.Metarace.UndeadMeta,<br>`DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceConstants.Metaraces.Lich, |
| 42 | GENERATE! (GENERATE!) | `README.md`: /generate |
| 43 | ... Sneak a peek backstage, there's tons to show: | `dndgen-web/src/app/navigation-menu/navigation-menu.component.html`: href="https://github.com/DnDGen" |
| 44 | The code is open-source, each file and workflow, | `LICENSE.md`: Permission is hereby granted, free of charge |
| 45 | So if you want to know, there you go. | Not from source files |
| 46 | An Angular application is featured center-stage. | `README.md`: an Angular single-page application |
| 47 | Components, models, services, and pipes build every page. | `dndgen-web/src/app/treasure/components/treasuregen.component.ts`: import { TreasureComponent } from './treasure.component';<br>`dndgen-web/src/app/treasure/components/treasuregen.component.ts`: import { TreasureGenViewModel } from '../models/treasuregen-view-model.model';<br>`dndgen-web/src/app/treasure/components/treasuregen.component.ts`: import { TreasureService } from '../services/treasure.service';<br>`dndgen-web/src/app/treasure/components/treasuregen.component.ts`: import { TreasurePipe } from '../pipes/treasure.pipe'; |
| 48 | Automated tests abound, and coverage is complete. | `README.md`: Tests run across three layers |
| 49 | Integration, Unit, Smoke - a comprehensive suite. | `README.md`: **Integration** — end-to-end tests against the live deployed endpoints<br>`README.md`: **Unit** — fast, isolated tests<br>`README.md`: **Smoke** — Postman collections run with Newman after each deployment |
| 50 | The build status badged in green: "I'm healthy!" it attests, | `README.md`: [![Build Status](https://dev.azure.com/dndgen/DnDGen/_apis/build/status%2FDnDGen.Web%20-%20Build?branchName=main)](https://dev.azure.com/dndgen/DnDGen/_build/latest?definitionId=7&branchName=main) |
| 51 | And even THIS SONG is covered like the rest. | `DnDGen.Web.Tests.Integration/Docs/ThemeSong/ThemeSongReadmeTests.cs`: SunoField_FitsSunoLimit |
| 52 | But now, I must confess, I will give credit where it's due:<br>I do not own the content that I present to you. | `dndgen-web/src/app/home/home.component.html`: Credit where credit is due: none of the generated things you see here belong to me |
| 53 | TSR Incorporated is the owner true - | `dndgen-web/src/app/home/home.component.html`: <s>TSR, Inc.</s> |
| 54 | Nope. Wizards of the Coast is the owner, on review - | `dndgen-web/src/app/home/home.component.html`: <s>Wizards of the Coast</s> |
| 55 | Woops. Hasbro bought the rights - screw that up, and they might sue - | `dndgen-web/src/app/home/home.component.html`: <b>Hasbro</b> |
| 56 | Actually, Creative Commons means it's me and you. | `dndgen-web/src/app/home/home.component.html`: used under Creative Commons |
| 57 | Roll, Treasure, Creature, Character - a lot to do, | `README.md`: Roll, Treasure, Creature, Character, |
| 58 | And then we make Encounters, and chaos will ensue. | `dndgen-web/src/app/encounter/models/encounter.model.ts`: public creatures: EncounterCreature[] = [],<br>`dndgen-web/src/app/encounter/models/encounter.model.ts`: public characters: Character[] = [], |
| 59 | But one more generator was forged to rule them all: | Not from source files: Allusion to Tolkien's "The Lord of the Rings" |
| 60 | (DUN-GEON MAS-TER!) The Dungeon heeds your call. | `README.md`: Roll, Treasure, Creature, Character, Encounter, and Dungeon |
| 61 | A Temperate Plains encounter - at the break of Day. | `DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Temperatures.Temperate,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Plains,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.TimesOfDay.Day, |
| 62 | Or Cold and Underground at Night - the monsters come to play. | `DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Temperatures.Cold,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Underground,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.TimesOfDay.Night, |
| 63 | (You've found a rival party - before initiative,) | `dndgen-web/src/app/home/home.component.html`: if you randomly generated a battle, and the opponent was another character party |
| 64 | (We roll up race and spells, and equipment we should give.) | `dndgen-web/src/app/character/models/character.model.ts`: public race: Race = new Race(''),<br>`dndgen-web/src/app/character/models/magic.model.ts`: public knownSpells: Spell[]<br>`dndgen-web/src/app/character/models/equipment.model.ts`: export class Equipment |
| 65 | Party level, creature types, aquatic, underground - | `README.md`: /level/{level}/<br>`README.md`: `creatureTypeFilters` (string[], query, optional)<br>`README.md`: `allowAquatic`, `allowUnderground` (bool, query, optional) |
| 66 | So many different options, variety astounds. | Not from source files |
| 67 | An area - through a DOOR - at dungeon level 8. | `README.md`: /dungeon/level/{dungeonLevel}/door/{temperature}/{environment}/{timeOfDay}/level/{partyLevel}/generate |
| 68 | Within Cold Mountains, a HALL we shall create. | `DnDGen.Api.Web/Models/DungeonViewModel.cs`: public class DungeonViewModel : EncounterViewModel<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Temperatures.Cold,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: EnvironmentConstants.Mountain,<br>`README.md`: /dungeon/level/{dungeonLevel}/hall/{temperature}/{environment}/{timeOfDay}/level/{partyLevel}/generate |
| 69 | (The room ahead has a chest with Goods inside,) | `dndgen-web/src/app/dungeon/models/dungeon-treasure.model.ts`: public container: string = ''<br>`dndgen-web/src/app/dungeon/models/dungeon-treasure.model.ts`: public concealment: string = ''<br>`DnDGen.Api.Web/Models/Treasures/TreasureTypes.cs`: public enum TreasureTypes { Treasure, Coin, Goods, Items, } |
| 70 | (But it's trapped - roll d-20 to save or hide.) | `dndgen-web/src/app/dungeon/models/contents.model.ts`: public traps: Trap[] = []<br>`dndgen-web/src/app/roll/components/rollgen.component.ts`: new StandardDie('20', 20) |
| 71 | A party level 3 might meet a sneaky, stabby fate. | `README.md`: /level/{partyLevel} |
| 72 | Survive the Orcs or Oozes, and treasure shall await. | `DnDGen.Api.Web/Models/CharacterViewModel.cs`: RaceConstants.BaseRaces.Orc,<br>`DnDGen.Api.Web/Models/EncounterViewModel.cs`: CreatureDataConstants.Types.Ooze, |
| 73 | The incremental dungeon can ever propagate. | `README.md`: This will incrementally generate a dungeon |
| 74 | Generate! Generate! Generate! | `README.md`: /generate |
| 75 | And though it's getting quite late,<br>The players huddle and debate<br>If they should walk through the gate.<br>And the DM doesn't wait: | Not from source files: Description of gameplay |
| 76 | Maybe level escalates, | `README.md`: /level/{level} |
| 77 | Challenge Rating is too great, | `dndgen-web/src/app/encounter/models/encounter-creature.model.ts`: public challengeRating: string |
| 78 | TPK's an awful fate - | Not from source files: TPK (Total Party Kill) is D&D terminology |
| 79 | But have no fear - just recreate. | Not from source files |
| 80 | (Generate!) A set of dice. | `README.md`: RollGen |
| 81 | (Generate!) A treasure trove. | `README.md`: TreasureGen |
| 82 | (Generate!) A creature. | `README.md`: CreatureGen |
| 83 | (Generate!) A character. | `README.md`: CharacterGen |
| 84 | (Generate!) Encounters. | `README.md`: EncounterGen |
| 85 | (Generate!) The dungeon. | `README.md`: DungeonGen |
| 86 | Everyone will have a ball.<br>Click, and you create it all. | Not from source files |

## Suno Notes

Lessons from generating this song, for the next update:

**Use positive descriptors - negative prompting is unreliable.**
Phrases like "never belting" or "never symphonic" in the Style prompt can create gravity wells that pull the generation toward exactly what you wanted to avoid (musical theatre, full orchestra).
Describe what you *do* want instead: "every word shaped for the front row of a small cabaret club" achieves vocal restraint without the word "never".

**The Cabaret / Willkommen / Joel Grey archetype solved everything.**
Previous styles (royal herald, medieval fanfare, Big Band swing) all struggled with the Rogante Marendor orchestral gravity well.
The Kit Kat Club band instrumentation (upright piano, accordion, clarinet, muted trumpet, trap drums) is instrumentally specific enough that Suno doesn't reach for the orchestral library.
As a bonus: the clarinet picked up the Rogante Marendor cinematic theme and played it beautifully.

**"Half-spoken and half-sung" is clearer than any technical term.**
"Sprechstimme" and "parlando" are plausible but carry connotations Suno may not handle well (Sprechstimme suggests Schoenberg/Berg; parlando is vaguer).
"Half-spoken and half-sung, every word shaped for the front row of a small cabaret club" gives Suno both the technique and the room.

**Dual enforcement: match the Style and the lyric tag for critical moments.**
The bridge has *always* nailed its tone across every generation because "conspiratorial; hushed" appears in both the Style and the `[Bridge - conspiratorial; hushed]` tag.
Apply the same rule wherever tone consistency matters: the Comic aside uses "comic aside" in both the Style and its tag; the half-spoken delivery is reinforced by the section tag.

**The cinematic outro was completely accidental - keep it.**
The winning take ended with the full Rogante Marendor cinematic theme as a closing flourish after the final GENERATE.
This is serendipitous Suno magic. When regenerating, it may not reappear - that's fine.
When it does: it's the take.

**Pick the second take.**
On both significant generation runs, the second take was the winner.
No actionable lesson - just a fun fact for the next maintainer.

## Album Art

**Listen on [Suno](https://suno.com/s/UfzjIXCTb6RlZBt3).**

`cover.png` will be rendered from `cover.html`, which you can open in any browser.
To render it again at 1500 x 1500, from this folder:

```
msedge --headless --hide-scrollbars --allow-file-access-from-files --window-size=1500,1500 --screenshot=cover.png cover.html
```

If Edge reads `cover.html` as a web address, pass it as a full `file:///` URL instead.
