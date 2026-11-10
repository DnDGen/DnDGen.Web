import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttackComponent } from './attack.component';
import { TestHelper } from '../../test-helper';
import { Attack } from '../models/attack.model';
import { Bonus } from '../models/bonus.model';
import { Frequency } from '../../character/models/frequency.model';

describe('Attack Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<AttackComponent>;
    let helper: TestHelper<AttackComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([AttackComponent]);

      fixture = TestBed.createComponent(AttackComponent);
      helper = new TestHelper(fixture);
    });

    async function render(attack: Attack) {
      fixture.componentRef.setInput('attack', attack);
      await helper.waitForChangeDetection();
    }

    function lines(): string[] {
      const items = fixture.nativeElement.querySelectorAll('li');
      return Array.from(items).map(i => (i as HTMLElement).textContent!.trim());
    }

    it('shows a single melee attack', async () => {
      await render(new Attack('Greatclub', 'melee', true, false, true, false, 15, [15], [], '2d8+10 Bludgeoning', '', new Frequency(1, 'Round (6 seconds)')));

      helper.expectDetails('dndgen-details.attack-heading', 'Greatclub', true);
      expect(lines()).toEqual([
        'Type: Manufactured melee (Primary)',
        'Attack Bonus: +15',
        'Damage: 2d8+10 Bludgeoning',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('shows full attack bonuses for iterative attacks', async () => {
      await render(new Attack('Longsword', 'melee', true, false, true, false, 11, [11, 6, 1], [], '1d8+3 Slashing'));

      expect(lines()).toEqual([
        'Type: Manufactured melee (Primary)',
        'Attack Bonus: +11',
        'Full Attack Bonuses: +11/+6/+1',
        'Damage: 1d8+3 Slashing',
      ]);
    });

    it('marks conditional attack bonuses', async () => {
      await render(new Attack('Claw', 'melee', true, true, false, false, -2, [-2, -7], [new Bonus(2, 'when charging', true)], '1d4 Slashing'));

      expect(lines()).toEqual([
        'Type: Natural melee (Secondary)',
        'Attack Bonus: -2 *',
        'Full Attack Bonuses: -2/-7 *',
        'Damage: 1d4 Slashing',
      ]);
    });

    it('shows the effect of an attack', async () => {
      await render(new Attack('Bite', 'melee', true, true, true, false, 23, [23], [], '1d4+12 Piercing plus Poison', 'Poison', new Frequency(1, 'Round (6 seconds)')));

      expect(lines()).toEqual([
        'Type: Natural melee (Primary)',
        'Attack Bonus: +23',
        'Damage: 1d4+12 Piercing plus Poison',
        'Effect: Poison',
        'Frequency: 1/Round (6 seconds)',
      ]);
    });

    it('shows a special attack without an attack bonus', async () => {
      await render(new Attack('Poison', 'extraordinary ability', true, true, true, true, 29, [29], [], '2d4 Strength (Initial)', '', new Frequency(1, 'Hit')));

      expect(lines()).toEqual([
        'Type: extraordinary ability',
        'Damage: 2d4 Strength (Initial)',
        'Frequency: 1/Hit',
      ]);
    });

    it('shows a special attack with no damage or frequency', async () => {
      await render(new Attack('Improved Grab', 'extraordinary ability', true, true, true, true, 29, [29]));

      expect(lines()).toEqual([
        'Type: extraordinary ability',
      ]);
    });
  });
});
