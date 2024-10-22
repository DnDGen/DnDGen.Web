import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { DetailsComponent } from '../../shared/components/details.component';
import { Character } from '../../character/models/character.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { TestHelper } from '../../testHelper.spec';
import { EncounterComponent } from './encounter.component';
import { Encounter } from '../models/encounter.model';
import { EncounterCreature } from '../models/encounterCreature.model';
import { Creature } from '../models/creature.model';
import { Coin } from '../../treasure/models/coin.model';

describe('Encounter Component', () => {
  describe('unit', () => {
    let component: EncounterComponent;

    beforeEach(() => {
      component = new EncounterComponent();
    });
  
    it(`should set the encounter `, () => {
      const encounter = new Encounter('my encounter description');
      component.encounter = encounter;

      expect(component.encounter).toBe(encounter);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<EncounterComponent>;
    let helper: TestHelper<EncounterComponent>;
    let creatureCount: number;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
    imports: [
        AppModule,
        EncounterComponent, DetailsComponent
    ]
}).compileComponents();
  
      fixture = TestBed.createComponent(EncounterComponent);
      helper = new TestHelper(fixture);

      creatureCount = 0;
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    function createEncounterCreature(): EncounterCreature {
      creatureCount++;

      var creature = new EncounterCreature(
        createCreature(`creature ${creatureCount}`),
        9266 + creatureCount,
        `CR ${90210 + creatureCount}`
      );

      return creature;
    }

    function createCreature(name: string): Creature {
      return new Creature(name, `${name} description`);
    }
  
    it(`should render the encounter description`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
    });
  
    it(`should render the encounter level properties`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.targetEncounterLevel = 600;
      component.encounter.averageEncounterLevel = 1337;
      component.encounter.averageDifficulty = 'my average difficulty';
      component.encounter.actualEncounterLevel = 42;
      component.encounter.actualDifficulty = 'my actual difficulty';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-target', 'Target Encounter Level: 600');
      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-average', 'Average Encounter Level: 1337 (my average difficulty)');
      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-actual', 'Actual Encounter Level: 42 (my actual difficulty)');
    });
  
    it(`should render the encounter creature`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.description = '';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 x9267', false);
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render the encounter creature with description`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', false);
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render the encounter creature with sub-creature`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.subCreature = createCreature('my sub-creature');

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', true);
      helper.expectDetails(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details', 
        'my sub-creature', 
        false);
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render the encounter creature with sub-creature with description`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.subCreature = createCreature('my sub-creature');
      component.encounter.creatures[0].creature.subCreature.description = '';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', true);
      helper.expectDetails(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details', 
        'my sub-creature (my sub-creature description)', 
        false);
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render the encounter creature with sub-sub-creature`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.subCreature = createCreature('my sub-creature');
      component.encounter.creatures[0].creature.subCreature.subCreature = createCreature('my sub-sub-creature');
      component.encounter.creatures[0].creature.subCreature.subCreature.description = '';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', true);
      helper.expectDetails(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details', 
        'my sub-creature (my sub-creature description)', 
        true);
      helper.expectTextContent(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details span', 
        'my sub-sub-creature');
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render the encounter creature with sub-sub-creature with description`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.subCreature = createCreature('my sub-creature');
      component.encounter.creatures[0].creature.subCreature.subCreature = createCreature('my sub-sub-creature');

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', true);
      helper.expectDetails(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details', 
        'my sub-creature (my sub-creature description)', 
        true);
      helper.expectTextContent(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details span', 
        'my sub-sub-creature (my sub-sub-creature description)');
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
    });
  
    it(`should render no treasures`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.treasures = [];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-treasures dndgen-details', 'Treasures: None', false);
    });
  
    it(`should render 1 treasure`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.treasures = [
        new Treasure(
          new Coin('munny', 9266)
        ),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-treasures dndgen-details', 'Treasures', true);
      helper.expectTreasures('dndgen-details.encounter-header .encounter-treasures dndgen-details dndgen-treasure', component.encounter.treasures);
    });
  
    it(`should render 2 treasures`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.treasures = [
        new Treasure(
          new Coin('munny', 9266)
        ),
        new Treasure(
          new Coin('dubloons', 90210)
        ),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-treasures dndgen-details', 'Treasures', true);
      helper.expectTreasures('dndgen-details.encounter-header .encounter-treasures dndgen-details dndgen-treasure', component.encounter.treasures);
    });
  
    it(`should render no characters`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.characters = [];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-characters dndgen-details', 'Characters', false);
      helper.expectHasAttribute('dndgen-details.encounter-header .encounter-characters dndgen-details', 'hidden', true);
    });
  
    it(`should render 1 character`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.characters = [
        new Character('my character summary'),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-characters dndgen-details', 'Characters', true);
      helper.expectHasAttribute('dndgen-details.encounter-header .encounter-characters dndgen-details', 'hidden', false);
      helper.expectCharacters('dndgen-details.encounter-header .encounter-characters dndgen-details dndgen-character', component.encounter.characters);
    });
  
    it(`should render 2 characters`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.characters = [
        new Character('my character summary'),
        new Character('my other character summary'),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-characters dndgen-details', 'Characters', true);
      helper.expectHasAttribute('dndgen-details.encounter-header .encounter-characters dndgen-details', 'hidden', false);
      helper.expectCharacters('dndgen-details.encounter-header .encounter-characters dndgen-details dndgen-character', component.encounter.characters);
    });
  
    it(`should render the full encounter`, () => {
      const component = fixture.componentInstance;
      component.encounter = new Encounter('my encounter description');
      component.encounter.targetEncounterLevel = 600;
      component.encounter.averageEncounterLevel = 1337;
      component.encounter.averageDifficulty = 'my average difficulty';
      component.encounter.actualEncounterLevel = 42;
      component.encounter.actualDifficulty = 'my actual difficulty';
      component.encounter.creatures.push(createEncounterCreature());
      component.encounter.creatures[0].creature.subCreature = createCreature('my sub-creature');
      component.encounter.creatures[0].creature.subCreature.subCreature = createCreature('my sub-sub-creature');
      component.encounter.treasures = [
        new Treasure(
          new Coin('munny', 9266)
        ),
        new Treasure(
          new Coin('dubloons', 90210)
        ),
      ];
      component.encounter.characters = [
        new Character('my character summary'),
        new Character('my other character summary'),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.encounter-header', 'my encounter description', true);

      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-target', 'Target Encounter Level: 600');
      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-average', 'Average Encounter Level: 1337 (my average difficulty)');
      helper.expectTextContent('dndgen-details.encounter-header span.encounter-level-actual', 'Actual Encounter Level: 42 (my actual difficulty)');

      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details', 'Creatures', true);
      helper.expectDetails('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details', 'creature 1 (creature description 1) x9267', true);
      helper.expectDetails(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details', 
        'my sub-creature (my sub-creature description)', 
        true);
      helper.expectTextContent(
        'dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details dndgen-details span', 
        'my sub-sub-creature (my sub-sub-creature description)');
      helper.expectTextContent('dndgen-details.encounter-header .encounter-creatures dndgen-details dndgen-details .encounter-creature-cr', 'Challenge Rating: CR 90211');
      
      helper.expectDetails('dndgen-details.encounter-header .encounter-treasures dndgen-details', 'Treasures', true);
      helper.expectTreasures('dndgen-details.encounter-header .encounter-treasures dndgen-details dndgen-treasure', component.encounter.treasures);
      
      helper.expectDetails('dndgen-details.encounter-header .encounter-characters dndgen-details', 'Characters', true);
      helper.expectHasAttribute('dndgen-details.encounter-header .encounter-characters dndgen-details', 'hidden', false);
      helper.expectCharacters('dndgen-details.encounter-header .encounter-characters dndgen-details dndgen-character', component.encounter.characters);
    });
  });
});
