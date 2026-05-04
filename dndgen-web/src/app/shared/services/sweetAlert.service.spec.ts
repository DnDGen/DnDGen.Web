import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SweetAlertService } from './sweetAlert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('SweetAlert Service', () => {
  describe('unit', () => {
    let service: SweetAlertService;
    let sweetAlertSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      sweetAlertSpy = vi.spyOn(Swal, 'fire').mockResolvedValue({} as SweetAlertResult);

      service = new SweetAlertService();
    });

    it('should show a sweet alert error', () => {
        service.showError();
        expect(sweetAlertSpy).toHaveBeenCalledWith(
          'Critical Miss',
          "Well, this is embarassing. DnDGen rolled a Nat 1. We've complained loudly to the DM (the development team), and they will fix this problem as soon as they can.", 
          'error');
    });
  });
});
