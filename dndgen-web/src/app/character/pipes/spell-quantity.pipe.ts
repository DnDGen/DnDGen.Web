import { Pipe, PipeTransform } from '@angular/core';
import { SpellQuantity } from '../models/spell-quantity.model';
import { SpellGroupService } from '../services/spell-group.service';

@Pipe({
    name: 'spellQuantity',
    standalone: true
})
export class SpellQuantityPipe implements PipeTransform {
    constructor(private spellGroupService: SpellGroupService) { }

    transform(value: SpellQuantity): string {
        const groupName = this.spellGroupService.getSpellGroupName(value.level, value.source);
        let quantity = `${groupName}: ${value.quantity}`;

        if (value.hasDomainSpell) {
            quantity += ' + 1';
        }

        return quantity;
    }
}
