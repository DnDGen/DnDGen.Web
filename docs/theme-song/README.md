# Generate! -DnDGen.Web Theme-

[![DnDGen.Web](cover.png)](https://suno.com/s/PLACEHOLDER)

The DnDGen.Web theme song: a cabaret opening number where the Emcee welcomes the audience into the world of DnDGen with brisk patter and a knowing smile.
Its lyrics come from the [DnDGen.Web README](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md), sung in plain English.

## Updating

This song draws from several source files in this repository:

- [`README.md`](https://github.com/DnDGen/DnDGen.Web/blob/main/README.md) — API documentation
- [`home.component.html`](https://github.com/DnDGen/DnDGen.Web/blob/main/dndgen-web/src/app/home/home.component.html) — the About page text
- [`rollgen.component.html`](https://github.com/DnDGen/DnDGen.Web/blob/main/dndgen-web/src/app/roll/components/rollgen.component.html) — dice expression examples

Every pull request that changes one of those files gets a song check:

1. If the change rewords or removes a phrase in the Sources table below, the song needs updating.
   The tests automatically catch changes to `README.md` phrases: they fail and list every quoted phrase no longer in the README.
   Changes to `home.component.html` or `rollgen.component.html` are not test-covered — check the Sources table manually.
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
Cabaret opening number in the style of Willkommen, a knowing theatrical Emcee welcoming the audience into the show, brisk and playful patter in the manner of Joel Grey, A small Kit Kat Club band: upright piano, accordion, clarinet, muted trumpet and trap drums — intimate and theatrical, A dry, controlled, charismatic Emcee, half-spoken and half-sung, every word shaped for the front row of a small cabaret club, A delighted crowd joining in with every chorus, their response growing warmer and more enthusiastic throughout, A hushed conspiratorial bridge where the Emcee leans in to share a secret, before the full band erupts for the finale, Wit in the phrasing, deadpan timing, the voice of a showman who has done this a thousand times, and a comic aside where the Emcee's train of thought derails mid-credit
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

[Pre-Chorus 1 - building, the Emcee turns to the crowd]
This website makes in SECONDS what would take hours.
ALL of the rules, every facet, every power.
Leaving you more time for adventuring and play.
So, dear Dungeon Master, what do you say?

[Anticipatory drum roll]

[Chorus 1 - crowd joins in, the show is on]
Generate!

A 20-sided die to see who's going first,
Some 13-sided dice, because physics are the worst.
Roll 4 8-sided dice, transform 2s into 3s.
Any roll you can imagine, if you please.

Generate!

Some Goods at level 7, or just Coin at level 3,
Or is it epic level 30 loot you want to see?
A Major suit of half-plate, Mundane sickle, or a Tool,
Or Rings or Rods or Wondrous Items - with all rules.

GENERATE!

[Verse 2 - faster patter, Emcee rattles the technical details]
All APIs are Azure Function Apps and serverless.
They're written in C-Sharp and compile with success.
They are documented with Swagger and grace,
Request, response, and even their parameter constraints.
A backend-for-the-frontend (BFF, you may deduce),
Providing useful view-models for this website to use.

[Pre-Chorus 2 - anticipation building, the DM is called]
But dice and gold are trifles - Random Number Deities
Can summon characters and encounters, if you please.
What level, class, and race? Temperature? Terrain?
Dungeon Master (DUNGEON MASTER!) - Sing us the refrain.

[Anticipatory music swell]

[Chorus 2 - crowd growing enthusiastic, chiming in with the asides]
Generate!

A character, High-level, alignment should be Good.
Fighter, Bard, Spellcaster, or Stealthy, if you would.
(But don't forget abilities, roll 4-d-6-k-3.)
(And oh, they need equipment - weapons, armor, instantly.)
Human, Elf, Non-Standard - even monsters, if you wish.
No meta-race? Or Lycanthrope? Or Undead like a Lich.

Generate!

A Temperate Plains encounter - at the break of Day.
Or Cold and Underground at Night - the monsters come to play.
(You've found a rival party - before initiative,)
(We roll up race and spells, and equipment we should give.)
Party level, creature types, aquatic, underground -
So many different options, variety astounds.

GENERATE! (GENERATE!)

[Bridge - conspiratorial; hushed]
... I'll share an open secret: there's creatures you could get.
The CreatureGen API could make a foe or pet,
But there isn't any page for it yet.

[Full ensemble erupts]

[Verse 3 - Emcee proudly presents the craftsmanship]
An Angular application is featured center-stage.
Components, models, services, and pipes build every page.
Automated tests abound, and coverage is complete.
Integration, Unit, Smoke - a comprehensive suite.
The build status badged in green: "I'm healthy!" it attests,
And even THIS SONG will be covered by some tests.

[Comic aside - the Emcee's credits derail, deadpan recovery]
But now, I must confess, I will give credit where it's due:
I do not own the content that I present to you.
TSR Incorporated is the owner true -
Nope. Wizards of the Coast is the owner, on review -
Woops. Hasbro bought the rights - screw that up, and they might sue -
Actually, Creative Commons means it's me and you.

[Pre-Chorus 3 - grand buildup, slow and deliberate, hushed reverence before the final reveal]
Roll, Treasure, Character, Encounter - what a boon.
(And creature generation will be coming very soon.)
But one more generator was forged to rule them all:
(DUN-GEON MAS-TER!) The Dungeon heeds your call.

[Final Chorus - Emcee poised, crowd's excitement building]
Generate!

An area - through a DOOR - at dungeon level 8.
(Encounter now looms, do the monsters spell doom?)
Within Cold Mountains, a HALL we shall create.
(A Ranger to fight, and a Druid with Blight.)
A party level 3 might meet a sneaky, stabby fate.
(The trap is quite grave, roll d-20 to save.)
Survive the Orcs or Oozes, and booty shall await.
(A treasure chest hides, precious Goods inside.)
The incremental dungeon can ever propagate.

Generate! Generate! Generate!

[Coda - building to finale]
And though it's getting quite late,
The players huddle and debate
If they should walk through the gate.
And the DM doesn't wait:
Maybe level escalates,
Challenge Rating is too great,
TPK's an awful fate -
But have no fear - just recreate.

[Finale - full ensemble fortissimo, the curtain call, everyone joins in]
Generate a set of dice. (Generate!)
Generate a treasure trove. (Generate!)
Generate a character. (Generate!)
Generate encounters. (Generate!)
Generate the dungeon. (Generate!)

Everyone will have a ball.
Click, and you create it all.

GENERATE!
```

## Sources

| Lyric | Source |
|---|---|
| Willkommen, adventurers. | Not from source files: Cabaret/Emcee welcome |
| Welcome to the codebase of D-N-D-Gen | Not from source files: Emcee's framing of the site |
| For Dungeons and Dragons third edition | `home.component.html`: Dungeons and Dragons 3.X |
| Starting a game could be a real bore | `home.component.html`: the start was always the most arduous part of the adventure |
| Rolling up characters and dungeons to explore | `home.component.html`: creating characters, building dungeons |
| random encounters could pay the highest toll | `home.component.html`: randomly generated a battle; opponent was another character party |
| "A character party? Nope, reroll." | `home.component.html`: A character party? Nope, reroll. |
| This website makes in SECONDS what would take hours | `home.component.html`: generate these things in seconds instead of hours |
| ALL of the rules, every facet, every power | `home.component.html`: ALL of the rules, every rich little facet |
| Leaving you more time for adventuring and play | `home.component.html`: leaving you more time to play |
| Generate! | `README.md`: "generate" (route suffix throughout the API tables) |
| Roll 4 8-sided dice, transform 2s into 3s | `rollgen.component.html`: expression example `4d8t2:3` |
| roll 4-d-6-k-3 | `rollgen.component.html`: expression example `4d6k3` |
| All APIs are Azure Function Apps and serverless / written in C-Sharp | `README.md`: "All APIs are written in C# and run as Azure Function Apps" |
| documented with Swagger and grace | `README.md`: "Swagger UI is the authoritative reference for request/response schemas, parameter constraints" |
| A backend-for-the-frontend (BFF) | `README.md`: "Web BFF" section |
| view-models for this website to use | `README.md`: RollViewModel through DungeonViewModel in "Web BFF" routes |
| A character, High-level, alignment should be Good | `README.md`: `alignmentRandomizerType`, `levelRandomizerType` in CharacterGen |
| Human, Elf, Non-Standard | `README.md`: `baseRaceRandomizerType` in CharacterGen |
| No meta-race? Or Lycanthrope? | `README.md`: `metaraceRandomizerType` in CharacterGen |
| A Temperate Plains encounter - at the break of Day | `README.md`: `temperature`, `environment`, `timeOfDay`, `level` in EncounterGen routes |
| Or Cold and Underground at Night | `README.md`: same EncounterGen parameters |
| Party level, creature types, aquatic, underground | `README.md`: `level`, `creatureTypeFilters`, `allowAquatic`, `allowUnderground` in EncounterGen |
| The CreatureGen API could make a foe or pet | `README.md`: "CreatureGen has an API but no generator page on the site yet" |
| An Angular application is featured center-stage | `README.md`: "an Angular single-page application" |
| Integration, Unit, Smoke - a comprehensive suite | `README.md`: "Unit", "Integration", "Smoke" in Testing section |
| TSR Incorporated... Wizards of the Coast... Hasbro | `home.component.html`: ownership/copyright attribution |
| Creative Commons means it's me and you | `home.component.html`: used under Creative Commons |
| Roll, Treasure, Character, Encounter | `README.md`: "Roll, Treasure, Character, Encounter, and Dungeon" |
| through a DOOR - at dungeon level 8 | `README.md`: "door" route in DungeonGen, `dungeonLevel` parameter |
| a HALL we shall create | `README.md`: "hall" route in DungeonGen |
| GENERATE! | `README.md`: "generate" (emphatic finale) |

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
