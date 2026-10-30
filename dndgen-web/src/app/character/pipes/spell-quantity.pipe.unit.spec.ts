import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpellQuantity } from "../models/spell-quantity.model";
import { SpellGroupService } from "../services/spell-group.service";
import { SpellQuantityPipe } from "./spell-quantity.pipe";

describe('Spell Quantity Pipe', () => {
    describe('unit', () => {
        let pipe: SpellQuantityPipe;
        let spellQuantity: SpellQuantity;
        let spellGroupServiceSpy: { getSpellGroupName: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            spellGroupServiceSpy = { getSpellGroupName: vi.fn() };
            spellQuantity = new SpellQuantity('my source', 9, 2);
            pipe = new SpellQuantityPipe(spellGroupServiceSpy as unknown as SpellGroupService);
            
            spellGroupServiceSpy.getSpellGroupName.mockImplementation((level: number, source: string) => {
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