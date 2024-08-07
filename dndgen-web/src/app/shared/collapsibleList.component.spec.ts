import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleListComponent } from './collapsibleList.component';
import { AppModule } from '../app.module';
import * as uuid from 'uuid';

describe('CollapsibleListComponent', () => {
  describe('unit', () => {
    let component: CollapsibleListComponent;
    
    beforeEach(() => {
      component = new CollapsibleListComponent();
    });

    it('initializes the inputs', () => {
      expect(component.hasList).toBe(false);
      expect(component.heading).toBe('');
    });

    it('sets a random id', () => {
      expect(component.id).toContain('list-');
    });

    it('sets distinct ids for multiple components', () => {
      const otherComponent = new CollapsibleListComponent();
      
      expect(component.id).toContain('list-');
      expect(otherComponent.id).toContain('list-');
      expect(component.id).not.toEqual(otherComponent.id);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<CollapsibleListComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(CollapsibleListComponent);
    });
  
    it('should create the collapsible list component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should set the heading - no list', () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasList = false;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const heading = compiled.querySelector('#noListSection');
      expect(heading).toBeDefined();
      expect(heading?.textContent).toEqual('my heading');
      expectHasAttribute('#noListSection', 'hidden', false);
      
      expectHasAttribute('#listSection', 'hidden', true);
    });

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }
  
    it('should set the heading - has list', () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasList = true;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      expectHasAttribute('#noListSection', 'hidden', true);
      
      expectHasAttribute('#listSection', 'hidden', false);
      
      const listLink = compiled.querySelector('#listSection > a');
      expect(listLink).toBeDefined();
      expect(listLink?.textContent).toEqual('my heading');
      expect(listLink?.getAttribute('href')).toEqual('#' + fixture.componentInstance.id);
      expect(listLink?.getAttribute('data-bs-toggle')).toEqual('collapse');

      const list = compiled.querySelector('#listSection > #' + fixture.componentInstance.id);
      expect(list).toBeDefined();
      expect(list?.classList[0]).toEqual('collapse');
      
      expect(compiled.querySelector('#' + fixture.componentInstance.id + ' > ng-content')).toBeDefined();
    });

    it('sets distinct ids for multiple components', () => {
      const otherFixture = TestBed.createComponent(CollapsibleListComponent);
      
      expect(fixture.componentInstance.id).not.toEqual(otherFixture.componentInstance.id);
    });
  });
});
