import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { TestHelper } from '../../testHelper.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Details Component', () => {
  describe('unit', () => {
    let component: DetailsComponent;
    
    beforeEach(() => {
      component = new DetailsComponent();
    });

    it('initializes the inputs', () => {
      expect(component.hasDetails).toBeFalse();
      expect(component.heading).toBe('');
    });

    it('initializes as collapsed', () => {
      expect(component.collapsed).toBeTrue();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<DetailsComponent>;
    let helper: TestHelper<DetailsComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([NoopAnimationsModule, DetailsComponent]);
  
      fixture = TestBed.createComponent(DetailsComponent);
      helper = new TestHelper(fixture);
    });

    it('should create the details component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should be collapsed on init', () => {
      expect(fixture.componentInstance.collapsed).toBeTrue();
    });
  
    it('should set the heading - no details', () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = false;

      fixture.detectChanges();
  
      helper.expectElement('span.no-details-header', 'my heading');
      helper.expectExists('span.no-details-header', true);
      
      helper.expectExists('a.details-header', false);
      helper.expectExists('div.details-section', false);
    });
  
    it('should set the heading - has details', () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      fixture.detectChanges();
  
      helper.expectExists('span.no-details-header', false);
      helper.expectExists('a.details-header', true);
      helper.expectExists('div.details-section', true);
      helper.expectElement('a.details-header', 'my heading');
    });

    it('should toggle the detail visibility', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      fixture.detectChanges();
      
      helper.expectExists('span.no-details-header', false);
      helper.expectExists('a.details-header', true);
      helper.expectExists(`div.details-section`, true);
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      helper.clickLink('a.details-header');
      fixture.detectChanges();
      
      // TODO: Figure out how to disable the ng-bootstrap animations. NoopAnimationsModule doesn't seem to work
      // helper.expectAttribute(`div.details-section`, 'class', 'details-section show');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapsing');
      
      // helper.clickLink('a.details-header');
      // fixture.detectChanges();
      
      // helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
    });

    // TODO: Do this after figuring out how to properly disable animations
    xit('should distinctly toggle the detail visibility', () => {
      const otherFixture = TestBed.createComponent(DetailsComponent);
      const otherHelper = new TestHelper(otherFixture);

      otherFixture.componentInstance.heading = "my other heading";
      otherFixture.componentInstance.hasDetails = true;
      
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectElement('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      helper.clickLink('a.details-header');
      fixture.detectChanges();
      
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section show');
      
      otherHelper.expectElement('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      helper.clickLink('a.details-header');
      fixture.detectChanges();
      
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectElement('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      otherHelper.clickLink('a.details-header');
      fixture.detectChanges();
      
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectElement('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section show');

      otherHelper.clickLink('a.details-header');
      fixture.detectChanges();
      
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectElement('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
    });
  });
});
