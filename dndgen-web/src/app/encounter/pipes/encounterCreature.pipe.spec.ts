import { Creature } from "../models/creature.model";
import { EncounterCreature } from "../models/encounterCreature.model";
import { CreaturePipe } from "./creature.pipe";
import { EncounterCreaturePipe } from "./encounterCreature.pipe";

describe('EncounterCreature Pipe', () => {
    describe('unit', () => {
        let pipe: EncounterCreaturePipe;
        let creaturePipeSpy: jasmine.SpyObj<CreaturePipe>;

        beforeEach(() => {
            creaturePipeSpy = jasmine.createSpyObj('CreaturePipe', ['transform']);
            pipe = new EncounterCreaturePipe(creaturePipeSpy);
            
            creaturePipeSpy.transform.and.callFake((creature) => {
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