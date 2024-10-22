import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreasureComponent } from './treasure.component';
import { AppModule } from '../../app.module';
import { Item } from '../models/item.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { ItemComponent } from './item.component';

describe('Treasure Component', () => {
  describe('unit', () => {
    let component: TreasureComponent;

    beforeEach(() => {
      component = new TreasureComponent();
    });
  
    it(`should set the treasure `, () => {
      let treasure = new Treasure(
        new Coin('munny', 9266),
        [new Good('good 1', 90210), new Good('good 2', 42)],
        [new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2')],
      );
      component.treasure = treasure;

      expect(component.treasure).toBe(treasure);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<TreasureComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
    imports: [
        AppModule,
        TreasureComponent, DetailsComponent
    ]
}).compileComponents();
  
      fixture = TestBed.createComponent(TreasureComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render no treasure`, () => {
      const component = fixture.componentInstance;
      component.treasure = new Treasure();

      fixture.detectChanges();
  
      const compiled = fixture.nativeElement as HTMLElement;
      let coin = compiled!.querySelector('span.treasure-coin');
      expect(coin).toBeNull();

      coin = compiled!.querySelector('span.treasure-no-coin');
      expect(coin).toBeDefined();
      expect(coin?.textContent).toEqual('No coins');

      expectDetails('dndgen-details.treasure-goods', 'Goods (x0)', false);
      expectDetails('dndgen-details.treasure-items', 'Items (x0)', false);
    });
  
    it(`should render coins`, () => {
      const component = fixture.componentInstance;
      component.treasure = new Treasure();
      component.treasure.coin = new Coin('munny', 9266);

      fixture.detectChanges();
  
      const compiled = fixture.nativeElement as HTMLElement;
      let coin = compiled!.querySelector('span.treasure-coin');
      expect(coin).toBeDefined();
      expect(coin?.textContent).toEqual('9,266 munny');

      coin = compiled!.querySelector('span.treasure-no-coin');
      expect(coin).toBeNull();

      expectDetails('dndgen-details.treasure-goods', 'Goods (x0)', false);
      expectDetails('dndgen-details.treasure-items', 'Items (x0)', false);
    });
  
    it(`should render goods`, () => {
      const component = fixture.componentInstance;
      component.treasure = new Treasure();
      component.treasure.goods = [
        new Good('my good', 90210),
        new Good('my other good', 42),
      ];

      fixture.detectChanges();
  
      const compiled = fixture.nativeElement as HTMLElement;
      let coin = compiled!.querySelector('span.treasure-coin');
      expect(coin).toBeNull();

      coin = compiled!.querySelector('span.treasure-no-coin');
      expect(coin).toBeDefined();
      expect(coin?.textContent).toEqual('No coins');

      expectDetails('dndgen-details.treasure-goods', 'Goods (x2)', true);
      expectDetails('dndgen-details.treasure-items', 'Items (x0)', false);

      const listItems = getAll('li.treasure-good', ['dndgen-details.treasure-goods', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my good (90,210gp)');
      expect(listItems?.item(1).textContent).toEqual('my other good (42gp)');
    });

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeDefined();
      expect(element.componentInstance).toBeDefined();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }
  
    it(`should render items`, () => {
      const component = fixture.componentInstance;
      component.treasure = new Treasure();
      component.treasure.items = [
        new Item('my item', 'my item type'),
        new Item('my other item', 'my other item type'),
      ];

      fixture.detectChanges();
  
      const compiled = fixture.nativeElement as HTMLElement;
      let coin = compiled!.querySelector('span.treasure-coin');
      expect(coin).toBeNull();

      coin = compiled!.querySelector('span.treasure-no-coin');
      expect(coin).toBeDefined();
      expect(coin?.textContent).toEqual('No coins');

      expectDetails('dndgen-details.treasure-goods', 'Goods (x0)', false);
      expectDetails('dndgen-details.treasure-items', 'Items (x2)', true);

      const listItems = getAll('li.treasure-item', ['dndgen-details.treasure-items', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);

      expectItems('li.treasure-item dndgen-item', component.treasure.items);
    });

    function expectItems(selector: string, items: Item[]) {
      const elements = fixture.debugElement.queryAll(By.css(selector));
      expect(elements).toBeDefined();
      expect(elements?.length).toEqual(items.length);

      for(var i = 0; i < items.length; i++) {
        const element = elements?.at(i);
        const item = items[i];

        expect(element).toBeDefined();
        expect(element?.componentInstance).toBeDefined();
        expect(element?.componentInstance).toBeInstanceOf(ItemComponent);

        const component = element?.componentInstance as ItemComponent;
        expect(component.item).toEqual(item);
      }
    }

    function getAll(selector: string, within: string[]): NodeListOf<Element> {
      const compiled = fixture.nativeElement as HTMLElement;

      let parent = compiled;
      for(var i = 0; i < within.length; i++) {
        parent = parent.querySelector(within[i]) as HTMLElement;
      }

      const elements = parent.querySelectorAll(selector);
      return elements;
    }
  
    it(`should render all treasure`, () => {
      const component = fixture.componentInstance;
      component.treasure = new Treasure();
      component.treasure.coin = new Coin('munny', 9266);
      component.treasure.goods = [
        new Good('my good', 90210),
        new Good('my other good', 42),
      ];
      component.treasure.items = [
        new Item('my item', 'my item type'),
        new Item('my other item', 'my other item type'),
      ];

      fixture.detectChanges();
  
      const compiled = fixture.nativeElement as HTMLElement;
      let coin = compiled!.querySelector('span.treasure-coin');
      expect(coin).toBeDefined();
      expect(coin?.textContent).toEqual('9,266 munny');

      coin = compiled!.querySelector('span.treasure-no-coin');
      expect(coin).toBeNull();

      expectDetails('dndgen-details.treasure-goods', 'Goods (x2)', true);
      expectDetails('dndgen-details.treasure-items', 'Items (x2)', true);

      let listItems = getAll('li.treasure-good', ['dndgen-details.treasure-goods', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my good (90,210gp)');
      expect(listItems?.item(1).textContent).toEqual('my other good (42gp)');

      listItems = getAll('li.treasure-item', ['dndgen-details.treasure-items', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);

      expectItems('li.treasure-item dndgen-item', component.treasure.items);
    });
  });
});
