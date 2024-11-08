import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Treasure } from '../../treasure/models/treasure.model';
import { TestHelper } from '../../testHelper.spec';
import { DungeonTreasureComponent } from './dungeonTreasure.component';
import { Coin } from '../../treasure/models/coin.model';
import { DungeonTreasure } from '../models/dungeonTreasure.model';
import { TreasureComponent } from '../../treasure/components/treasure.component';

describe('Dungeon Treasure Component', () => {
  describe('unit', () => {
    let component: DungeonTreasureComponent;

    beforeEach(() => {
      component = new DungeonTreasureComponent();
    });
  
    it(`should set the dungeon treasure `, () => {
      const dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure = dungeonTreasure;

      expect(component.dungeonTreasure).toBe(dungeonTreasure);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<DungeonTreasureComponent>;
    let helper: TestHelper<DungeonTreasureComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([DungeonTreasureComponent, TreasureComponent]);
  
      fixture = TestBed.createComponent(DungeonTreasureComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render an empty dungeon treasure`, () => {
      const component = fixture.componentInstance;
      component.dungeonTreasure = new DungeonTreasure();

      fixture.detectChanges();
  
      helper.expectExists('.dungeon-treasure-container', false);
      helper.expectExists('.dungeon-treasure-concealment', false);
      helper.expectExists('.dungeon-treasure-treasure', false);
    });
  
    it(`should render a dungeon treasure`, () => {
      const treasure = new Treasure(true, new Coin('munny', 9266));
      const component = fixture.componentInstance;
      component.dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure.treasure = treasure;

      fixture.detectChanges();
  
      helper.expectExists('.dungeon-treasure-container', false);
      helper.expectExists('.dungeon-treasure-concealment', false);
      helper.expectExists('.dungeon-treasure-treasure', true);
      helper.expectTreasure('.dungeon-treasure-treasure dndgen-treasure', treasure);
    });
  
    it(`should render treasure container`, () => {
      const component = fixture.componentInstance;
      component.dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure.container = 'my treasure container';

      fixture.detectChanges();
  
      helper.expectExists('.dungeon-treasure-container', true);
      helper.expectExists('.dungeon-treasure-concealment', false);
      helper.expectExists('.dungeon-treasure-treasure', false);
      helper.expectTextContent('.dungeon-treasure-container', 'Container: my treasure container');
    });
  
    it(`should render treasure concealment`, () => {
      const component = fixture.componentInstance;
      component.dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure.concealment = 'my treasure concealment';

      fixture.detectChanges();
  
      helper.expectExists('.dungeon-treasure-container', false);
      helper.expectExists('.dungeon-treasure-concealment', true);
      helper.expectExists('.dungeon-treasure-treasure', false);
      helper.expectTextContent('.dungeon-treasure-concealment', 'Concealment: my treasure concealment');
    });
  
    it(`should render full dungeon treasure`, () => {
      const treasure = new Treasure(true, new Coin('munny', 9266));

      const component = fixture.componentInstance;
      component.dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure.container = 'my treasure container';
      component.dungeonTreasure.concealment = 'my treasure concealment';
      component.dungeonTreasure.treasure = treasure;

      fixture.detectChanges();
  
      helper.expectExists('.dungeon-treasure-container', true);
      helper.expectExists('.dungeon-treasure-concealment', true);
      helper.expectExists('.dungeon-treasure-treasure', true);
      helper.expectTextContent('.dungeon-treasure-container', 'Container: my treasure container');
      helper.expectTextContent('.dungeon-treasure-concealment', 'Concealment: my treasure concealment');
      helper.expectTreasure('.dungeon-treasure-treasure dndgen-treasure', treasure);
    });
  });
});
