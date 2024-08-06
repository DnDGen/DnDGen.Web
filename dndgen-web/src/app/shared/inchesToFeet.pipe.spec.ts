import { InchesToFeetPipe } from './inchesToFeet.pipe';

describe('InchesToFeetPipe', () => {
  describe('unit', () => {
    let pipe: InchesToFeetPipe;

    beforeEach(() => {
      pipe = new InchesToFeetPipe();
    });

    it('should return empty', () => {
        var feet = pipe.transform(0);
        expect(feet).toEqual('');
    });

    it('should return 1 inch', () => {
        var feet = pipe.transform(1);
        expect(feet).toEqual('1"');
    });

    it('should return 2 inches', () => {
        var feet = pipe.transform(2);
        expect(feet).toEqual('2"');
    });

    it('should return 10 inches', () => {
        var feet = pipe.transform(10);
        expect(feet).toEqual('10"');
    });

    it('should return 11 inches', () => {
        var feet = pipe.transform(11);
        expect(feet).toEqual('11"');
    });

    it('should return 1 foot', () => {
        var feet = pipe.transform(12);
        expect(feet).toEqual('1\'');
    });

    it('should return 1 foot 1 inch', () => {
        var feet = pipe.transform(13);
        expect(feet).toEqual('1\' 1"');
    });

    it('should return 1 foot 11 inches', () => {
        var feet = pipe.transform(23);
        expect(feet).toEqual('1\' 11"');
    });

    it('should return 2 feet', () => {
        var feet = pipe.transform(24);
        expect(feet).toEqual('2\'');
    });

    it('should return 5 feet 11 inches', () => {
        var feet = pipe.transform(71);
        expect(feet).toEqual('5\' 11"');
    });

    it('should return 772 feet 2 inches', () => {
        var feet = pipe.transform(9266);
        expect(feet).toEqual('772\' 2"');
    });
  });
});
