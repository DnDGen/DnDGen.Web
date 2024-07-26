import { SweetAlertService } from './sweetAlert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('SweetAlertService', () => {
  describe('unit', () => {
    let service: SweetAlertService;

    beforeEach(() => {
      service = new SweetAlertService();
    });

    it('should show a sweet alert error', () => {
        let spy = spyOn(Swal, 'fire').and.resolveTo(SweetAlertResult<Any>);

        service.showError();
        expect(spy).toHaveBeenCalledWith('Critical Miss', '', 'error');
    });
  });
});
