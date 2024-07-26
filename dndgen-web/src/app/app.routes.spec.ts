import { routes } from './app.routes';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';

describe('routes', () => {
  describe('unit', () => {
    it('should contain all routes', () => {
      expect(routes.length).toEqual(3);
    });
    
    it('should contain default route', () => {
      let defaultRoute = routes.find(r => r.path == '');
      expect(defaultRoute).toBeDefined();
      expect(defaultRoute?.path).toEqual('');
      expect(defaultRoute?.component).toEqual(HomeComponent);
      expect(defaultRoute?.pathMatch).toEqual('full');
    });
    
    it('should contain home route', () => {
      let homeRoute = routes.find(r => r.path == 'home');
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.path).toEqual('home');
      expect(homeRoute?.redirectTo).toEqual('/');
      expect(homeRoute?.pathMatch).toEqual('full');
    });
    
    it('should contain error route', () => {
      let errorRoute = routes.find(r => r.path == '**');
      expect(errorRoute).toBeDefined();
      expect(errorRoute?.path).toEqual('**');
      expect(errorRoute?.component).toEqual(ErrorComponent);
      expect(errorRoute?.pathMatch).toEqual('full');
    });
  });
});
