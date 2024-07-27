import { LoggerService } from './logger.service';

describe('SweetAlertService', () => {
  describe('unit', () => {
    let service: LoggerService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(console, 'error');

      service = new LoggerService();
    });

    it('should log the error to the console', () => {
        service.logError('this is my error');
        expect(spy).toHaveBeenCalledWith('this is my error');
    });
  });
});
