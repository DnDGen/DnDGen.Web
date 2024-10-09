import { FileSaverService } from './fileSaver.service';
import * as FileSaver from 'file-saver';

describe('FileSaver Service', () => {
  describe('unit', () => {
    let service: FileSaverService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(FileSaver, 'saveAs').and.stub();

      service = new FileSaverService();
    });

    it('should save the data as a blob', async () => {
      service.save('this is my content', 'my file');
      expect(spy).toHaveBeenCalledWith(jasmine.any(Blob), 'my file.txt');
      expect(spy).toHaveBeenCalledTimes(1);

      const blob = spy.calls.first().args[0] as Blob;
      expect(blob.type).toEqual('text/plain;charset=utf-8');

      const text = await blob.text();
      expect(text).toEqual('this is my content');
    });
  });
});
