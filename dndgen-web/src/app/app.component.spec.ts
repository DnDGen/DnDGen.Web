import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestHelper } from './testHelper.spec';
import { RouterTestingHarness } from '@angular/router/testing';

fdescribe('App Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<AppComponent>;
    let harness: RouterTestingHarness;
    let helper: TestHelper<AppComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([AppComponent]);
  
      fixture = TestBed.createComponent(AppComponent);
      harness = await RouterTestingHarness.create();
      helper = new TestHelper(fixture);
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

    describe('routing', () => {
      describe('by url', () => {
        it('routes to the root page', async () => {
          const component = await harness.navigateByUrl('/');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the home page', async () => {
          const component = await harness.navigateByUrl('/home');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the error page', async () => {
          const component = await harness.navigateByUrl('/error');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
        
        it('routes to the RollGen page', async () => {
          const component = await harness.navigateByUrl('/roll');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('RollGen');
        });
        
        it('routes to the TreasureGen page', async () => {
          const component = await harness.navigateByUrl('/treasure');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('TreasureGen');
        });
        
        it('routes to the CharacterGen page', async () => {
          const component = await harness.navigateByUrl('/character');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('CharacterGen');
        });
        
        it('routes to the EncounterGen page', async () => {
          const component = await harness.navigateByUrl('/encounter');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('EncounterGen');
        });
        
        it('routes to the DungeonGen page', async () => {
          const component = await harness.navigateByUrl('/dungeon');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('DungeonGen');
        });
        
        it('routes a bad url', async () => {
          const component = await harness.navigateByUrl('/whatever');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
      });

      describe('by navigation', () => {
        it('routes to the root page', async () => {
          helper.clickLink('#rootLink');
          expect('NOT YET WRITTEN').toBeFalsy();

          const component = await harness.navigateByUrl('/');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the home page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/home');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the error page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/error');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
        
        it('routes to the RollGen page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/roll');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('RollGen');
        });
        
        it('routes to the TreasureGen page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/treasure');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('TreasureGen');
        });
        
        it('routes to the CharacterGen page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/character');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('CharacterGen');
        });
        
        it('routes to the EncounterGen page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/encounter');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('EncounterGen');
        });
        
        it('routes to the DungeonGen page', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/dungeon');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('DungeonGen');
        });
        
        it('routes a bad url', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/whatever');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
        
        it('routes an external link', async () => {
          expect('NOT YET WRITTEN').toBeFalsy();
          const component = await harness.navigateByUrl('/whatever');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
      });
    });
  });
});
