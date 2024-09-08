import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { Feat } from '../models/feat.model';
import { FeatComponent } from './feat.component';
import { Frequency } from '../models/frequency.model';

describe('FeatComponent', () => {
  describe('unit', () => {
    let component: FeatComponent;

    beforeEach(() => {
      component = new FeatComponent();
    });
  
    it(`should set the feat `, () => {
      const feat = new Feat('my feat');
      component.feat = feat;

      expect(component.feat).toBe(feat);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<FeatComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
        declarations: [FeatComponent, DetailsComponent]
      }).compileComponents();
  
      fixture = TestBed.createComponent(FeatComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the basic feat`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', false);
    });
  
    it(`should render the feat with focus`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus']);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', true);

      expectListItems('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus'
      ]);
    });
  
    it(`should render the feat with foci`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus', 'my other focus']);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-foci', 'hidden', false);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', true);
      
      expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      expectListItems('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus',
        'my other focus'
      ]);
    });
  
    it(`should render the feat with power`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 92);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-foci', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', false);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', true);

      expectElement('dndgen-details.feat-heading li.feat-power', 'Power: 92');
    });
  
    it(`should render the feat with frequency`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 0, new Frequency(92, 'fortnight'));

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-foci', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', false);

      expectElement('dndgen-details.feat-heading li.feat-frequency', 'Frequency: 92/fortnight');
    });
  
    it(`should render the feat with frequency without quantity`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 0, new Frequency(0, 'when I want'));

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-foci', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', false);

      expectElement('dndgen-details.feat-heading li.feat-frequency', 'Frequency: when I want');
    });
  
    it(`should render the full feat`, () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus', 'my other focus'], 92, new Frequency(66, 'pay period'));

      fixture.detectChanges();
  
      expectDetails('dndgen-details.feat-heading', 'my feat', true);
      expectHasAttribute('dndgen-details.feat-heading li.feat-foci', 'hidden', false);
      expectHasAttribute('dndgen-details.feat-heading li.feat-power', 'hidden', false);
      expectHasAttribute('dndgen-details.feat-heading li.feat-frequency', 'hidden', false);
      
      expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      expectListItems('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus',
        'my other focus'
      ]);
      expectElement('dndgen-details.feat-heading li.feat-power', 'Power: 92');
      expectElement('dndgen-details.feat-heading li.feat-frequency', 'Frequency: 66/pay period');
    });

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }

    function expectElement(selector: string, text: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual(text);
    }

    function expectListItems(selector: string, text: string[]) {
      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll(selector);
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(text.length);

      for(var i = 0; i < listItems.length; i++) {
        expect(listItems?.item(i).textContent).toEqual(text[i]);
      }
    }
  });
});
