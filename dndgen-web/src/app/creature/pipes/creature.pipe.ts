import { Pipe, PipeTransform } from '@angular/core';
import { Creature } from '../models/creature.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { Item } from '../../treasure/models/item.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { Bonus } from '../models/bonus.model';
import { CreatureMagic } from '../models/creature-magic.model';
import { Demographics } from '../models/demographics.model';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { Spell } from '../../character/models/spell.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { CreatureTypePipe } from './creature-type.pipe';
import { HitDicePipe } from './hit-dice.pipe';
import { SpeedPipe } from './speed.pipe';
import { ArmorClassPipe } from './armor-class.pipe';
import { OptionalBonusPipe } from './optional-bonus.pipe';
import { AttackPipe } from './attack.pipe';
import { AttackTypePipe } from './attack-type.pipe';
import { FullAttackPipe } from './full-attack.pipe';
import { SavesPipe } from './saves.pipe';
import { AbilitiesPipe } from './abilities.pipe';
import { SkillPipe } from './skill.pipe';
import { ConditionalBonusPipe } from './conditional-bonus.pipe';

@Pipe({
    name: 'creature',
    standalone: true
})
export class CreaturePipe implements PipeTransform {
    constructor(
        private bonusPipe: BonusPipe,
        private measurementPipe: MeasurementPipe,
        private frequencyPipe: FrequencyPipe,
        private spellQuantityPipe: SpellQuantityPipe,
        private itemPipe: ItemPipe,
        private spellGroupService: SpellGroupService,
        private creatureTypePipe: CreatureTypePipe,
        private hitDicePipe: HitDicePipe,
        private speedPipe: SpeedPipe,
        private armorClassPipe: ArmorClassPipe,
        private optionalBonusPipe: OptionalBonusPipe,
        private attackPipe: AttackPipe,
        private attackTypePipe: AttackTypePipe,
        private fullAttackPipe: FullAttackPipe,
        private savesPipe: SavesPipe,
        private abilitiesPipe: AbilitiesPipe,
        private skillPipe: SkillPipe,
        private conditionalBonusPipe: ConditionalBonusPipe) { }

    private readonly saveNames = ['Fortitude', 'Reflex', 'Will'];

    transform(creature: Creature): string {
        let formatted = creature.summary + ':\r\n';

        formatted += this.line(`Size/Type: ${creature.size} ${this.creatureTypePipe.transform(creature.type)}`, '\t');

        formatted += this.line('Hit Dice: ' + this.hitDicePipe.transform(creature.hitPoints), '\t');
        formatted += this.line('Hit Points: ' + creature.hitPoints.total, '\t\t');
        formatted += this.formatConditionalBonuses(creature.hitPoints.conditionalBonuses, '\t\t');

        formatted += this.line('Initiative: ' + this.bonusPipe.transform(creature.totalInitiativeBonus), '\t');
        formatted += this.line('Speed: ' + this.speedPipe.transform(creature.speeds), '\t');

        formatted += this.line('Armor Class: ' + this.armorClassPipe.transform(creature.armorClass), '\t');
        formatted += this.line('Touch: ' + creature.armorClass.touchBonus, '\t\t');
        formatted += this.line('Flat-Footed: ' + creature.armorClass.flatFootedBonus, '\t\t');
        formatted += this.formatConditionalBonuses(creature.armorClass.bonuses, '\t\t');

        formatted += this.line(`Base Attack/Grapple: ${this.bonusPipe.transform(creature.baseAttackBonus)}/${this.optionalBonusPipe.transform(creature.grappleBonus)}`, '\t');
        formatted += this.formatAttackOptions(creature.attacks);
        formatted += this.formatFullAttackOptions(creature);
        formatted += this.line(`Space/Reach: ${creature.space.value} ft./${creature.reach.value} ft.`, '\t');
        formatted += this.formatSpecialAttacks(creature);
        formatted += this.formatFeats('Special Qualities', creature.specialQualities);

        formatted += this.line('Saves: ' + this.savesPipe.transform(creature.saves), '\t');

        for (const saveName of this.saveNames) {
            formatted += this.lines(this.getConditionalBonuses(creature.saves[saveName].bonuses)
                .map(bonus => `${saveName}: ${this.conditionalBonusPipe.transform(bonus)}`), '\t\t');
        }

        formatted += this.line('Abilities: ' + this.abilitiesPipe.transform(creature.abilities), '\t');
        formatted += this.formatSkills(creature.skills);
        formatted += this.formatFeats('Feats', creature.feats);
        formatted += this.line('Challenge Rating: ' + creature.challengeRating, '\t');
        formatted += this.line('Alignment: ' + creature.alignment.full, '\t');
        formatted += this.line('Level Adjustment: ' + this.optionalBonusPipe.transform(creature.levelAdjustment), '\t');
        formatted += this.formatDemographics(creature.demographics);
        formatted += this.formatList('Languages', creature.languages);
        formatted += this.formatEquipment(creature);

        return formatted;
    }

    private line(text: string, prefix: string): string {
        return prefix + text + '\r\n';
    }

    private lines(texts: string[], prefix: string): string {
        return texts
            .map(text => this.line(text, prefix))
            .join('');
    }

    private getConditionalBonuses(bonuses: Bonus[]): Bonus[] {
        return bonuses.filter(bonus => bonus.isConditional);
    }

    private formatConditionalBonuses(bonuses: Bonus[], prefix: string): string {
        return this.lines(this.getConditionalBonuses(bonuses).map(bonus => this.conditionalBonusPipe.transform(bonus)), prefix);
    }

    private formatList(title: string, list: string[]): string {
        return this.line(`${title} (${list.length}):`, '\t') + this.lines(list, '\t\t');
    }

    private formatAttackOptions(attacks: Attack[]): string {
        const options = attacks
            .filter(attack => !attack.isSpecial)
            .filter((attack, index, all) => all.findIndex(other => this.isSameAttack(attack, other)) == index);

        let formatted = this.line(`Attack (${options.length}):`, '\t');

        for (const attack of options) {
            formatted += this.formatAttack(attack, false, '\t\t');
        }

        return formatted;
    }

    private isSameAttack(attack: Attack, other: Attack): boolean {
        return attack.name == other.name
            && attack.attackType == other.attackType
            && attack.totalAttackBonus == other.totalAttackBonus
            && attack.damageSummary == other.damageSummary;
    }

    private formatFullAttackOptions(creature: Creature): string {
        const options = [creature.fullMeleeAttack, creature.fullRangedAttack]
            .filter(attacks => attacks.length > 0);

        let formatted = this.line(`Full Attack (${options.length}):`, '\t');

        for (const option of options) {
            formatted += this.line(this.fullAttackPipe.transform(option), '\t\t');

            for (const attack of option) {
                formatted += this.formatAttack(attack, true, '\t\t\t');
            }
        }

        return formatted;
    }

    private formatSpecialAttacks(creature: Creature): string {
        let formatted = this.line(`Special Attacks (${creature.specialAttacks.length}):`, '\t');

        for (const attack of creature.specialAttacks) {
            formatted += this.formatAttack(attack, false, '\t\t');

            if (attack.name == 'Spells')
                formatted += this.formatMagic(creature.magic, '\t\t\t');
        }

        return formatted;
    }

    private formatAttack(attack: Attack, full: boolean, prefix: string): string {
        let formatted = this.line(this.attackPipe.transform(attack, full), prefix);
        formatted += this.line('Type: ' + this.attackTypePipe.transform(attack), prefix + '\t');

        if (attack.frequency.timePeriod)
            formatted += this.line('Frequency: ' + this.frequencyPipe.transform(attack.frequency), prefix + '\t');

        if (attack.save)
            formatted += this.line(`Save: ${attack.save.save} DC ${attack.save.dc} (${attack.save.baseAbility.name})`, prefix + '\t');

        return formatted;
    }

    private formatMagic(magic: CreatureMagic, prefix: string): string {
        let formatted = this.line('Caster: ' + magic.caster, prefix);
        formatted += this.line('Caster Level: ' + magic.casterLevel, prefix);

        if (magic.domains.length)
            formatted += this.line('Domains: ' + magic.domains.join(', '), prefix);

        if (magic.arcaneSpellFailure)
            formatted += this.line('Arcane Spell Failure: ' + magic.arcaneSpellFailure + '%', prefix);

        if (magic.spellsPerDay.length) {
            formatted += this.line('Spells Per Day:', prefix);
            formatted += this.lines(magic.spellsPerDay
                .map(q => this.spellQuantityPipe.transform(new SpellQuantity(q.source, q.level, q.totalQuantity, q.hasDomainSpell))), prefix + '\t');
        }

        formatted += this.formatSpells('Known Spells', magic.knownSpells, prefix);
        formatted += this.formatSpells('Prepared Spells', magic.preparedSpells, prefix);

        return formatted;
    }

    private formatSpells(title: string, spells: CreatureSpell[], prefix: string): string {
        if (!spells.length)
            return '';

        let formatted = this.line(title + ':', prefix);
        const characterSpells = spells.map(spell => new Spell({ [spell.source]: spell.level }, spell.name, spell.metamagic));

        for (const group of this.spellGroupService.sortIntoGroups(characterSpells)) {
            formatted += this.line(group.name + ':', prefix + '\t');
            formatted += this.lines(group.spells.map(spell => spell.name), prefix + '\t\t');
        }

        return formatted;
    }

    private formatSkills(skills: CreatureSkill[]): string {
        let formatted = this.line(`Skills (${skills.length}):`, '\t');
        const sorted = [...skills].sort((a, b) => this.compare(this.getSkillDisplayName(a), this.getSkillDisplayName(b)));

        for (const skill of sorted) {
            formatted += this.line(this.skillPipe.transform(skill), '\t\t');
            formatted += this.line('Ranks: ' + skill.effectiveRanks, '\t\t\t');
            formatted += this.line(`Ability: ${skill.baseAbility.name} (${this.bonusPipe.transform(skill.baseAbility.modifier)})`, '\t\t\t');

            if (skill.hasArmorCheckPenalty)
                formatted += this.line('Armor Check Penalty: ' + skill.armorCheckPenalty, '\t\t\t');

            if (skill.classSkill)
                formatted += this.line('Class Skill', '\t\t\t');
        }

        return formatted;
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

    private formatFeats(title: string, feats: Feat[]): string {
        let formatted = this.line(`${title} (${feats.length}):`, '\t');

        for (const feat of feats) {
            formatted += this.line(feat.name, '\t\t');

            if (feat.foci.length) {
                formatted += this.line('Foci:', '\t\t\t');
                formatted += this.lines(feat.foci, '\t\t\t\t');
            }

            if (feat.power > 0)
                formatted += this.line('Power: ' + feat.power, '\t\t\t');

            if (feat.frequency.timePeriod)
                formatted += this.line('Frequency: ' + this.frequencyPipe.transform(feat.frequency), '\t\t\t');
        }

        return formatted;
    }

    private formatDemographics(demographics: Demographics): string {
        let formatted = this.line('Demographics:', '\t');

        formatted += this.line('Gender: ' + demographics.gender, '\t\t');
        formatted += this.line('Age: ' + this.measurementPipe.transform(demographics.age), '\t\t');
        formatted += this.line('Maximum Age: ' + this.measurementPipe.transform(demographics.maximumAge), '\t\t');

        const measurements = [
            { label: 'Height', measurement: demographics.height },
            { label: 'Length', measurement: demographics.length },
            { label: 'Weight', measurement: demographics.weight },
            { label: 'Wingspan', measurement: demographics.wingspan },
        ];

        formatted += this.lines(measurements
            .filter(m => m.measurement.value)
            .map(m => `${m.label}: ${this.measurementPipe.transform(m.measurement)}`), '\t\t');

        const descriptions = [
            { label: 'Skin', text: demographics.skin },
            { label: 'Hair', text: demographics.hair },
            { label: 'Eyes', text: demographics.eyes },
            { label: 'Other', text: demographics.other },
        ];

        formatted += this.lines(descriptions
            .filter(d => d.text)
            .map(d => `${d.label}: ${d.text}`), '\t\t');

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
        return this.line(`${title} (${items.length}):`, '\t\t') + items.map(item => this.itemPipe.transform(item, '\t\t\t')).join('');
    }
}
