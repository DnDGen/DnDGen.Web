import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { UuidService } from '../services/uuid.service';
import { TestHelper } from '../../testHelper.spec';

describe('Details Component', () => {
  describe('unit', () => {
    let component: DetailsComponent;
    let idServiceSpy: jasmine.SpyObj<UuidService>;
    
    beforeEach(() => {
      idServiceSpy = jasmine.createSpyObj('UuidService', ['generate']);
      
      component = new DetailsComponent(idServiceSpy);
    });

    it('initializes the inputs', () => {
      expect(component.hasDetails).toBe(false);
      expect(component.heading).toBe('');
    });

    it('sets a random id', () => {
      idServiceSpy.generate.and.returnValue('my-fake-id');

      component.ngOnInit();

      expect(component.id).toEqual('details-my-fake-id');
    });

    it('sets distinct ids for multiple components', () => {
      idServiceSpy.generate.and.returnValues('my-fake-id-1', 'my-fake-id-2');

      const otherComponent = new DetailsComponent(idServiceSpy);
      
      component.ngOnInit();
      otherComponent.ngOnInit();

      expect(component.id).toEqual('details-my-fake-id-1');
      expect(otherComponent.id).toEqual('details-my-fake-id-2');
      expect(component.id).not.toEqual(otherComponent.id);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<DetailsComponent>;
    let helper: TestHelper<DetailsComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([DetailsComponent]);
  
      fixture = TestBed.createComponent(DetailsComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForService();
    });

    it('should create the details component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should set the id on init', () => {
      expect(fixture.componentInstance.id).toMatch(/^details-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
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
      helper.expectExists(`#${fixture.componentInstance.id}`, true);
      helper.expectElement('a.details-header', 'my heading');
      helper.expectAttribute('a.details-header', 'href', `#${fixture.componentInstance.id}`);
      helper.expectAttribute('a.details-header', 'data-bs-toggle', 'collapse');
      helper.expectAttributeContains(`#${fixture.componentInstance.id}`, 'class', 'collapse');
    });

    it('should set distinct ids for multiple components', async () => {
      const otherFixture = TestBed.createComponent(DetailsComponent);
      helper = new TestHelper(otherFixture);
      
      //run ngOnInit
      await helper.waitForService();

      expect(fixture.componentInstance.id).not.toEqual(otherFixture.componentInstance.id);
    });

    it('should toggle the detail visibility', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      fixture.detectChanges();
      
      helper.expectExists('span.no-details-header', false);
      helper.expectExists('a.details-header', true);
      helper.expectExists('div.details-section', true);
      helper.expectExists(`#${fixture.componentInstance.id}`, true);
      helper.expectAttribute(`#${fixture.componentInstance.id}`, 'class', 'details-section collapse');
      
      clickLink('a.details-header');
      fixture.detectChanges();
      
      helper.expectAttribute(`#${fixture.componentInstance.id}`, 'class', 'details-section collapsing');

      //TODO: Figure out how to get collapsing to finish, so we can test 'show;
      // await helper.waitForService();
      // await fixture.whenRenderingDone();
      // fixture.detectChanges();

      // details = compiled.querySelector('div.details-section > #' + fixture.componentInstance.id);
      // expect(details).toBeDefined();
      // expect(details?.getAttribute('class')).toEqual('show');
      
      // clickLink('div.details-section > a');
      // fixture.detectChanges();

      // details = compiled.querySelector('div.details-section > #' + fixture.componentInstance.id);
      // expect(details).toBeDefined();
      // expect(details?.getAttribute('class')).toEqual('collapsing');
      
      // await helper.waitForService();
      
      // details = compiled.querySelector('div.details-section > #' + fixture.componentInstance.id);
      // expect(details).toBeDefined();
      // expect(details?.getAttribute('class')).toEqual('collapse');
    });

    function clickLink(selector: string) {
      helper.expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled!.querySelector(selector) as HTMLLinkElement;

      link.click();
    }

    xit('should distinctly toggle the detail visibility', async () => {
      //TODO: Setup fake component with 2 details child components
      //TODO: Setup both children to have details
      //TODO: Expect both hidden
      //TODO: click the link for child 1
      //TODO: Expect visible child 1, hidden child 2
      //TODO: click the link for child 1 again
      //TODO: expect both hidden
      //TODO: click link for child 2
      //TODO: expect hidden child 1, visible child 2
      //TODO: click link for child 2 again
      //TODO: Expect both hidden again
      expect('set up 2 components within a parent (fake component), click one, verify other does not toggle. Then do reverse').toBe('');
    });
  });
});
