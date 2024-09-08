import { Input, Component } from '@angular/core';
import { Character } from '../models/character.model';
import { DecimalPipe } from '@angular/common';
import { Spell } from '../models/spell.model';
import { SpellGroupService } from '../services/spellGroup.service';
import { SpellGroup } from '../models/spellGroup.model';
import { InchesToFeetPipe } from '../pipes/inchesToFeet.pipe';
import { Skill } from '../models/skill.model';

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
  
  public get sortedSkills(): Skill[] {
    return this.character.skills.sort((a, b) => this.compare(a.displayName, b.displayName));
  }

  public get offHandHeading(): string {
    if (!this.character.equipment.offHand)
      return 'Off Hand: None';

    if (this.isTwoHanded())
      return 'Off Hand: (Two-Handed)';

    return 'Off Hand';
  }

  public get offHandDetails(): boolean {
    return this.character.equipment.offHand != null && !this.isTwoHanded();
  }

  private compare(a: string, b: string) {
    if ( a.toLowerCase() < b.toLowerCase() ){
      return -1;
    }
    if ( a.toLowerCase() > b.toLowerCase() ){
      return 1;
    }
    return 0;
  }
}
