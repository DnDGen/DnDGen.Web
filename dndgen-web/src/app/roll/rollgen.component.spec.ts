import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { AppModule } from '../app.module';

describe('AppComponent', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<RollGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(RollGenComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should initialize the internal properties`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toEqual('');
    });
  
    it(`should initialize the input values`, () => {
      const component = fixture.componentInstance;
      expect(component.standardQuantity).toEqual(1);
      expect(component.standardDie).toEqual(component.standardDice[7]);
      expect(component.customQuantity).toEqual(1);
      expect(component.customDie).toEqual(1);
      expect(component.expression).toEqual('3d6+2');
    });
  
    it('should render the navigation bar', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const navbarBrand = compiled.querySelector('a.navbar-brand');
      expect(navbarBrand).toBeDefined();
      expect(navbarBrand?.textContent).toEqual('DnDGen');
      expect(navbarBrand?.getAttribute('href')).toEqual('/');
    });
  
    it('should render the router outlet', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('router-outlet')).toBeDefined();
    });
  });
});
