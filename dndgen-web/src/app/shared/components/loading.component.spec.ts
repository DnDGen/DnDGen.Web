import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  describe('unit', () => {
    let component: LoadingComponent;
    
    beforeEach(() => {
      component = new LoadingComponent();
    });

    it('initializes the inputs', () => {
      expect(component.isLoading).toBe(true);
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
  
    it('should show the loading image', () => {
      fixture.componentInstance.isLoading = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('div.loading img');
      expect(loadingImage).toBeTruthy();
      expect(loadingImage?.getAttribute('style')).toEqual('width: 500px; height: auto;');
      expect(loadingImage?.getAttribute('src')).toEqual('~/loading-dice.svg');
      
      const notLoadingSection = compiled.querySelector('div.not-loading');
      expect(notLoadingSection).toBeFalsy();
    });
  
    it('should show the loaded content', () => {
      fixture.componentInstance.isLoading = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const loadingImage = compiled.querySelector('div.loading');
      expect(loadingImage).toBeFalsy();
      
      const loadedContent = compiled.querySelector('div.not-loading ng-content');
      expect(loadedContent).toBeTruthy();
    });
  });
});
