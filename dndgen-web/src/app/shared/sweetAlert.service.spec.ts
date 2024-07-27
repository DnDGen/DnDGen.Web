import { SweetAlertService } from './sweetAlert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('SweetAlertService', () => {
  describe('unit', () => {
    let service: SweetAlertService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(Swal, 'fire').and.resolveTo(<SweetAlertResult>({}));

      service = new SweetAlertService();
    });

    it('should show a sweet alert error', () => {
        service.showError();
        expect(spy).toHaveBeenCalledWith('Critical Miss', jasmine.any(String), 'error');
        expect(spy.calls.argsFor(0)[1]).toBeDefined();
        expect(spy.calls.argsFor(0)[1]).not.toBe('');
    });
  });
});
