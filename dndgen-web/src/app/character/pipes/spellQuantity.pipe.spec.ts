import { SpellQuantity } from "../models/spellQuantity.model";
import { SpellGroupService } from "../services/spellGroup.service";
import { SpellQuantityPipe } from "./spellQuantity.pipe";

describe('Spell Quantity Pipe', () => {
    describe('unit', () => {
        let pipe: SpellQuantityPipe;
        let spellQuantity: SpellQuantity;
        let spellGroupServiceSpy: jasmine.SpyObj<SpellGroupService>;
    
        beforeEach(() => {
            spellGroupServiceSpy = jasmine.createSpyObj('SpellGroupService', ['getSpellGroupName']);
            spellQuantity = new SpellQuantity('my source', 9, 2);
            pipe = new SpellQuantityPipe(spellGroupServiceSpy);
            
            spellGroupServiceSpy.getSpellGroupName.and.callFake((level, source) => {
                return `${source} lvl ${level}`;
            });
        });

        it('formats spell quantity', () => {
            var formattedSpellQuantity = pipe.transform(spellQuantity);
            expect(formattedSpellQuantity).toEqual('my source lvl 9: 2');
        });

        it('formats spell quantity with domain spell', () => {
            spellQuantity.hasDomainSpell = true;
            var formattedSpellQuantity = pipe.transform(spellQuantity);
            expect(formattedSpellQuantity).toEqual('my source lvl 9: 2 + 1');
        });
    });
});