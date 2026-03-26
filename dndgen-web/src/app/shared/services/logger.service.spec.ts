import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoggerService } from './logger.service';

describe('Logger Service', () => {
  describe('unit', () => {
    let service: LoggerService;
    let spy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      service = new LoggerService();
    });

    it('should log the error to the console', () => {
        service.logError('this is my error');
        expect(spy).toHaveBeenCalledWith('this is my error');
    });
  });
});
