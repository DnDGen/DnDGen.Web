import { Input, Component } from '@angular/core';
import { Creature } from '../models/creature.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { DecimalPipe } from '@angular/common';
import { InchesToFeetPipe } from '../../character/pipes/inches-to-feet.pipe';
import { FeatComponent } from '../../character/components/feat.component';
import { ItemComponent } from '../../treasure/components/item.component';
import { SpellGroupComponent } from '../../character/components/spell-group.component';
import { AttackComponent } from './attack.component';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { Attack } from '../models/attack.model';
import { Bonus } from '../models/bonus.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { CreatureTypePipe } from '../pipes/creature-type.pipe';
import { HitDicePipe } from '../pipes/hit-dice.pipe';
import { SpeedPipe } from '../pipes/speed.pipe';
import { ArmorClassPipe } from '../pipes/armor-class.pipe';
import { OptionalBonusPipe } from '../pipes/optional-bonus.pipe';
import { FullAttackPipe } from '../pipes/full-attack.pipe';
import { SavesPipe } from '../pipes/saves.pipe';
import { AbilitiesPipe } from '../pipes/abilities.pipe';
import { SkillPipe } from '../pipes/skill.pipe';
import { ConditionalBonusPipe } from '../pipes/conditional-bonus.pipe';
import { AttackPipe } from '../pipes/attack.pipe';
import { AgePipe } from '../pipes/age.pipe';
import { MaximumAgePipe } from '../pipes/maximum-age.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { Feat } from '../../character/models/feat.model';

@Component({
    selector: 'dndgen-creature',
    templateUrl: './creature.component.html',
    standalone: true,
    providers: [
      DecimalPipe,
      InchesToFeetPipe,
      AttackPipe,
      AgePipe,
    ],
    imports: [
      DetailsComponent,
      FeatComponent,
      ItemComponent,
      SpellGroupComponent,
      AttackComponent,
      BonusPipe,
      MeasurementPipe,
      SpellQuantityPipe,
      CreatureTypePipe,
      HitDicePipe,
      SpeedPipe,
      ArmorClassPipe,
      OptionalBonusPipe,
      FullAttackPipe,
      SavesPipe,
      AbilitiesPipe,
      SkillPipe,
      ConditionalBonusPipe,
      AgePipe,
      MaximumAgePipe,
      FrequencyPipe,
    ]
})

export class CreatureComponent {
  constructor(private spellGroupService: SpellGroupService) { }

  @Input() creature!: Creature;

  public readonly saveNames = ['Fortitude', 'Reflex', 'Will'];

  public get attackOptions(): Attack[] {
    return this.creature.attacks
      .filter(attack => !attack.isSpecial)
      .filter((attack, index, attacks) => attacks.findIndex(other => this.isSameAttack(attack, other)) == index);
  }

  private isSameAttack(attack: Attack, other: Attack): boolean {
    return attack.name == other.name
      && attack.attackType == other.attackType
      && attack.totalAttackBonus == other.totalAttackBonus
      && attack.damageSummary == other.damageSummary;
  }

  public get spellLikeAbilities(): Feat[] {
    return this.creature.specialQualities.filter(quality => quality.name == 'Spell-Like Ability');
  }

  public get fullAttackOptions(): Attack[][] {
    return [this.creature.fullMeleeAttack, this.creature.fullRangedAttack]
      .filter(attacks => attacks.length > 0);
  }

  public get sortedSkills(): CreatureSkill[] {
    return [...this.creature.skills].sort((a, b) => this.compare(this.getSkillDisplayName(a), this.getSkillDisplayName(b)));
  }

  private getSkillDisplayName(skill: CreatureSkill): string {
    if (!skill.focus)
      return skill.name;

    return `${skill.name} (${skill.focus})`;
  }

  private compare(a: string, b: string): number {
    const aa = a.toLowerCase();
    const bb = b.toLowerCase();

    if (aa < bb)
      return -1;

    if (aa > bb)
      return 1;

    return 0;
  }

  public getConditionalBonuses(bonuses: Bonus[]): Bonus[] {
    return bonuses.filter(bonus => bonus.isConditional);
  }

  public get hasConditionalSaves(): boolean {
    return this.saveNames.some(name => this.getConditionalBonuses(this.creature.saves[name].bonuses).length > 0);
  }

  public getSpellQuantity(quantity: CreatureSpellQuantity): SpellQuantity {
    return new SpellQuantity(quantity.source, quantity.level, quantity.totalQuantity, quantity.hasDomainSpell);
  }

  public getSpellGroups(spells: CreatureSpell[]): SpellGroup[] {
    const characterSpells = spells.map(spell => new Spell({ [spell.source]: spell.level }, spell.name, spell.metamagic));
    return this.spellGroupService.sortIntoGroups(characterSpells);
  }
}
