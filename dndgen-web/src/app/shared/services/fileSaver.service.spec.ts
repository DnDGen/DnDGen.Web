import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileSaverService } from './fileSaver.service';
import FileSaver from 'file-saver';

describe('FileSaver Service', () => {
  describe('unit', () => {
    let service: FileSaverService;
    let fileSaverSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      vi.clearAllMocks();
      
      fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});
      service = new FileSaverService();
    });

    it('should save the data as a blob', async () => {
      service.save('this is my content', 'my file');
      expect(fileSaverSpy).toHaveBeenCalledWith(expect.any(Blob), 'my file.txt');
      expect(fileSaverSpy).toHaveBeenCalledTimes(1);

      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      expect(blob.type).toEqual('text/plain;charset=utf-8');

      const text = await blob.text();
      expect(text).toEqual('this is my content');
    });
  });
});
