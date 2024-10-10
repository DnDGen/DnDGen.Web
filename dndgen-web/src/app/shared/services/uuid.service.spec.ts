import { UuidService } from './uuid.service';

describe('Uuid Service', () => {
  describe('integration', () => {
    let service: UuidService;

    beforeEach(() => {
      service = new UuidService();
    });

    it('should generate a uuid', async () => {
      const id = service.generate();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should generate unique uuids', async () => {
      const id1 = service.generate();
      const id2 = service.generate();
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(id2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(id1).not.toEqual(id2);
    });
  });
});
