import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestHelper } from './testHelper.spec';
import { RouterTestingHarness } from '@angular/router/testing';

describe('App Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<AppComponent>;
    let helper: TestHelper<AppComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([AppComponent]);
  
      fixture = TestBed.createComponent(AppComponent);
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
  
    it(`should have the 'DnDGen' icon`, () => {
      fixture.detectChanges();
      helper.expectAttribute('link', 'rel', 'icon');
      helper.expectAttribute('link', 'type', 'image/png');
      // helper.expectAttribute('link', 'href', '/assets/dndgen-icon.png');
      helper.expectAttribute('link', 'href', 'https://theonlysheet.com/community/images/smilies/d20.png');
    });
  
    it('should render the navigation bar', () => {
      fixture.detectChanges();
      helper.expectLink('a.navbar-brand', 'DnDGen', '/', false);
    });
  
    it('should render the router outlet', () => {
      fixture.detectChanges();
      helper.expectExists('router-outlet');
    });

    describe('routing', () => {
      let harness: RouterTestingHarness;
      
      beforeEach(async () => {
        harness = await RouterTestingHarness.create();
      });

      describe('by url', () => {
        it('routes to the root page', async () => {
          await harness.navigateByUrl('/');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the home page', async () => {
          await harness.navigateByUrl('/home');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Welcome!');
        });
        
        it('routes to the error page', async () => {
          await harness.navigateByUrl('/error');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
        
        it('routes to the RollGen page', async () => {
          await harness.navigateByUrl('/roll');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('RollGen');
        });
        
        it('routes to the TreasureGen page', async () => {
          await harness.navigateByUrl('/treasure');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('TreasureGen');
        });
        
        it('routes to the CharacterGen page', async () => {
          await harness.navigateByUrl('/character');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('CharacterGen');
        });
        
        it('routes to the EncounterGen page', async () => {
          await harness.navigateByUrl('/encounter');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('EncounterGen');
        });
        
        it('routes to the DungeonGen page', async () => {
          await harness.navigateByUrl('/dungeon');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('DungeonGen');
        });
        
        it('routes a bad url', async () => {
          await harness.navigateByUrl('/whatever');
          const heading = harness.routeNativeElement?.querySelector('h1');
          expect(heading?.textContent).toBe('Critical Miss');
        });
      });
    });
  });
});
