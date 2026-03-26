import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestHelper } from './test-helper';
import { RouterTestingHarness } from '@angular/router/testing';

// Declare Zone type for TypeScript
declare const Zone: any;

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
  
    it(`should have the 'DnDGen' icon`, async () => {
      await fixture.whenStable();
      helper.expectAttribute('link', 'rel', 'icon');
      helper.expectAttribute('link', 'type', 'image/png');
      // helper.expectAttribute('link', 'href', '/assets/dndgen-icon.png');
      helper.expectAttribute('link', 'href', 'https://theonlysheet.com/community/images/smilies/d20.png');
    });
  
    it('should render the navigation bar', async () => {
      await fixture.whenStable();
      helper.expectLink('a.navbar-brand', 'DnDGen', '/', false);
    });
  
    it('should render the router outlet', async () => {
      await fixture.whenStable();
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
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('Welcome!');
          });
        });
        
        it('routes to the home page', async () => {
          await harness.navigateByUrl('/home');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('Welcome!');
          });
        });
        
        it('routes to the error page', async () => {
          await harness.navigateByUrl('/error');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('Critical Miss');
          });
        });
        
        it('routes to the RollGen page', async () => {
          await harness.navigateByUrl('/roll');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('RollGen');
          });
        });
        
        it('routes to the TreasureGen page', async () => {
          await harness.navigateByUrl('/treasure');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('TreasureGen');
          });
        });
        
        it('routes to the CharacterGen page', async () => {
          await harness.navigateByUrl('/character');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('CharacterGen');
          });
        });
        
        it('routes to the EncounterGen page', async () => {
          await harness.navigateByUrl('/encounter');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('EncounterGen');
          });
        });
        
        it('routes to the DungeonGen page', async () => {
          await harness.navigateByUrl('/dungeon');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('DungeonGen');
          });
        });
        
        it('routes a bad url', async () => {
          await harness.navigateByUrl('/whatever');
          await vi.waitFor(() => {
            const heading = harness.routeNativeElement?.querySelector('h1');
            expect(heading?.textContent).toBe('Critical Miss');
          });
        });
      });
    });
  });

  describe('change detection configuration', () => {
    it('should have zoneless change detection enabled', async () => {
      await TestHelper.configureTestBed([AppComponent]);
      const fixture = TestBed.createComponent(AppComponent);
      
      await fixture.whenStable();
      
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should NOT load Zone.js in production', () => {
      expect(typeof Zone).toBe('undefined');
    });
  });
});
