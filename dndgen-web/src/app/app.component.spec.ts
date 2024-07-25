import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'DnDGen' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DnDGen');
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
