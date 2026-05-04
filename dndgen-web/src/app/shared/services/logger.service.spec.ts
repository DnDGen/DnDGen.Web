import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoggerService } from './logger.service';

describe('Logger Service', () => {
  describe('unit', () => {
    let service: LoggerService;
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      service = new LoggerService();
    });

    it('should log the error to the console', () => {
        service.logError('this is my error');
        expect(consoleSpy).toHaveBeenCalledWith('this is my error');
    });
  });
});
