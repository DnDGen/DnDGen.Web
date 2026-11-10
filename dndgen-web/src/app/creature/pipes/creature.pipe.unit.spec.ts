import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreaturePipe } from './creature.pipe';
import { CreatureFormatService } from '../services/creature-format.service';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { DecimalPipe } from '@angular/common';
import { InchesToFeetPipe } from '../../character/pipes/inches-to-feet.pipe';
import { CreatureTestHelper } from '../creature.test-helper';
import { Item } from '../../treasure/models/item.model';
import { Weapon } from '../../treasure/models/weapon.model';
import { TestHelper } from '../../test-helper';

describe('Creature Pipe', () => {
  describe('unit', () => {
    let pipe: CreaturePipe;
    let itemPipeSpy: { transform: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      itemPipeSpy = { transform: vi.fn() };
      itemPipeSpy.transform.mockImplementation((item: Item, prefix: string) => `${prefix}formatted ${item.name}\r\n`);

      const bonusPipe = new BonusPipe();
      const spellGroupService = new SpellGroupService();

      pipe = new CreaturePipe(
        new CreatureFormatService(bonusPipe, spellGroupService),
        bonusPipe,
        new BonusesPipe(bonusPipe),
        new MeasurementPipe(new DecimalPipe('en-US'), new InchesToFeetPipe(new DecimalPipe('en-US'))),
        new FrequencyPipe(),
        new SpellQuantityPipe(spellGroupService),
        itemPipeSpy as unknown as ItemPipe,
      );
    });

    it('formats a full creature', () => {
      const creature = CreatureTestHelper.createFullCreature();

      const lines = pipe.transform(creature).split('\r\n');

      TestHelper.expectLines(lines, [
        'Ghost Hill Giant:',
        '\tSize: Large',
        '\tType: Undead (Incorporeal, Augmented)',
        '\tChallenge Rating: 9',
        '\tAlignment: Chaotic Evil',
        '\tLevel Adjustment: +9',
        '\tTemplates: Ghost, None',
        '\tHit Points: 102',
        '\t\tHit Dice: 12d12',
        '\t\t+2 when raging',
        '\tCombat:',
        '\t\tArmor Class: 20 *',
        '\t\t\tFlat-Footed: 21',
        '\t\t\tTouch: 8',
        '\t\t\t+2 against evil',
        '\t\tInitiative Bonus: -1',
        '\t\tBase Attack: +9',
        '\t\tGrapple: +20',
        '\t\tSpace: 10 feet',
        '\t\tReach: 10 feet',
        '\t\tSpeeds:',
        '\t\t\tLand: 40 feet per round (Base)',
        '\t\t\tFly: 30 feet per round (Perfect Maneuverability)',
        '\t\tSaving Throws:',
        '\t\t\tFortitude: —',
        '\t\t\tReflex: +3',
        '\t\t\tWill: +4 *',
        '\t\t\t+4 against fear',
        '\tAttacks:',
        '\t\tAttacks:',
        '\t\t\tGreatclub',
        '\t\t\t\tType: Manufactured melee (Primary)',
        '\t\t\t\tAttack Bonus: +16',
        '\t\t\t\tFull Attack Bonuses: +16/+11',
        '\t\t\t\tDamage: 2d8+10 Bludgeoning',
        '\t\t\t\tFrequency: 1/Round (6 seconds)',
        '\t\tFull Melee Attack:',
        '\t\t\tGreatclub',
        '\t\t\t\tType: Manufactured melee (Primary)',
        '\t\t\t\tAttack Bonus: +16',
        '\t\t\t\tFull Attack Bonuses: +16/+11',
        '\t\t\t\tDamage: 2d8+10 Bludgeoning',
        '\t\t\t\tFrequency: 1/Round (6 seconds)',
        '\t\tFull Ranged Attack:',
        '\t\t\tRock',
        '\t\t\t\tType: Natural ranged (Primary)',
        '\t\t\t\tAttack Bonus: +8 *',
        '\t\t\t\tDamage: 2d6+7 Bludgeoning',
        '\t\tSpecial Attacks:',
        '\t\t\tCorrupting Touch',
        '\t\t\t\tType: supernatural ability',
        '\t\t\t\tDamage: 1d6',
        '\t\t\t\tFrequency: 1/Round (6 seconds)',
        '\tAbilities:',
        '\t\tStrength: 25 (+7)',
        '\t\tConstitution: —',
        '\t\tDexterity: 8 (-1)',
        '\t\tIntelligence: 6 (-2)',
        '\t\tWisdom: 10 (+0)',
        '\t\tCharisma: 13 (+1)',
        '\tSkills:',
        '\t\tClimb',
        '\t\t\tTotal Bonus: +9 *',
        '\t\t\tRanks: 2',
        '\t\t\tAbility Bonus: 7',
        '\t\t\tArmor Check Penalty: -3',
        '\t\t\tClass Skill',
        '\t\tKnowledge (Religion)',
        '\t\t\tTotal Bonus: -2',
        '\t\t\tRanks: 0',
        '\t\t\tAbility Bonus: -2',
        '\t\t\tArmor Check Penalty: 0',
        '\t\tSpot',
        '\t\t\tTotal Bonus: +6',
        '\t\t\tRanks: 3',
        '\t\t\tAbility Bonus: 0',
        '\t\t\tArmor Check Penalty: 0',
        '\t\t\tClass Skill',
        '\tFeats:',
        '\t\tCleave',
        '\t\tWeapon Focus',
        '\t\t\tFoci:',
        '\t\t\t\tGreatclub',
        '\tSpecial Qualities:',
        '\t\tRock Catching',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tEthereal jaunt',
        '\t\t\tFrequency: At Will',
        '\tLanguages:',
        '\t\tGiant',
        '\t\tCommon',
        '\tMagic:',
        '\t\tCaster: Sorcerer',
        '\t\tCaster Level: 3',
        '\t\tDomains: Air, Good',
        '\t\tArcane Spell Failure: 15%',
        '\t\tSpells Per Day:',
        '\t\t\tSorcerer Level 0: 6',
        '\t\t\tSorcerer Level 1: 6 + 1',
        '\t\tKnown Spells:',
        '\t\t\tSorcerer Level 0:',
        '\t\t\t\tLight',
        '\t\t\tSorcerer Level 1:',
        '\t\t\t\tMagic Missile',
        '\t\tPrepared Spells:',
        '\t\t\tSorcerer Level 1:',
        '\t\t\t\tShield',
        '\tEquipment:',
        '\t\tWeapons:',
        '\t\t\tformatted Greatclub',
        '\t\tArmor:',
        '\t\t\tformatted Hide armor',
        '\t\tShield:',
        '\t\t\tformatted Heavy wooden shield',
        '\t\tItems:',
        '\t\t\tformatted Potion of cure light wounds',
        '\tDemographics:',
        '\t\tGender: Male',
        '\t\tAge: 45 years (Adulthood)',
        '\t\tMaximum Age: Immortal',
        '\t\tHeight: 10\' 6" (Average)',
        '\t\tWeight: 1,100 pounds (Heavy)',
        '\t\tSkin: Deep ruddy-brown skin',
        '\t\tHair: Black hair',
        '\t\tOther: Translucent',
        '',
      ]);

      expect(itemPipeSpy.transform.mock.calls).toEqual([
        [creature.equipment.weapons[0], '\t\t\t'],
        [creature.equipment.armor, '\t\t\t'],
        [creature.equipment.shield, '\t\t\t'],
        [creature.equipment.items[0], '\t\t\t'],
      ]);
    });

    it('formats a minimal creature', () => {
      const lines = pipe.transform(CreatureTestHelper.createMinimalCreature()).split('\r\n');

      TestHelper.expectLines(lines, [
        'Gelatinous Cube:',
        '\tSize: Huge',
        '\tType: Ooze',
        '\tChallenge Rating: 3',
        '\tAlignment: True Neutral',
        '\tLevel Adjustment: —',
        '\tTemplates: None',
        '\tHit Points: 84',
        '\t\tHit Dice: 4d10+32',
        '\tCombat:',
        '\t\tArmor Class: 3',
        '\t\t\tFlat-Footed: 3',
        '\t\t\tTouch: 3',
        '\t\tInitiative Bonus: -5',
        '\t\tBase Attack: +3',
        '\t\tGrapple: —',
        '\t\tSpace: 15 feet',
        '\t\tReach: 10 feet',
        '\t\tSpeeds:',
        '\t\t\tLand: 15 feet per round',
        '\t\tSaving Throws:',
        '\t\t\tFortitude: +9',
        '\t\t\tReflex: -4',
        '\t\t\tWill: -4',
        '\tAttacks:',
        '\t\tAttacks: None',
        '\t\tFull Melee Attack: None',
        '\t\tFull Ranged Attack: None',
        '\t\tSpecial Attacks: None',
        '\tAbilities:',
        '\t\tStrength: 10 (+0)',
        '\t\tConstitution: 26 (+8)',
        '\t\tDexterity: 1 (-5)',
        '\t\tIntelligence: —',
        '\t\tWisdom: 1 (-5)',
        '\t\tCharisma: 1 (-5)',
        '\tSkills: None',
        '\tFeats: None',
        '\tSpecial Qualities: None',
        '\tLanguages: None',
        '\tMagic: None',
        '\tEquipment:',
        '\t\tWeapons: None',
        '\t\tArmor: None',
        '\t\tShield: None',
        '\t\tItems: None',
        '\tDemographics:',
        '\t\tGender: Agender',
        '\t\tAge: Ageless',
        '\t\tMaximum Age: Immortal',
        '',
      ]);

      expect(itemPipeSpy.transform).not.toHaveBeenCalled();
    });

    it('formats feat power and many weapons', () => {
      const creature = CreatureTestHelper.createMinimalCreature();
      creature.feats = [];
      creature.specialQualities[0] = CreatureTestHelper.createFullCreature().specialQualities[0];
      creature.specialQualities[0].power = 3;
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon'), new Weapon('Rock', 'Weapon')];

      const lines = pipe.transform(creature).split('\r\n');

      expect(lines).toContain('\t\tRock Catching');
      expect(lines).toContain('\t\t\tPower: 3');
      expect(lines.slice(lines.indexOf('\t\tWeapons:'), lines.indexOf('\t\tWeapons:') + 3)).toEqual([
        '\t\tWeapons:',
        '\t\t\tformatted Greatclub',
        '\t\t\tformatted Rock',
      ]);
    });
  });
});
