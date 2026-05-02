import { Creature } from "../models/creature.model";
import { EncounterCreature } from "../models/encounterCreature.model";
import { CreaturePipe } from "./creature.pipe";
import { EncounterCreaturePipe } from "./encounterCreature.pipe";

describe('EncounterCreature Pipe', () => {
    describe('unit', () => {
        let pipe: EncounterCreaturePipe;
        let creaturePipeSpy: { transform: ReturnType<typeof vi.fn> };

        beforeEach(() => {
            creaturePipeSpy = { transform: vi.fn() };
            pipe = new EncounterCreaturePipe(creaturePipeSpy as unknown as CreaturePipe);
            
            creaturePipeSpy.transform.mockImplementation((creature) => {
                return `formatted ${creature.name}`;
            });
        });

        it('formats encounter creature', () => {
            const creature = new Creature('my name', '');
            const encounterCreature = new EncounterCreature(creature, 9266, 'CR whatever');
            const formattedEncounterCreature = pipe.transform(encounterCreature);
            expect(formattedEncounterCreature).toEqual('formatted my name x9266');
        });
    });
});