import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { LoadingComponent } from './loading.component';
import { Size } from './size.enum';

describe('Loading Component', () => {
  describe('unit', () => {
    let component: LoadingComponent;
    
    beforeEach(() => {
      component = new LoadingComponent();
    });

    it('initializes the inputs', () => {
      expect(component.isLoading).toBe(true);
      expect(component.size).toBe(Size.Small);
    });

    it('should return a large loading class', () => {
      component.size = Size.Large;
      expect(component.loadingClass).toBe('dndgen-loading-large');
    });

    it('should return a medium loading class', () => {
      component.size = Size.Medium;
      expect(component.loadingClass).toBe('dndgen-loading-medium');
    });

    it('should return a small loading class', () => {
      component.size = Size.Small;
      expect(component.loadingClass).toBe('dndgen-loading-small');
    });

    it('should return that large is large', () => {
      component.size = Size.Large;
      expect(component.isLarge).toBeTrue();
    });

    it('should return that medium is not large', () => {
      component.size = Size.Medium;
      expect(component.isLarge).toBeFalse();
    });

    it('should return that small is not large', () => {
      component.size = Size.Small;
      expect(component.isLarge).toBeFalse();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<LoadingComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(LoadingComponent);
    });
  
    it('should create the details component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should show the default loading image', () => {
      fixture.componentInstance.isLoading = true;
      fixture.detectChanges();

      expectToExist('img.not-large-image', true);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);

      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('img.not-large-image');
      expect(loadingImage?.getAttribute('class')).toContain('dndgen-loading-small');
      expect(loadingImage?.getAttribute('class')).not.toContain('center-block');
      expect(loadingImage?.getAttribute('src')).toEqual('/assets/loadingDice.svg');
    });
  
    it('should hide the default loading image', () => {
      fixture.componentInstance.isLoading = false;
      fixture.detectChanges();

      expectToExist('img.not-large-image', false);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);
    });
  
    it('should show the small loading image', () => {
      fixture.componentInstance.isLoading = true;
      fixture.componentInstance.size = Size.Small;
      fixture.detectChanges();

      expectToExist('img.not-large-image', true);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);

      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('img.not-large-image');
      expect(loadingImage?.getAttribute('class')).toContain('dndgen-loading-small');
      expect(loadingImage?.getAttribute('class')).not.toContain('center-block');
      expect(loadingImage?.getAttribute('src')).toEqual('/assets/loadingDice.svg');
    });
  
    it('should hide the small loading image', () => {
      fixture.componentInstance.isLoading = false;
      fixture.componentInstance.size = Size.Small;
      fixture.detectChanges();

      expectToExist('img.not-large-image', false);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);
    });
  
    it('should show the medium loading image', () => {
      fixture.componentInstance.isLoading = true;
      fixture.componentInstance.size = Size.Medium;
      fixture.detectChanges();

      expectToExist('img.not-large-image', true);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);

      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('img.not-large-image');
      expect(loadingImage?.getAttribute('class')).toContain('dndgen-loading-medium');
      expect(loadingImage?.getAttribute('class')).not.toContain('center-block');
      expect(loadingImage?.getAttribute('src')).toEqual('/assets/loadingDice.svg');
    });
  
    it('should hide the medium loading image', () => {
      fixture.componentInstance.isLoading = false;
      fixture.componentInstance.size = Size.Medium;
      fixture.detectChanges();

      expectToExist('img.not-large-image', false);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', false);
    });
  
    it('should show the large loading image', () => {
      fixture.componentInstance.isLoading = true;
      fixture.componentInstance.size = Size.Large;
      fixture.detectChanges();

      expectToExist('img.not-large-image', false);
      expectToExist('img.large-image', true);
      expectToExist('div.not-loading', false);

      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('img.large-image');
      expect(loadingImage?.getAttribute('class')).toContain('center-block dndgen-loading-large');
      expect(loadingImage?.getAttribute('src')).toEqual('/assets/loadingDice.svg');
    });

    function expectToExist(selector: string, exists: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector(selector);

      if (exists) {
        expect(element).toBeTruthy();
      } else {
        expect(element).toBeFalsy();
      }
    }
  
    it('should show the loaded content', () => {
      fixture.componentInstance.isLoading = false;
      fixture.componentInstance.size = Size.Large;
      fixture.detectChanges();
      
      expectToExist('img.not-large-image', false);
      expectToExist('img.large-image', false);
      expectToExist('div.not-loading', true);

      //TODO: Figure out how to assert that the ng-content is there correctly
    });
  });
});
