import { describe, it, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttackComponent } from './attack.component';
import { TestHelper } from '../../test-helper';
import { Attack } from '../models/attack.model';
import { Frequency } from '../../character/models/frequency.model';
import { AttackSave } from '../models/attack-save.model';
import { CreatureAbility } from '../models/creature-ability.model';

describe('Attack Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<AttackComponent>;
    let helper: TestHelper<AttackComponent>;
    let attack: Attack;

    beforeEach(async () => {
      await TestHelper.configureTestBed([AttackComponent]);

      fixture = TestBed.createComponent(AttackComponent);
      helper = new TestHelper(fixture);

      attack = new Attack('Longsword', 'melee');
      attack.isNatural = false;
      attack.isPrimary = true;
      attack.totalAttackBonus = 24;
      attack.fullAttackBonuses = [24, 19, 14, 9];
      attack.damageSummary = '2d6+9 Slashing';
      attack.frequency = new Frequency(1, 'Round (6 seconds)');

      fixture.componentInstance.attack = attack;
    });

    it('should render a standard attack with its summary, type, and frequency', async () => {
      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Longsword +24 melee (2d6+9 Slashing)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: Manufactured melee (Primary)',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('should render the full attack bonuses when it is part of a full attack', async () => {
      fixture.componentInstance.full = true;

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Longsword +24/+19/+14/+9 melee (2d6+9 Slashing)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: Manufactured melee (Primary)',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('should render a natural secondary attack', async () => {
      attack.name = 'Tail Slap';
      attack.isNatural = true;
      attack.isPrimary = false;
      attack.totalAttackBonus = 19;
      attack.damageSummary = '4d6+4 Bludgeoning';

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Tail Slap +19 melee (4d6+4 Bludgeoning)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: Natural melee (Secondary)',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('should render an attack with many attacks per round', async () => {
      attack.name = 'Slam';
      attack.isNatural = true;
      attack.damageSummary = '1d8+9 Bludgeoning';
      attack.frequency.quantity = 6;

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Slam +24 melee (1d8+9 Bludgeoning)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: Natural melee (Primary)',
        'Frequency: 6/Round (6 seconds)',
      ]);
    });

    it('should render an attack without a frequency', async () => {
      attack.frequency = new Frequency();

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Longsword +24 melee (2d6+9 Slashing)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: Manufactured melee (Primary)',
      ]);
    });

    it('should render a special attack with its damage', async () => {
      attack.name = 'Constrict';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '4d6+13 Bludgeoning plus Lose Consciousness';

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Constrict (4d6+13 Bludgeoning plus Lose Consciousness)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: extraordinary ability',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('should render a special attack without damage', async () => {
      attack.name = 'Summon Demon';
      attack.attackType = 'spell-like ability';
      attack.isSpecial = true;
      attack.damageSummary = '';
      attack.frequency = new Frequency(1, 'Day');

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Summon Demon', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: spell-like ability',
        'Frequency: 1/Day',
      ]);
    });

    it('should render a special attack with a save', async () => {
      const strength = new CreatureAbility('Strength', 28, 9);

      attack.name = 'Lose Consciousness';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = 'lose consciousness while in coils and for 2d4 rounds thereafter';
      attack.save = new AttackSave('Fortitude', 27, 18, strength);

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Lose Consciousness (lose consciousness while in coils and for 2d4 rounds thereafter)', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: extraordinary ability',
        'Frequency: 1/Round (6 seconds)',
        'Save: Fortitude DC 27 (Strength)',
      ]);
    });

    it('should render a special attack with a save but no damage or frequency', async () => {
      const charisma = new CreatureAbility('Charisma', 15, 2);

      attack.name = 'Petrifying Gaze';
      attack.attackType = 'supernatural ability';
      attack.isSpecial = true;
      attack.damageSummary = '';
      attack.frequency = new Frequency();
      attack.save = new AttackSave('Fortitude', 15, 10, charisma);

      await helper.waitForChangeDetection();

      helper.expectDetails('dndgen-details.attack-heading', 'Petrifying Gaze', true);
      helper.expectTextContents('dndgen-details.attack-heading li', [
        'Type: supernatural ability',
        'Save: Fortitude DC 15 (Charisma)',
      ]);
    });
  });
});
