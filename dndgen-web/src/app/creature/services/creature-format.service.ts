import { Injectable } from '@angular/core';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { CreatureType } from '../models/creature-type.model';
import { CreatureAbility } from '../models/creature-ability.model';
import { Save } from '../models/save.model';
import { Bonus } from '../models/bonus.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { Attack } from '../models/attack.model';
import { Demographics } from '../models/demographics.model';

export interface LabeledMeasurement {
  label: string;
  measurement: CreatureMeasurement;
}

export interface LabeledText {
  label: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreatureFormatService {
  constructor(private bonusPipe: BonusPipe, private spellGroupService: SpellGroupService) { }

  public readonly abilityNames = ['Strength', 'Constitution', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma'];
  public readonly saveNames = ['Fortitude', 'Reflex', 'Will'];
  private readonly none = '—';

  public type(type: CreatureType): string {
    if (!type.subTypes.length)
      return type.name;

    return `${type.name} (${type.subTypes.join(', ')})`;
  }

  public templates(templates: string[]): string {
    if (!templates.length)
      return 'None';

    return templates.join(', ');
  }

  public optionalBonus(value?: number | null): string {
    if (value == null)
      return this.none;

    return this.bonusPipe.transform(value);
  }

  public ability(name: string, ability: CreatureAbility): string {
    if (!ability.hasScore)
      return `${name}: ${this.none}`;

    return `${name}: ${ability.fullScore} (${this.bonusPipe.transform(ability.modifier)})`;
  }

  public save(name: string, save: Save): string {
    if (!save.hasSave)
      return `${name}: ${this.none}`;

    return `${name}: ${this.bonusPipe.transform(save.totalBonus, save.isConditional)}`;
  }

  public conditionalBonuses(bonuses: Bonus[]): string[] {
    return bonuses
      .filter(bonus => bonus.isConditional)
      .map(bonus => `${this.bonusPipe.transform(bonus.value)} ${bonus.condition}`);
  }

  public skillName(skill: CreatureSkill): string {
    if (!skill.focus)
      return skill.name;

    return `${skill.name} (${skill.focus})`;
  }

  public sortedSkills(skills: CreatureSkill[]): CreatureSkill[] {
    return [...skills].sort((a, b) => this.compare(this.skillName(a), this.skillName(b)));
  }

  public speeds(speeds: { [movement: string]: CreatureMeasurement }): LabeledMeasurement[] {
    return Object.keys(speeds).map(movement => ({ label: movement, measurement: speeds[movement] }));
  }

  public attackType(attack: Attack): string {
    if (attack.isSpecial)
      return attack.attackType;

    const natural = attack.isNatural ? 'Natural' : 'Manufactured';
    const primary = attack.isPrimary ? 'Primary' : 'Secondary';

    return `${natural} ${attack.attackType} (${primary})`;
  }

  public isConditional(bonuses: Bonus[]): boolean {
    return bonuses.some(bonus => bonus.isConditional);
  }

  public standardAttacks(attacks: Attack[]): Attack[] {
    return attacks.filter(attack => !attack.isSpecial);
  }

  public spellQuantity(quantity: CreatureSpellQuantity): SpellQuantity {
    return new SpellQuantity(quantity.source, quantity.level, quantity.quantity + quantity.bonusSpells, quantity.hasDomainSpell);
  }

  public spellGroups(spells: CreatureSpell[]): SpellGroup[] {
    const characterSpells = spells.map(spell => new Spell({ [spell.source]: spell.level }, spell.name, spell.metamagic));
    return this.spellGroupService.sortIntoGroups(characterSpells);
  }

  public demographicMeasurements(demographics: Demographics): LabeledMeasurement[] {
    const measurements = [
      { label: 'Age', measurement: demographics.age },
      { label: 'Maximum Age', measurement: demographics.maximumAge },
    ];

    const optional = [
      { label: 'Height', measurement: demographics.height },
      { label: 'Length', measurement: demographics.length },
      { label: 'Weight', measurement: demographics.weight },
      { label: 'Wingspan', measurement: demographics.wingspan },
    ];

    return [...measurements, ...optional.filter(m => m.measurement.value > 0)];
  }

  public demographicDescriptions(demographics: Demographics): LabeledText[] {
    const descriptions = [
      { label: 'Skin', text: demographics.skin },
      { label: 'Hair', text: demographics.hair },
      { label: 'Eyes', text: demographics.eyes },
      { label: 'Other', text: demographics.other },
    ];

    return descriptions.filter(description => description.text);
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
}
