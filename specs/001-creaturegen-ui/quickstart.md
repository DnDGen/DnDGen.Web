# Quickstart: Validating the CreatureGen Page

## Prerequisites

- Node and npm as used by `dndgen-web` (`npm ci` in `dndgen-web/`).
- Internet access (integration tests call the live Web and CreatureGen APIs).

## Run

```bash
cd dndgen-web
npm run test:creaturegen          # all CreatureGen unit + integration tests
npm run test:unit                 # whole site, unit
npm run test:integration          # whole site, integration
npm start                         # then open http://localhost:4200/creature
```

For API documentation changes: `dotnet test DnDGen.Apis.sln` (all API tests still pass; there is no behaviour change).

## Manual scenarios (map to spec user stories)

1. **US5 navigation**: The nav bar reads RollGen, TreasureGen, **CreatureGen**, CharacterGen, …; the GitHub and API menus have CreatureGen in the same position and open in a new tab.
2. **US1 set**: On the Set tab, type `giant` and pick *Hill Giant*. The validity shows valid. Generate, and a Hill Giant is displayed.
3. **US2 order**: Pick *Human*, add *Ghost* (valid), then add *Lich* (invalid, Generate disabled). Move *Lich* above *Ghost* and confirm that it re-validates. Remove *Lich* (valid). Add *Ghost* again ([Ghost, Ghost] → invalid). Replace with [None, None] → valid.
   - **Random "None"**: On the Random tab, the empty list reads "Any templates". Add *None* and generate several times: none of the results is templated.
4. **US3 random**: No filters → Generate works. Choose CR `5`, alignment `Neutral Evil`, type `Aberration` → the result matches. Choose template *Fiendish Creature* plus alignment *Neutral Good* → the validating spinner shows, then Generate stays disabled.
5. **US4 display/download**: Expand every section and confirm the fields listed in spec US4-AS1. Use a Ghost to see Constitution as "—". Download, and confirm `<summary>.txt` contains the same data.
6. **Errors**: Block `creature.dndgen.com` in devtools. Changing an input logs the error, shows the error alert, and clears any creature.

## Expected CI/CD outcomes

- `cicd/release.yml` CreatureGen job runs `test:integration:ci:creaturegen` and publishes `creaturegen.website.xml`.
- The Web API smoke run includes "CreatureGen View Model", and the website smoke run includes "CreatureGen Page".
- Website coverage report: 100% lines and branches.
