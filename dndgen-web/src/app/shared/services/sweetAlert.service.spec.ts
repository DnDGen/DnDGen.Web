import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SweetAlertService } from './sweetAlert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('SweetAlert Service', () => {
  describe('unit', () => {
    let service: SweetAlertService;
    let spy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      spy = vi.spyOn(Swal, 'fire').mockResolvedValue({} as SweetAlertResult);

      service = new SweetAlertService();
    });

    it('should show a sweet alert error', () => {
        service.showError();
        expect(spy).toHaveBeenCalledWith('Critical Miss', expect.any(String), 'error');
        expect((spy.mock.calls[0] as any[])[1]).toBeDefined();
        expect((spy.mock.calls[0] as any[])[1]).not.toBe('');
    });
  });
});
