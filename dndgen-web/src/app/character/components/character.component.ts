import { Input, Component } from '@angular/core';
import { Character } from '../models/character.model';
import { DecimalPipe } from '@angular/common';
import { Spell } from '../models/spell.model';
import { SpellGroupService } from '../services/spellGroup.service';
import { SpellGroup } from '../models/spellGroup.model';
import { InchesToFeetPipe } from '../pipes/inchesToFeet.pipe';
import { Skill } from '../models/skill.model';
import { SpellQuantityPipe } from '../pipes/spellQuantity.pipe';
import { MeasurementPipe } from '../pipes/measurement.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { TreasureComponent } from '../../treasure/components/treasure.component';
import { ItemComponent } from '../../treasure/components/item.component';
import { SpellGroupComponent } from './spellGroup.component';
import { FeatComponent } from './feat.component';
import { DetailsComponent } from '../../shared/components/details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-character',
    templateUrl: './character.component.html',
    standalone: true,
    providers: [
      DecimalPipe,
      InchesToFeetPipe,
    ],
    imports: [
      DetailsComponent, 
      FeatComponent,
      SpellGroupComponent, 
      ItemComponent, 
      TreasureComponent,
      InchesToFeetPipe,
      MeasurementPipe, 
      SpellQuantityPipe,
      BonusPipe,
      BonusesPipe,
      DecimalPipe,
      NgbModule,
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

  public getSkillDisplayName(skill: Skill): string {
      if (!skill.focus)
        return skill.name;
  
      return `${skill.name} (${skill.focus})`;
  }
  
  public get sortedSkills(): Skill[] {
    return this.character.skills.sort((a, b) => this.compare(this.getSkillDisplayName(a), this.getSkillDisplayName(b)));
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
    const aa = a?.toLowerCase() ?? '';
    const bb = b?.toLowerCase() ?? '';

    if ( aa < bb ){
      return -1;
    }

    if ( aa > bb ){
      return 1;
    }

    return 0;
  }
}
