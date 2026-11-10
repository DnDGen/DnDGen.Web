import { Pipe, PipeTransform } from '@angular/core';
import { Creature } from '../models/creature.model';
import { CreatureFormatService } from '../services/creature-format.service';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { Item } from '../../treasure/models/item.model';
import { CreatureSkill } from '../models/creature-skill.model';

@Pipe({
    name: 'creature',
    standalone: true
})
export class CreaturePipe implements PipeTransform {
    constructor(
        private format: CreatureFormatService,
        private bonusPipe: BonusPipe,
        private bonusesPipe: BonusesPipe,
        private measurementPipe: MeasurementPipe,
        private frequencyPipe: FrequencyPipe,
        private spellQuantityPipe: SpellQuantityPipe,
        private itemPipe: ItemPipe) { }

    transform(creature: Creature): string {
        let formatted = creature.summary + ':\r\n';

        formatted += this.line('Size: ' + creature.size, '\t');
        formatted += this.line('Type: ' + this.format.type(creature.type), '\t');
        formatted += this.line('Challenge Rating: ' + creature.challengeRating, '\t');
        formatted += this.line('Alignment: ' + creature.alignment.full, '\t');
        formatted += this.line('Level Adjustment: ' + this.format.optionalBonus(creature.levelAdjustment), '\t');
        formatted += this.line('Templates: ' + this.format.templates(creature.templates), '\t');

        formatted += this.line('Hit Points: ' + creature.hitPoints.total, '\t');
        formatted += this.line('Hit Dice: ' + creature.hitPoints.defaultRoll, '\t\t');
        formatted += this.lines(this.format.conditionalBonuses(creature.hitPoints.conditionalBonuses), '\t\t');

        formatted += this.formatCombat(creature);
        formatted += this.formatAttacks(creature);

        formatted += this.line('Abilities:', '\t');
        formatted += this.lines(this.format.abilityNames.map(name => this.format.ability(name, creature.abilities)), '\t\t');

        formatted += this.formatSkills(creature.skills);
        formatted += this.formatFeats('Feats', creature.feats);
        formatted += this.formatFeats('Special Qualities', creature.specialQualities);
        formatted += this.formatList('Languages', creature.languages);
        formatted += this.formatMagic(creature);
        formatted += this.formatEquipment(creature);
        formatted += this.formatDemographics(creature);

        return formatted;
    }

    private line(text: string, prefix: string): string {
        return prefix + text + '\r\n';
    }

    private lines(texts: (string | null)[], prefix: string): string {
        return texts
            .filter(text => text !== null)
            .map(text => this.line(text!, prefix))
            .join('');
    }

    private formatList(title: string, list: string[]): string {
        if (!list.length)
            return this.line(title + ': None', '\t');

        return this.line(title + ':', '\t') + this.lines(list, '\t\t');
    }

    private formatCombat(creature: Creature): string {
        let formatted = this.line('Combat:', '\t');

        const armorClass = creature.armorClass;
        formatted += this.line('Armor Class: ' + this.bonusPipe.transform(armorClass.totalBonus, armorClass.isConditional, false), '\t\t');
        formatted += this.line('Flat-Footed: ' + armorClass.flatFootedBonus, '\t\t\t');
        formatted += this.line('Touch: ' + armorClass.touchBonus, '\t\t\t');
        formatted += this.lines(this.format.conditionalBonuses(armorClass.bonuses), '\t\t\t');

        formatted += this.line('Initiative Bonus: ' + this.bonusPipe.transform(creature.totalInitiativeBonus), '\t\t');
        formatted += this.line('Base Attack: ' + this.bonusPipe.transform(creature.baseAttackBonus), '\t\t');
        formatted += this.line('Grapple: ' + this.format.optionalBonus(creature.grappleBonus), '\t\t');
        formatted += this.line('Space: ' + this.measurementPipe.transform(creature.space), '\t\t');
        formatted += this.line('Reach: ' + this.measurementPipe.transform(creature.reach), '\t\t');

        formatted += this.line('Speeds:', '\t\t');
        formatted += this.lines(this.format.speeds(creature.speeds).map(speed => `${speed.label}: ${this.measurementPipe.transform(speed.measurement)}`), '\t\t\t');

        formatted += this.line('Saving Throws:', '\t\t');

        for (const saveName of this.format.saveNames) {
            formatted += this.lines([this.format.save(saveName, creature.saves)], '\t\t\t');

            const save = creature.saves[saveName];
            if (save)
                formatted += this.lines(this.format.conditionalBonuses(save.bonuses), '\t\t\t');
        }

        return formatted;
    }

    private formatAttacks(creature: Creature): string {
        let formatted = this.line('Attacks:', '\t');

        formatted += this.formatAttackList('Attacks', this.format.standardAttacks(creature.attacks));
        formatted += this.formatAttackList('Full Melee Attack', creature.fullMeleeAttack);
        formatted += this.formatAttackList('Full Ranged Attack', creature.fullRangedAttack);
        formatted += this.formatAttackList('Special Attacks', creature.specialAttacks);

        return formatted;
    }

    private formatAttackList(title: string, attacks: Attack[]): string {
        if (!attacks.length)
            return this.line(title + ': None', '\t\t');

        let formatted = this.line(title + ':', '\t\t');

        for (const attack of attacks) {
            formatted += this.formatAttack(attack);
        }

        return formatted;
    }

    private formatAttack(attack: Attack): string {
        const prefix = '\t\t\t\t';
        let formatted = this.line(attack.name, '\t\t\t');

        const conditional = attack.attackBonuses.some(bonus => bonus.isConditional);

        if (attack.isSpecial) {
            formatted += this.line('Type: ' + attack.attackType, prefix);
        } else {
            const natural = attack.isNatural ? 'Natural' : 'Manufactured';
            const primary = attack.isPrimary ? 'Primary' : 'Secondary';
            formatted += this.line(`Type: ${natural} ${attack.attackType} (${primary})`, prefix);
            formatted += this.line('Attack Bonus: ' + this.bonusPipe.transform(attack.totalAttackBonus, conditional), prefix);

            if (attack.fullAttackBonuses.length > 1)
                formatted += this.line('Full Attack Bonuses: ' + this.bonusesPipe.transform(attack.fullAttackBonuses, conditional), prefix);
        }

        if (attack.damageSummary)
            formatted += this.line('Damage: ' + attack.damageSummary, prefix);

        if (attack.damageEffect)
            formatted += this.line('Effect: ' + attack.damageEffect, prefix);

        if (attack.frequency.timePeriod)
            formatted += this.line('Frequency: ' + this.frequencyPipe.transform(attack.frequency), prefix);

        return formatted;
    }

    private formatSkills(skills: CreatureSkill[]): string {
        if (!skills.length)
            return this.line('Skills: None', '\t');

        let formatted = this.line('Skills:', '\t');

        for (const skill of this.format.sortedSkills(skills)) {
            formatted += this.line(this.format.skillName(skill), '\t\t');
            formatted += this.line('Total Bonus: ' + this.bonusPipe.transform(skill.totalBonus, skill.circumstantialBonus), '\t\t\t');
            formatted += this.line('Ranks: ' + skill.effectiveRanks, '\t\t\t');
            formatted += this.line('Ability Bonus: ' + skill.baseAbility.modifier, '\t\t\t');
            formatted += this.line('Armor Check Penalty: ' + skill.armorCheckPenalty, '\t\t\t');

            if (skill.classSkill)
                formatted += this.line('Class Skill', '\t\t\t');
        }

        return formatted;
    }

    private formatFeats(title: string, feats: Feat[]): string {
        if (!feats.length)
            return this.line(title + ': None', '\t');

        let formatted = this.line(title + ':', '\t');

        for (const feat of feats) {
            formatted += this.line(feat.name, '\t\t');

            if (feat.foci.length) {
                formatted += this.line('Foci:', '\t\t\t');
                formatted += this.lines(feat.foci, '\t\t\t\t');
            }

            if (feat.frequency.timePeriod)
                formatted += this.line('Frequency: ' + this.frequencyPipe.transform(feat.frequency), '\t\t\t');

            if (feat.power > 0)
                formatted += this.line('Power: ' + feat.power, '\t\t\t');
        }

        return formatted;
    }

    private formatMagic(creature: Creature): string {
        const magic = creature.magic;

        if (!magic.caster)
            return this.line('Magic: None', '\t');

        let formatted = this.line('Magic:', '\t');
        formatted += this.line('Caster: ' + magic.caster, '\t\t');
        formatted += this.line('Caster Level: ' + magic.casterLevel, '\t\t');

        if (magic.domains.length)
            formatted += this.line('Domains: ' + magic.domains.join(', '), '\t\t');

        if (magic.arcaneSpellFailure)
            formatted += this.line('Arcane Spell Failure: ' + magic.arcaneSpellFailure + '%', '\t\t');

        if (magic.spellsPerDay.length) {
            formatted += this.line('Spells Per Day:', '\t\t');
            formatted += this.lines(magic.spellsPerDay.map(q => this.spellQuantityPipe.transform(this.format.spellQuantity(q))), '\t\t\t');
        }

        formatted += this.formatSpells('Known Spells', magic.knownSpells);
        formatted += this.formatSpells('Prepared Spells', magic.preparedSpells);

        return formatted;
    }

    private formatSpells(title: string, spells: CreatureSpell[]): string {
        if (!spells.length)
            return '';

        let formatted = this.line(title + ':', '\t\t');

        for (const group of this.format.spellGroups(spells)) {
            formatted += this.line(group.name + ':', '\t\t\t');
            formatted += this.lines(group.spells.map(spell => spell.name), '\t\t\t\t');
        }

        return formatted;
    }

    private formatEquipment(creature: Creature): string {
        const equipment = creature.equipment;
        let formatted = this.line('Equipment:', '\t');

        formatted += this.formatItems('Weapons', equipment.weapons);
        formatted += this.formatItem('Armor', equipment.armor);
        formatted += this.formatItem('Shield', equipment.shield);
        formatted += this.formatItems('Items', equipment.items);

        return formatted;
    }

    private formatItem(title: string, item: Item | null): string {
        if (!item)
            return this.line(title + ': None', '\t\t');

        return this.line(title + ':', '\t\t') + this.itemPipe.transform(item, '\t\t\t');
    }

    private formatItems(title: string, items: Item[]): string {
        if (!items.length)
            return this.line(title + ': None', '\t\t');

        return this.line(title + ':', '\t\t') + items.map(item => this.itemPipe.transform(item, '\t\t\t')).join('');
    }

    private formatDemographics(creature: Creature): string {
        const demographics = creature.demographics;
        let formatted = this.line('Demographics:', '\t');

        formatted += this.line('Gender: ' + demographics.gender, '\t\t');
        formatted += this.lines(this.format.demographicMeasurements(demographics).map(m => `${m.label}: ${this.measurementPipe.transform(m.measurement)}`), '\t\t');
        formatted += this.lines(this.format.demographicDescriptions(demographics).map(d => `${d.label}: ${d.text}`), '\t\t');

        return formatted;
    }
}
