import { routes } from './app.routes';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { RollComponent } from './roll/roll.component';

describe('routes', () => {
  describe('unit', () => {
    it('should contain all routes', () => {
      expect(routes.length).toEqual(3);
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
      expect(route?.component).toEqual(RollComponent);
      expect(route?.pathMatch).toEqual('full');
    });
    
    it('should contain error route', () => {
      let route = routes.find(r => r.path == '**');
      expect(route).toBeDefined();
      expect(route?.path).toEqual('**');
      expect(route?.component).toEqual(ErrorComponent);
      expect(route?.pathMatch).toEqual('full');
    });
  });
});
