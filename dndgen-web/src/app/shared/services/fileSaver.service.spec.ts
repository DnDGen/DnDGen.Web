import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileSaverService } from './fileSaver.service';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

import * as FileSaver from 'file-saver';

describe('FileSaver Service', () => {
  describe('unit', () => {
    let service: FileSaverService;

    beforeEach(() => {
      vi.clearAllMocks();
      service = new FileSaverService();
    });

    it('should save the data as a blob', async () => {
      service.save('this is my content', 'my file');
      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), 'my file.txt');
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);

      const blob = (vi.mocked(FileSaver.saveAs)).mock.calls[0][0] as Blob;
      expect(blob.type).toEqual('text/plain;charset=utf-8');

      const text = await blob.text();
      expect(text).toEqual('this is my content');
    });
  });
});
