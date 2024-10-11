import { Creature } from "../models/creature.model";
import { CreaturePipe } from "./creature.pipe";

describe('Creature Pipe', () => {
    describe('unit', () => {
        let pipe: CreaturePipe;

        beforeEach(() => {
            pipe = new CreaturePipe();
        });

        it('formats creature name', () => {
            const creature = new Creature('my name', '');
            const formattedCreature = pipe.transform(creature);
            expect(formattedCreature).toEqual('my name');
        });

        it('formats creature name and description', () => {
            const creature = new Creature('my name', 'my description');
            const formattedCreature = pipe.transform(creature);
            expect(formattedCreature).toEqual('my name (my description)');
        });
    });
});