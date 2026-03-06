import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestHelper } from './testHelper.spec';
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

  describe('diagnostics', () => {
    
    it('should confirm Zone.js is loaded and defined', () => {
      expect(typeof Zone).toBe('function');
      expect(Zone).toBeDefined();
    });

    it('should confirm Angular zone is active', () => {
      const currentZone = Zone.current;
      expect(currentZone).toBeDefined();
      expect(currentZone.name).toBeTruthy();
      
      let isAngularZone = false;
      let zone: any = currentZone;
      while (zone) {
        if (zone.name.includes('angular') || zone.name.includes('Angular')) {
          isAngularZone = true;
          break;
        }
        zone = zone.parent;
      }
      
      expect(isAngularZone || currentZone.name === 'ProxyZone').toBe(true);
    });

    it('should intercept setTimeout operations', fakeAsync(() => {
      let callbackExecuted = false;
      let zoneIntercepted = false;
      
      const originalSchedule = Zone.current.scheduleMacroTask;
      spyOn(Zone.current, 'scheduleMacroTask').and.callFake((...args: any[]) => {
        zoneIntercepted = true;
        return originalSchedule.apply(Zone.current, args);
      });
      
      setTimeout(() => {
        callbackExecuted = true;
      }, 100);
      
      expect(zoneIntercepted).toBe(true);
      
      tick(100);
      
      expect(callbackExecuted).toBe(true);
    }));

    it('should intercept Promise operations', (done) => {
      let promiseResolved = false;
      const startZone = Zone.current;
      
      Promise.resolve('test').then((value) => {
        promiseResolved = true;
        const promiseZone = Zone.current;
        
        expect(promiseZone).toBe(startZone);
        
        done();
      });
      
      expect(promiseResolved).toBe(false);
    });

    it('should track async operations with Zone.js', fakeAsync(() => {
      let asyncOperationCount = 0;
      
      setTimeout(() => asyncOperationCount++, 10);
      setTimeout(() => asyncOperationCount++, 20);
      setTimeout(() => asyncOperationCount++, 30);
      
      expect(asyncOperationCount).toBe(0);
      
      tick(10);
      expect(asyncOperationCount).toBe(1);
      
      tick(10);
      expect(asyncOperationCount).toBe(2);
      
      tick(10);
      expect(asyncOperationCount).toBe(3);
    }));

    it('should detect if Zone.js patches are active', () => {
      const patches = {
        'setTimeout': typeof (setTimeout as any).__zone_symbol__ !== 'undefined',
        'Promise': typeof (Promise as any).__zone_symbol__ !== 'undefined',
        'XMLHttpRequest': typeof (XMLHttpRequest as any).__zone_symbol__ !== 'undefined',
      };
      
      const criticalPatchesActive = patches.setTimeout || patches.Promise;
      
      expect(criticalPatchesActive).toBe(true);
    });

    it('should run callbacks in the correct zone context', fakeAsync(() => {
      const testZone = Zone.current.fork({ name: 'test-zone' });
      let callbackZone: any;
      
      testZone.run(() => {
        setTimeout(() => {
          callbackZone = Zone.current;
        }, 10);
      });
      
      tick(10);
      
      expect(callbackZone).toBeDefined();
      expect(callbackZone!.name).toBe('test-zone');
    }));
  });
});
