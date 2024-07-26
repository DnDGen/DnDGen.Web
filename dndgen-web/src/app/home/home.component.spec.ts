import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AppModule } from '../app.module';

describe('HomeComponent', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<HomeComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(HomeComponent);
    });
  
    it('should create the home component', () => {
      const home = fixture.componentInstance;
      expect(home).toBeTruthy();
    });
  
    it('should render the "Welcome" header', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const navbarBrand = compiled.querySelector('h1');
      expect(navbarBrand).toBeDefined();
      expect(navbarBrand?.textContent).toEqual('Welcome!');
    });
  });
});
