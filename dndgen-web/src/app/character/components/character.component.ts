import { Input, Component } from '@angular/core';
import { Character } from '../models/character.model';
import { DecimalPipe } from '@angular/common';
import { Spell } from '../models/spell.model';
import { SpellGroupService } from '../services/spellGroup.service';
import { SpellGroup } from '../models/spellGroup.model';
import { InchesToFeetPipe } from '../pipes/inchesToFeet.pipe';

@Component({
  selector: 'dndgen-character',
  templateUrl: './character.component.html',
  providers: [
    DecimalPipe,
    InchesToFeetPipe,
  ]
})

export class CharacterComponent {
  constructor(private spellGroupService: SpellGroupService) { }

  @Input() character!: Character;

  public isTwoHanded(): boolean {
    if (!this.character.equipment.primaryHand)
      return false;

    return this.character.equipment.primaryHand!.attributes.indexOf('Two-Handed') > -1;
  }

  public getSpellGroups(spells: Spell[]): SpellGroup[] {
    return this.spellGroupService.sortIntoGroups(spells);
  }
}
