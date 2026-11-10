# Feature Specification: CreatureGen Page

**Feature Branch**: `001-creaturegen-ui`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Add the UI for the CreatureGen page (GitHub issue DnDGen/DnDGen.Web#1963): placed between TreasureGen and CharacterGen in the navigation bar; two tabs (set creature, random creature) matching existing generator tabs; set tab has a searchable creature dropdown and optional, ordered, multiple templates; random tab has optional templates (multiple), CR, alignment, and creature type filters; validation after every input change; options come from the Web API view model; output displays the full creature with a download option like CharacterGen; follow existing architecture, testing, code style, and UX patterns; add CreatureGen API and GitHub links; add CreatureGen website smoke tests to the deploy process like CharacterGen; fill in any gaps."

## Research Findings (answers to questions in the request)

These were checked against the code in this repository and the live services on 2026-11-10, and shape the requirements below.

- **View model already exists and is live.** The Web API already serves the CreatureGen view model (`v1/creature/viewmodel`), returning 659 creatures, 44 templates, 9 alignments, 42 creature types and subtypes, and 34 challenge ratings. Building and publishing it is **not** a prerequisite; the website work can start now.
- **Multiple templates are supported, in order.** Both set and random generation (and their validation) accept any number of templates, applied in the order given.
- **Random filters are single-valued in practice.** The API documentation describes creature type and challenge rating as lists, but the service only honours one value of each; alignment is likewise one value. The random tab therefore offers one choice (or none) per filter.
- **Alignment is optional for random generation**, even though the API documentation marks it as required: validating a random creature with no filters returns valid.
- **"None" is a real, selectable template.** It matters most for random creatures:
  - An empty template list means "any": the random creature may or may not come out templated.
  - Choosing "None" forces a creature with no template.
  - "None" can also be chained, for example [None, None] or [None, Ghost], which the API validates as valid.
- **Repeats are decided by the API, not the page.** Human + [None, None] validates as valid; Human + [Ghost, Ghost] validates as invalid. So the page lets any template be added any number of times and shows the API's answer.
- **Set generation takes only a creature and templates.** No other set-creature parameters are exposed by the API. The underlying generator also supports generating a creature "as a character"; the standalone API intentionally always turns it off, because that flag is for CharacterGen's future use of CreatureGen (FR-030).
- **Order matters to validity.** For example, Human + Ghost validates as valid, while Human + Ghost + Lich validates as invalid.
- **Gaps found elsewhere**: the Web API smoke tests have no CreatureGen view model check; the website smoke tests have no CreatureGen page check; the deploy step for CreatureGen runs no website tests (CharacterGen's does); the root README states CreatureGen has no page on the site yet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a specific creature (Priority: P1)

A Dungeon Master needs the full stats of a specific creature (e.g., a Hill Giant) for tonight's session. They open CreatureGen from the navigation bar, search the creature list by typing part of the name, pick it, and generate. The full creature is displayed.

**Why this priority**: This is the core value of the page and the smallest slice that is useful on its own.

**Independent Test**: Open the page, choose a creature in the Set tab with no templates, generate, and confirm the displayed creature matches the chosen name.

**Acceptance Scenarios**:

1. **Given** the CreatureGen page has loaded, **When** the user types "giant" into the creature selector, **Then** only creatures whose names contain "giant" (case-insensitive) are listed.
2. **Given** a valid creature is selected and no templates, **When** the user generates, **Then** a creature with that name is displayed.
3. **Given** the page is open, **When** the user changes the selected creature, **Then** the combination is re-validated and the generate action is enabled only if it is valid.
4. **Given** the page first loads, **Then** the Set tab is shown with a default creature selected and the combination already validated.

---

### User Story 2 - Apply templates in a specific order (Priority: P1)

The Dungeon Master wants a Ghost Human, or a Lich that later became a Vampire. They add one or more templates to the chosen creature, in a deliberate order, see whether the combination is valid, and generate.

**Why this priority**: Templates are a defining feature of CreatureGen, and the user stressed that their order changes the result and its validity.

**Independent Test**: Choose Human, add Ghost, confirm valid and generate a Ghost Human; then add Lich after Ghost and confirm invalid.

**Acceptance Scenarios**:

1. **Given** a creature is selected, **When** the user adds a template from a searchable template selector, **Then** it is appended to the end of the ordered template list and the combination is re-validated.
2. **Given** two or more templates are listed, **When** the user moves a template up or down, **Then** the displayed order changes, the new order is what is validated, and the new order is what is generated.
3. **Given** templates are listed, **When** the user removes one, **Then** the remaining templates keep their relative order and the combination is re-validated.
4. **Given** a template is already in the list, **When** the user adds it again, **Then** it is appended and the combination is re-validated (Human + [Ghost, Ghost] is shown as invalid; Human + [None, None] as valid).
5. **Given** Human with templates [Ghost, Lich], **When** validation completes, **Then** the page shows the combination as invalid and generation is not possible.
6. **Given** a creature with templates [A, B] is generated, **Then** the displayed creature shows its templates in that same order.

---

### User Story 3 - Generate a random creature with filters (Priority: P2)

The Dungeon Master wants "any CR 5 undead, neutral evil" for a random encounter. They switch to the Random tab, optionally choose a challenge rating, alignment, creature type, and templates, see whether a creature can satisfy those filters, and generate one.

**Why this priority**: Valuable and requested, but the page is already useful without it.

**Independent Test**: In the Random tab with no filters, generate and confirm a creature is shown; then pick filters and confirm the generated creature honours each one.

**Acceptance Scenarios**:

1. **Given** the Random tab with no filters chosen, **When** the user generates, **Then** a creature is displayed.
2. **Given** the user chooses a challenge rating, **When** they generate, **Then** the displayed creature has that challenge rating.
3. **Given** the user chooses an alignment, **When** they generate, **Then** the displayed creature has that alignment.
4. **Given** the user chooses a creature type or subtype, **When** they generate, **Then** the displayed creature has that type or subtype.
5. **Given** the user adds templates (ordered, as in User Story 2), **When** they generate, **Then** the displayed creature has those templates in that order.
6. **Given** any filter or template changes, **Then** the combination is re-validated; an impossible combination (e.g., Fiendish Creature with a good alignment) is shown as invalid and cannot be generated.
7. **Given** a filter was chosen, **When** the user clears it back to "Any", **Then** that filter is no longer applied.
8. **Given** the template list is empty, **When** the user generates, **Then** the creature may or may not have templates ("any").
9. **Given** the template list is [None], **When** the user generates, **Then** the displayed creature has no templates.

---

### User Story 4 - Read and download the creature (Priority: P2)

Having generated a creature, the Dungeon Master reads its full stat block on the page, expanding detail sections as needed, and downloads it as a text file to keep in their notes.

**Why this priority**: Displaying the creature is required for P1 to be useful at all at a basic level; the full, organised display and download complete the experience and match CharacterGen.

**Independent Test**: Generate any creature, confirm each section below is present, then download and confirm the file contains the same information.

**Acceptance Scenarios**:

1. **Given** a generated creature, **Then** the page shows its summary/name, size, type and subtypes, challenge rating, alignment, level adjustment, templates, hit points and hit dice, speeds, armor class (total, touch, flat-footed), initiative, base attack and grapple, space and reach, saving throws, abilities, skills, feats, special qualities, attacks (including full melee/ranged and special attacks), languages, magic, equipment, and demographics.
2. **Given** a generated creature, **When** the user downloads it, **Then** a text file named after the creature's summary is saved containing the same information in readable form.
3. **Given** no creature has been generated yet, **Then** no download action is available.
4. **Given** a new creature is generated, **Then** it replaces the previously displayed one.

---

### User Story 5 - Discover CreatureGen from the site chrome (Priority: P3)

A visitor finds CreatureGen in the navigation bar (between TreasureGen and CharacterGen), and can reach the CreatureGen API documentation and source repository from the API and GitHub menus.

**Why this priority**: Small, but it is how users find the page and the API.

**Independent Test**: Open the site and check the navigation order and the two new menu links.

**Acceptance Scenarios**:

1. **Given** any page, **Then** the navigation bar lists RollGen, TreasureGen, CreatureGen, CharacterGen, EncounterGen, DungeonGen in that order, and CreatureGen opens the CreatureGen page.
2. **Given** the API menu is opened, **Then** it lists CreatureGen between TreasureGen and CharacterGen, opening the CreatureGen API documentation in a new tab.
3. **Given** the GitHub menu is opened, **Then** it lists CreatureGen between TreasureGen and CharacterGen, opening the CreatureGen repository in a new tab.
4. **Given** the user navigates directly to the CreatureGen page address, **Then** the page loads.

---

### User Story 6 - Releases check CreatureGen end to end (Priority: P3)

The maintainer deploys a new build. The release verifies that the CreatureGen view model is served, the CreatureGen page loads, and the CreatureGen website tests pass against the newly deployed CreatureGen API, the same way it already does for CharacterGen; a failure rolls back like the others.

**Why this priority**: Protects production, but does not change what users see.

**Independent Test**: Inspect a release run and confirm the CreatureGen website tests ran and reported results alongside the other generators.

**Acceptance Scenarios**:

1. **Given** a release, **When** the CreatureGen API deploys, **Then** the CreatureGen website tests run against it and their results are published, as for CharacterGen.
2. **Given** a release, **When** the Web API smoke tests run, **Then** they include a CreatureGen view model check.
3. **Given** a release, **When** the website smoke tests run, **Then** they include a CreatureGen page check.

---

### Edge Cases

- **Loading**: While the view model is loading, while validating, and while generating, the page shows the same loading indicators as other generator pages, and generation cannot be started.
- **Rapid changes**: When the user changes inputs faster than validation returns, the page behaves the same way as the other generator pages (each change triggers validation; generation stays disabled while any validation is in progress).
- **No search match**: Typing text that matches no creature or template shows an empty result and does not change the current selection.
- **Many templates**: A user can add several templates (realistically 0, 1, 2, or 3); the list remains readable and reorderable.
- **Template "None"**: Offered like any other template, and can be chained. On the Random tab, an empty list ("any") and [None] ("forcibly untemplated") are different requests, and the UI makes the difference clear (e.g., the empty list reads "Any templates").
- **Switching tabs**: Each tab keeps its own inputs and validity; switching tabs does not clear the other tab's inputs or the displayed creature.
- **Service failure**: If loading options, validating, or generating fails, the page handles it the same way other generator pages do (the error is logged, an error message is shown, and any displayed creature is cleared), so a stale creature is never shown as if it were new.
- **Long names**: Long creature and template names (e.g., "Lycanthrope, Dire Wolf (Dire Werewolf, Natural)") are fully readable in selectors and output.
- **Optional sections**: Creatures with no feats, no magic, no equipment, no languages, or no special attacks show those sections as empty in the established way, without errors.
- **Incorporeal / non-standard abilities**: Creatures with no score in an ability (e.g., a Ghost's Constitution) display that ability as having no score rather than a number.

## Requirements *(mandatory)*

### Functional Requirements

**Page and navigation**

- **FR-001**: The site MUST provide a CreatureGen page reachable at its own address and from the navigation bar, positioned between TreasureGen and CharacterGen.
- **FR-002**: The API menu MUST include a CreatureGen link to the CreatureGen API documentation, and the GitHub menu MUST include a CreatureGen link to the CreatureGen source repository, each between the TreasureGen and CharacterGen entries and opening in a new tab.
- **FR-003**: The page MUST have two tabs, "Set" and "Random", with the same tab structure, layout, and behaviour as the other generator pages' tabs.
- **FR-004**: All selectable options (creatures, templates, alignments, creature types, challenge ratings) MUST come from the existing CreatureGen view model, not be hard-coded in the website.

**Set tab**

- **FR-005**: Users MUST be able to choose exactly one creature from the full list via a selector that filters the list as they type (case-insensitive, matching anywhere in the name).
- **FR-006**: Users MUST be able to build an ordered list of zero or more templates using a selector that filters as they type; added templates are appended to the end.
- **FR-007**: Users MUST be able to reorder (move up/down) and remove templates in the list.
- **FR-008**: Every template in the view model, including "None", MUST be selectable, and any template MAY be added more than once. Whether a list (including repeats) is valid is decided only by the service's validation, not by the page.
- **FR-008a**: On the Random tab, an empty template list MUST be sent as no templates (the creature may be templated), and a list containing "None" MUST be sent as-is (the creature is forced to have no template). The empty list MUST be labelled so users can tell "any" apart from "None".
- **FR-009**: The page MUST pre-select a sensible default creature on load so that the Set tab is immediately valid and generatable.

**Random tab**

- **FR-010**: Users MUST be able to optionally choose one challenge rating, in the challenge-rating order the view model provides, or "Any".
- **FR-011**: Users MUST be able to optionally choose one alignment, or "Any".
- **FR-012**: Users MUST be able to optionally choose one creature type or subtype, or "Any".
- **FR-013**: Users MUST be able to build an ordered template list exactly as in FR-006 to FR-008.
- **FR-014**: With every filter at "Any" and no templates, random generation MUST be valid.

**Validation and generation**

- **FR-015**: After every input change on a tab, the page MUST re-validate that tab's full combination of inputs (including template order) with the CreatureGen service, following the existing generator pages' validation behaviour.
- **FR-016**: The page MUST clearly indicate when a combination is invalid, and MUST prevent generation while it is invalid or while validation is in progress.
- **FR-017**: Generating MUST send exactly the current tab's inputs, with templates in their displayed order, and filters only when chosen.
- **FR-018**: The page MUST show loading indicators for loading options, validating, and generating, consistent with the other generator pages.
- **FR-019**: Failures to load, validate, or generate MUST be handled the same way as on the other generator pages.

**Creature display**

- **FR-020**: The page MUST display a generated creature in full, covering every item in User Story 4, Acceptance Scenario 1, organised into sections in the same visual style as the character display (collapsible detail sections, consistent bonus formatting such as "+2").
- **FR-021**: Where the creature's information has the same shape as information already displayed elsewhere on the site (e.g., abilities, feats, skills, spells/magic, equipment items, measurements), the display MUST look and behave the same as it does there.
- **FR-022**: Conditional bonuses (e.g., on hit points, saves, skills, armor class) MUST be shown, marked as conditional, as they are for characters.

**Download**

- **FR-023**: When a creature is displayed, users MUST be able to download it as a plain-text file named after the creature's summary, containing all information shown on the page, in the same style as the CharacterGen download.

**Delivery and quality**

- **FR-024**: The release process MUST run CreatureGen website tests after deploying the CreatureGen API, publish their results, and roll back on failure, exactly as it does for CharacterGen.
- **FR-025**: The Web API smoke tests MUST include a CreatureGen view model check, and the website smoke tests MUST include a CreatureGen page check.
- **FR-026**: Developers MUST be able to run just the CreatureGen website tests on their own, as they can for each other generator.
- **FR-027**: The work MUST have unit and integration tests following the website's existing patterns, keeping website line and branch coverage at 100%.
- **FR-028**: The README(s) MUST be updated to describe the CreatureGen page (removing the statement that CreatureGen has no page), and any README-derived documents updated per the constitution.
- **FR-029**: The CreatureGen API's documentation (its Swagger/OpenAPI descriptions and the README route table) MUST be corrected to match its existing, correct behaviour, without changing that behaviour: alignment is optional for random generation and validation, and creature type and challenge rating are each optional and accept a single value.
- **FR-030**: The page MUST always generate creatures as standalone creatures (not "as a character"), and MUST NOT offer an "as a character" option. That option is reserved for CharacterGen, which will consume CreatureGen directly in a future change.

### Key Entities

- **CreatureGen View Model**: The option lists that populate the page: creatures, templates, alignments, creature types (types followed by subtypes), challenge ratings (in ascending order).
- **Set Creature Request**: One creature plus an ordered list of templates.
- **Random Creature Request**: Optional single challenge rating, alignment, and creature type, plus an ordered list of templates.
- **Creature**: The generated result. Includes name and summary; size; type with subtypes; challenge rating; alignment; level adjustment; caster level; ordered templates; hit points (hit dice, total, conditional bonuses); speeds; armor class (total, touch, flat-footed, component bonuses, conditional); initiative; base attack and grapple bonuses; space and reach; saving throws; six abilities (some may have no score); skills; feats; special qualities; attacks (standard, full melee, full ranged, special); languages; magic (spells per day, known/prepared spells, domains, caster level, arcane spell failure); equipment (weapons, armor, shield, items); demographics (gender, age and maximum age, height/length/weight/wingspan, skin, hair, eyes, other); and whether it is advanced or can use equipment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can find and select any of the 659 creatures by typing at most 5 characters of its name and choosing from the filtered list.
- **SC-002**: A user can go from opening the page to viewing a generated creature with two ordered templates in under 1 minute.
- **SC-003**: For every input change, the validity shown matches the service's answer for those inputs, verified across tested combinations including 0, 1, and 2+ templates in different orders.
- **SC-004**: 100% of generated creatures from tested random filters match every chosen filter (challenge rating, alignment, type) and the chosen template order.
- **SC-005**: Every field listed in User Story 4, Acceptance Scenario 1 appears both on the page and in the downloaded file.
- **SC-006**: Website line and branch coverage remains at 100%, and every release runs and reports CreatureGen website tests just as it does for CharacterGen.
- **SC-007**: The CreatureGen page matches the look and behaviour of the other generator pages closely enough that a user of CharacterGen needs no instructions to use it.

## Assumptions

- The existing, live CreatureGen view model and CreatureGen API (set and random generate/validate) are sufficient; no Web API changes are needed for the page itself.
- Random filters are single-select because the API honours only one value of each; making them multi-select would be a separate API change, recorded as a GitHub issue if wanted.
- The default selected creature on load is the first creature in the list; templates start empty and random filters start at "Any".
- Repeated templates are allowed in the UI. The service decides whether they are valid (e.g., [None, None] valid, [Ghost, Ghost] invalid).
- The creature display reuses existing shared display pieces wherever the data has the same shape (e.g., feats, items, spells, bonuses), and adds creature-specific pieces only where needed.
- The download is the same plain-text style as CharacterGen; other formats are out of scope.
- The CreatureGen GitHub link points to https://github.com/DnDGen/CreatureGen and the API link to https://creature.dndgen.com/api/swagger/ui.
- Generation time is governed by the CreatureGen service; the page adds no timeouts beyond those the other generator pages use.
- Bugs or improvements found in the CreatureGen API or library along the way are recorded as GitHub issues rather than fixed here (constitution III.3), except the documentation corrections in FR-029 (III.1.c).
