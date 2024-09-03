import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { AppModule } from '../../app.module';
import { UuidService } from '../services/uuid.service';

describe('DetailsComponent', () => {
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
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(DetailsComponent);
      
      //run ngOnInit
      await waitForService();
    });

    async function waitForService(waitingFixture: ComponentFixture<DetailsComponent> = fixture) {
      waitingFixture.detectChanges();
      await waitingFixture.whenStable();
      
      //update view
      waitingFixture.detectChanges();
    }
  
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
      const compiled = fixture.nativeElement as HTMLElement;
  
      const heading = compiled.querySelector('span.no-details-section');
      expect(heading).toBeDefined();
      expect(heading?.textContent).toEqual('my heading');
      expectHasAttribute('span.no-details-section', 'hidden', false);
      
      expectHasAttribute('a.details-header', 'hidden', true);
      expectHasAttribute('div.details-section', 'hidden', true);
    });

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }
  
    it('should set the heading - has details', () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      expectHasAttribute('span.no-details-section', 'hidden', true);
      expectHasAttribute('a.details-header', 'hidden', false);
      expectHasAttribute('div.details-section', 'hidden', false);
      
      const detailsLink = compiled.querySelector('a.details-header');
      expect(detailsLink).toBeDefined();
      expect(detailsLink?.textContent).toEqual('my heading');
      expect(detailsLink?.getAttribute('href')).toEqual('#' + fixture.componentInstance.id);
      expect(detailsLink?.getAttribute('data-bs-toggle')).toEqual('collapse');

      const details = compiled.querySelector('#' + fixture.componentInstance.id);
      expect(details).toBeDefined();
      expect(details?.getAttribute('class')).toContain('collapse');
      
      expect(compiled.querySelector('#' + fixture.componentInstance.id + ' > ng-content')).toBeDefined();
    });

    it('should set distinct ids for multiple components', async () => {
      const otherFixture = TestBed.createComponent(DetailsComponent);
      
      //run ngOnInit
      await waitForService(otherFixture);

      expect(fixture.componentInstance.id).not.toEqual(otherFixture.componentInstance.id);
    });

    it('should toggle the detail visibility', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      expectHasAttribute('span.no-details-section', 'hidden', true);
      expectHasAttribute('a.details-header', 'hidden', false);
      expectHasAttribute('div.details-section', 'hidden', false);
      
      let details = compiled.querySelector('#' + fixture.componentInstance.id);
      expect(details).toBeDefined();
      expect(details?.getAttribute('class')).toEqual('details-section collapse');
      
      clickLink('a.details-header');
      fixture.detectChanges();
      
      details = compiled.querySelector('#' + fixture.componentInstance.id);
      expect(details).toBeDefined();
      expect(details?.getAttribute('class')).toEqual('details-section collapsing');
      
      //TODO: Figure out how to get collapsing to finish, so we can test 'show;
      // await waitForService();
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
      
      // await waitForService();
      
      // details = compiled.querySelector('div.details-section > #' + fixture.componentInstance.id);
      // expect(details).toBeDefined();
      // expect(details?.getAttribute('class')).toEqual('collapse');
    });

    function clickLink(selector: string) {
      expectHasAttribute(selector, 'disabled', false);

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
