import { routes } from './app.routes';
import { CharacterGenComponent } from './character/components/charactergen.component';
import { DungeonGenComponent } from './dungeon/components/dungeongen.component';
import { EncounterGenComponent } from './encounter/components/encountergen.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { RollGenComponent } from './roll/components/rollgen.component';
import { TreasureGenComponent } from './treasure/components/treasuregen.component';

describe('App Routes', () => {
  describe('unit', () => {
    it('should contain all routes', () => {
      expect(routes.length).toEqual(7);
    });
    
    it('should contain default route', () => {
      let route = routes.find(r => r.path == '');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('');
      expect(route?.component).toEqual(HomeComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain home route', () => {
      let route = routes.find(r => r.path == 'home');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('home');
      expect(route?.redirectTo).toEqual('/');
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain roll route', () => {
      let route = routes.find(r => r.path == 'roll');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('roll');
      expect(route?.component).toEqual(RollGenComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain treasure route', () => {
      let route = routes.find(r => r.path == 'treasure');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('treasure');
      expect(route?.component).toEqual(TreasureGenComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain character route', () => {
      let route = routes.find(r => r.path == 'character');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('character');
      expect(route?.component).toEqual(CharacterGenComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain encounter route', () => {
      let route = routes.find(r => r.path == 'encounter');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('encounter');
      expect(route?.component).toEqual(EncounterGenComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain dungeon route', () => {
      let route = routes.find(r => r.path == 'dungeon');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('dungeon');
      expect(route?.component).toEqual(DungeonGenComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain error route', () => {
      let route = routes.find(r => r.path == '**');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('**');
      expect(route?.component).toEqual(ErrorComponent);
      expect(route?.pathMatch).toEqual('full');

      expect(route).toBe(routes[routes.length - 1]);
    });
  });
});
