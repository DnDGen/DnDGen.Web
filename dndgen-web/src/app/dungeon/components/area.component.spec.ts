import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Character } from '../../character/models/character.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { TestHelper } from '../../testHelper.spec';
import { Encounter } from '../../encounter/models/encounter.model';
import { Coin } from '../../treasure/models/coin.model';
import { AreaComponent } from './area.component';
import { Area } from '../models/area.model';
import { Pool } from '../models/pool.model';
import { DungeonTreasure } from '../models/dungeonTreasure.model';
import { Trap } from '../models/trap.model';

describe('Area Component', () => {
  describe('unit', () => {
    let component: AreaComponent;

    beforeEach(() => {
      component = new AreaComponent();
    });
  
    it(`should set the area `, () => {
      const area = new Area('my area type');
      component.area = area;

      expect(component.area).toBe(area);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<AreaComponent>;
    let helper: TestHelper<AreaComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([AreaComponent]);
  
      fixture = TestBed.createComponent(AreaComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the area type`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.area-header', 'my area type', true);
    });
  
    it(`should render no area descriptions`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header dndgen-details.area-descriptions', false);
    });
  
    it(`should render 1 area description`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.descriptions = ['my description'];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header dndgen-details.area-descriptions', true);
      helper.expectDetails('dndgen-details.area-descriptions', 'Descriptions', true);
      helper.expectTextContents('dndgen-details.area-descriptions li', ['my description']);
    });
  
    it(`should render 2 area descriptions`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.descriptions = ['my description', 'my other description'];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header dndgen-details.area-descriptions', true);
      helper.expectDetails('dndgen-details.area-descriptions', 'Descriptions', true);
      helper.expectTextContents('dndgen-details.area-descriptions li', ['my description', 'my other description']);
    });
  
    it(`should render no length/width`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 0;
      component.area.width = 0;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', false);
    });
  
    it(`should render continuing length`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 42;
      component.area.width = 0;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "continues 42'");
    });
  
    it(`should render large continuing length`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 9266;
      component.area.width = 0;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "continues 9,266'");
    });
  
    it(`should render approximate square footage`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 42;
      component.area.width = 1;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "about 42 square feet");
    });
  
    it(`should render large approximate square footage`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 9266;
      component.area.width = 1;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "about 9,266 square feet");
    });
  
    it(`should render length and width`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 42;
      component.area.width = 600;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "42' x 600'");
    });
  
    it(`should render length and large width`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 42;
      component.area.width = 90210;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "42' x 90,210'");
    });
  
    it(`should render large length and width`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 9266;
      component.area.width = 600;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "9,266' x 600'");
    });
  
    it(`should render large length and large width`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.length = 9266;
      component.area.width = 90210;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "9,266' x 90,210'");
    });
  
    it(`should render empty contents`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = true;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', false);
    });
  
    it(`should render no miscellaneous contents`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.miscellaneous = [];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-misc', false);
    });
  
    it(`should render 1 miscellaneous contents`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.miscellaneous = ['my misc contents'];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-misc', true);
      helper.expectTextContents('li.area-contents-misc', ['my misc contents']);
    });
  
    it(`should render 2 miscellaneous contents`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.miscellaneous = ['my misc contents', 'my other misc contents'];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-misc', true);
      helper.expectTextContents('li.area-contents-misc', ['my misc contents', 'my other misc contents']);
    });
  
    it(`should render no pool`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = null;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', false);
    });
  
    it(`should render pool`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', false);
    });
  
    it(`should render pool with encounter`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();
      const encounter = new Encounter('my encounter description');
      component.area.contents.pool.encounter = encounter;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', true);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-encounter', true);
      helper.expectEncounter('li.area-contents-pool-encounter > dndgen-encounter', true, encounter);
    });
  
    it(`should render pool with treasure`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();
      const treasure = new DungeonTreasure('my treasure container');
      component.area.contents.pool.treasure = treasure;

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', true);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-treasure', true);
      helper.expectDungeonTreasure('li.area-contents-pool-treasure > dndgen-dungeon-treasure', treasure);
    });
  
    it(`should render pool without magic power`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();
      component.area.contents.pool.magicPower = '';

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', false);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-magic-power', false);
    });
  
    it(`should render pool with magic power`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();
      component.area.contents.pool.magicPower = 'grant wishes';

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', true);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-magic-power', true);
      helper.expectTextContent('li.area-contents-pool-magic-power', 'grant wishes');
    });
  
    it(`should render full pool`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.pool = new Pool();
      const encounter = new Encounter('my encounter description');
      component.area.contents.pool.encounter = encounter;
      const treasure = new DungeonTreasure('my treasure container');
      component.area.contents.pool.treasure = treasure;
      component.area.contents.pool.magicPower = 'grant wishes';

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', true);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-encounter', true);
      helper.expectEncounter('li.area-contents-pool-encounter > dndgen-encounter', true, encounter);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-treasure', true);
      helper.expectDungeonTreasure('li.area-contents-pool-treasure > dndgen-dungeon-treasure', treasure);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-magic-power', true);
      helper.expectTextContent('li.area-contents-pool-magic-power', 'grant wishes');
    });
  
    it(`should render no traps`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.traps = [];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', false);
    });
  
    it(`should render 1 trap`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.traps = [
        new Trap([], 9266, 90210, 42, 'my trap'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', true);
      helper.expectDetails('li.area-contents-traps > dndgen-details', 'Traps', true);
      helper.expectCount('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 1);
      helper.expectDetails('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 'my trap', true);
      helper.expectExists('li.area-contents-trap > dndgen-details li.area-contents-trap-description', false);
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-cr', 'Challenge Rating: 9266');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-search', 'Search DC: 90210');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-disable', 'Disable Device DC: 42');
    });
  
    it(`should render 1 trap with 1 description`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.traps = [
        new Trap(['my trap description'], 9266, 90210, 42, 'my trap'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', true);
      helper.expectDetails('li.area-contents-traps > dndgen-details', 'Traps', true);
      helper.expectCount('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 1);
      helper.expectDetails('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 'my trap', true);
      helper.expectTextContents('li.area-contents-trap > dndgen-details li.area-contents-trap-description', ['my trap description']);
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-cr', 'Challenge Rating: 9266');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-search', 'Search DC: 90210');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-disable', 'Disable Device DC: 42');
    });
  
    it(`should render 1 trap with 2 descriptions`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.traps = [
        new Trap(['my trap description', 'my other trap description'], 9266, 90210, 42, 'my trap'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', true);
      helper.expectDetails('li.area-contents-traps > dndgen-details', 'Traps', true);
      helper.expectCount('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 1);
      helper.expectDetails('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 'my trap', true);
      helper.expectTextContents('li.area-contents-trap > dndgen-details li.area-contents-trap-description', ['my trap description', 'my other trap description']);
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-cr', 'Challenge Rating: 9266');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-search', 'Search DC: 90210');
      helper.expectTextContent('li.area-contents-trap > dndgen-details li.area-contents-trap-disable', 'Disable Device DC: 42');
    });
  
    it(`should render 2 traps`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.traps = [
        new Trap(['my trap description'], 9266, 90210, 42, 'my trap'),
        new Trap(['my other trap description', 'another trap description'], 600, 1337, 1336, 'my other trap'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', true);
      helper.expectDetails('li.area-contents-traps > dndgen-details', 'Traps', true);

      helper.expectMultipleDetails('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', [
        { heading: 'my trap', hasDetails: true },
        { heading: 'my other trap', hasDetails: true }
      ]);
      const elements = helper.expectCount('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 2);
      
      let descriptions = elements.item(0).querySelectorAll('li.area-contents-trap-description');
      expect(descriptions.length).toEqual(1);
      expect(descriptions.item(0).textContent).toEqual('my trap description');
      expect(elements.item(0).querySelector('li.area-contents-trap-cr')?.textContent).toEqual('Challenge Rating: 9266');
      expect(elements.item(0).querySelector('li.area-contents-trap-search')?.textContent).toEqual('Search DC: 90210');
      expect(elements.item(0).querySelector('li.area-contents-trap-disable')?.textContent).toEqual('Disable Device DC: 42');

      descriptions = elements.item(1).querySelectorAll('li.area-contents-trap-description');
      expect(descriptions.length).toEqual(2);
      expect(descriptions.item(0).textContent).toEqual('my other trap description');
      expect(descriptions.item(1).textContent).toEqual('another trap description');
      expect(elements.item(1).querySelector('li.area-contents-trap-cr')?.textContent).toEqual('Challenge Rating: 600');
      expect(elements.item(1).querySelector('li.area-contents-trap-search')?.textContent).toEqual('Search DC: 1337');
      expect(elements.item(1).querySelector('li.area-contents-trap-disable')?.textContent).toEqual('Disable Device DC: 1336');
    });
  
    it(`should render no encounters`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.encounters = [];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-encounters', false);
    });
  
    it(`should render 1 encounter`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.encounters = [
        new Encounter('my encounter description'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-encounters', true);
      helper.expectDetails('li.area-contents-encounters > dndgen-details', 'Encounters', true);
      helper.expectEncounters('li.area-contents-encounters > dndgen-details li.area-contents-encounter dndgen-encounter', component.area.contents.encounters);
    });
  
    it(`should render 2 encounters`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.encounters = [
        new Encounter('my encounter description'),
        new Encounter('my other encounter description'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-encounters', true);
      helper.expectDetails('li.area-contents-encounters > dndgen-details', 'Encounters', true);
      helper.expectEncounters('li.area-contents-encounters > dndgen-details li.area-contents-encounter dndgen-encounter', component.area.contents.encounters);
    });
  
    it(`should render no treasures`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.treasures = [];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-treasures', false);
    });
  
    it(`should render 1 treasure`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.treasures = [
        new DungeonTreasure('my container'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-treasures', true);
      helper.expectDetails('li.area-contents-treasures > dndgen-details', 'Treasures', true);
      helper.expectDungeonTreasures('li.area-contents-treasures > dndgen-details li.area-contents-treasure dndgen-dungeon-treasure', component.area.contents.treasures);
    });
  
    it(`should render 2 treasures`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.contents.isEmpty = false;
      component.area.contents.treasures = [
        new DungeonTreasure('my container'),
        new DungeonTreasure('my other container'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-treasures', true);
      helper.expectDetails('li.area-contents-treasures > dndgen-details', 'Treasures', true);
      helper.expectDungeonTreasures('li.area-contents-treasures > dndgen-details li.area-contents-treasure dndgen-dungeon-treasure', component.area.contents.treasures);
    });
  
    it(`should render full area`, () => {
      const component = fixture.componentInstance;
      component.area = new Area('my area type');
      component.area.descriptions = ['my description', 'my other description'];
      component.area.length = 96;
      component.area.width = 783;
      component.area.contents.isEmpty = false;
      component.area.contents.miscellaneous = ['my misc contents', 'my other misc contents'];
      component.area.contents.pool = new Pool();
      const encounter = new Encounter('my encounter description');
      component.area.contents.pool.encounter = encounter;
      const treasure = new DungeonTreasure('my treasure container');
      component.area.contents.pool.treasure = treasure;
      component.area.contents.pool.magicPower = 'grant wishes';
      component.area.contents.traps = [
        new Trap(['my trap description'], 9266, 90210, 42, 'my trap'),
        new Trap(['my other trap description', 'another trap description'], 600, 1337, 1336, 'my other trap'),
      ];
      component.area.contents.encounters = [
        new Encounter('my encounter description'),
        new Encounter('my other encounter description'),
      ];
      component.area.contents.treasures = [
        new DungeonTreasure('my container'),
        new DungeonTreasure('my other container'),
      ];

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.area-header li.area-contents > dndgen-details', true);
      
      helper.expectDetails('dndgen-details.area-descriptions', 'Descriptions', true);
      helper.expectTextContents('dndgen-details.area-descriptions li', ['my description', 'my other description']);

      helper.expectExists('dndgen-details.area-header li.area-length-width', true);
      helper.expectTextContent('li.area-length-width', "96' x 783'");

      helper.expectDetails('dndgen-details.area-header li.area-contents > dndgen-details', 'Contents', true);
      
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-misc', true);
      helper.expectTextContents('li.area-contents-misc', ['my misc contents', 'my other misc contents']);

      helper.expectExists('li.area-contents > dndgen-details li.area-contents-pool', true);
      helper.expectDetails('li.area-contents-pool > dndgen-details', 'Pool', true);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-encounter', true);
      helper.expectEncounter('li.area-contents-pool-encounter > dndgen-encounter', true, encounter);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-treasure', true);
      helper.expectDungeonTreasure('li.area-contents-pool-treasure > dndgen-dungeon-treasure', treasure);
      helper.expectExists('li.area-contents-pool > dndgen-details li.area-contents-pool-magic-power', true);
      helper.expectTextContent('li.area-contents-pool-magic-power', 'grant wishes');
      
      helper.expectExists('li.area-contents > dndgen-details li.area-contents-traps', true);
      helper.expectDetails('li.area-contents-traps > dndgen-details', 'Traps', true);

      helper.expectMultipleDetails('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', [
        { heading: 'my trap', hasDetails: true },
        { heading: 'my other trap', hasDetails: true }
      ]);
      const elements = helper.expectCount('li.area-contents-traps > dndgen-details li.area-contents-trap > dndgen-details', 2);
      
      let descriptions = elements.item(0).querySelectorAll('li.area-contents-trap-description');
      expect(descriptions.length).toEqual(1);
      expect(descriptions.item(0).textContent).toEqual('my trap description');
      expect(elements.item(0).querySelector('li.area-contents-trap-cr')?.textContent).toEqual('Challenge Rating: 9266');
      expect(elements.item(0).querySelector('li.area-contents-trap-search')?.textContent).toEqual('Search DC: 90210');
      expect(elements.item(0).querySelector('li.area-contents-trap-disable')?.textContent).toEqual('Disable Device DC: 42');

      descriptions = elements.item(1).querySelectorAll('li.area-contents-trap-description');
      expect(descriptions.length).toEqual(2);
      expect(descriptions.item(0).textContent).toEqual('my other trap description');
      expect(descriptions.item(1).textContent).toEqual('another trap description');
      expect(elements.item(1).querySelector('li.area-contents-trap-cr')?.textContent).toEqual('Challenge Rating: 600');
      expect(elements.item(1).querySelector('li.area-contents-trap-search')?.textContent).toEqual('Search DC: 1337');
      expect(elements.item(1).querySelector('li.area-contents-trap-disable')?.textContent).toEqual('Disable Device DC: 1336');

      helper.expectExists('li.area-contents > dndgen-details li.area-contents-encounters', true);
      helper.expectDetails('li.area-contents-encounters > dndgen-details', 'Encounters', true);
      helper.expectEncounters('li.area-contents-encounters > dndgen-details li.area-contents-encounter dndgen-encounter', component.area.contents.encounters);

      helper.expectExists('li.area-contents > dndgen-details li.area-contents-treasures', true);
      helper.expectDetails('li.area-contents-treasures > dndgen-details', 'Treasures', true);
      helper.expectDungeonTreasures('li.area-contents-treasures > dndgen-details li.area-contents-treasure dndgen-dungeon-treasure', component.area.contents.treasures);
    });
  });
});
