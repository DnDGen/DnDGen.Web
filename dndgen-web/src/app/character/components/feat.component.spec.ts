import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Feat } from '../models/feat.model';
import { FeatComponent } from './feat.component';
import { Frequency } from '../models/frequency.model';
import { TestHelper } from '../../test-helper';

describe('Feat Component', () => {
  describe('unit', () => {
    let component: FeatComponent;

    beforeEach(() => {
      component = new FeatComponent();
    });
  
    it(`should set the feat`, () => {
      const feat = new Feat('my feat');
      component.feat = feat;

      expect(component.feat).toBe(feat);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<FeatComponent>;
    let helper: TestHelper<FeatComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([FeatComponent]);
  
      fixture = TestBed.createComponent(FeatComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the basic feat`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat');

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', false);
    });
  
    it(`should render the feat with focus`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus']);

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', false);

      helper.expectTextContents('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus'
      ]);
    });
  
    it(`should render the feat with foci`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus', 'my other focus']);

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-foci', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', false);
      
      helper.expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      helper.expectTextContents('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus',
        'my other focus'
      ]);
    });
  
    it(`should render the feat with power`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 92);

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-foci', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', false);

      helper.expectTextContent('dndgen-details.feat-heading li.feat-power', 'Power: 92');
    });
  
    it(`should render the feat with frequency`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 0, new Frequency(92, 'fortnight'));

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-foci', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', true);

      helper.expectTextContent('dndgen-details.feat-heading li.feat-frequency', 'Frequency: 92/fortnight');
    });
  
    it(`should render the feat with frequency without quantity`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', [], 0, new Frequency(0, 'when I want'));

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-foci', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', false);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', true);

      helper.expectTextContent('dndgen-details.feat-heading li.feat-frequency', 'Frequency: when I want');
    });
  
    it(`should render the full feat`, async () => {
      const component = fixture.componentInstance;
      component.feat = new Feat('my feat', ['my focus', 'my other focus'], 92, new Frequency(66, 'pay period'));

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.feat-heading', 'my feat', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-foci', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-power', true);
      helper.expectExists('dndgen-details.feat-heading li.feat-frequency', true);
      
      helper.expectDetails('dndgen-details.feat-heading li.feat-foci dndgen-details', 'Foci', true);
      helper.expectTextContents('dndgen-details.feat-heading li.feat-foci dndgen-details li', [
        'my focus',
        'my other focus'
      ]);
      helper.expectTextContent('dndgen-details.feat-heading li.feat-power', 'Power: 92');
      helper.expectTextContent('dndgen-details.feat-heading li.feat-frequency', 'Frequency: 66/pay period');
    });
  });
});
