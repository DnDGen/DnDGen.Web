import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureComponent } from './creature.component';
import { TestHelper } from '../../test-helper';
import { CreatureTestHelper } from '../creature.test-helper';
import { Creature } from '../models/creature.model';
import { By } from '@angular/platform-browser';
import { AttackComponent } from './attack.component';
import { FeatComponent } from '../../character/components/feat.component';
import { SpellGroupComponent } from '../../character/components/spell-group.component';
import { CreatureService } from '../services/creature.service';
import { firstValueFrom } from 'rxjs';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';

describe('Creature Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<CreatureComponent>;
    let helper: TestHelper<CreatureComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([CreatureComponent]);

      fixture = TestBed.createComponent(CreatureComponent);
      helper = new TestHelper(fixture);
    });

    async function render(creature: Creature) {
      fixture.componentRef.setInput('creature', creature);
      await helper.waitForChangeDetection();
    }

    function texts(selector: string): string[] {
      const elements = fixture.nativeElement.querySelectorAll(selector);
      return Array.from(elements).map(e => (e as HTMLElement).textContent!.trim());
    }

    function attacks(selector: string): Attack[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-attack`))
        .map(e => (e.componentInstance as AttackComponent).attack);
    }

    function feats(selector: string): Feat[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-feat`))
        .map(e => (e.componentInstance as FeatComponent).feat);
    }

    function headingOf(selector: string): string {
      return texts(`${selector} > dndgen-details .details-header, ${selector} > dndgen-details .no-details-header`)[0];
    }

    describe('a full creature', () => {
      let creature: Creature;

      beforeEach(async () => {
        creature = CreatureTestHelper.createFullCreature();
        await render(creature);
      });

      it('shows the summary as the heading', () => {
        helper.expectDetails('dndgen-details.creature-header', 'Ghost Hill Giant', true);
      });

      it('shows the overview', () => {
        helper.expectTextContent('li.creature-size', 'Size: Large');
        helper.expectTextContent('li.creature-type', 'Type: Undead (Incorporeal, Augmented)');
        helper.expectTextContent('li.creature-cr', 'Challenge Rating: 9');
        helper.expectTextContent('li.creature-alignment', 'Alignment: Chaotic Evil');
        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: +9');
        helper.expectTextContent('li.creature-templates', 'Templates: Ghost, None');
      });

      it('shows the hit points, with conditional bonuses', () => {
        expect(headingOf('li.creature-hit-points')).toEqual('Hit Points: 102');
        expect(texts('li.creature-hit-points li')).toEqual(['Hit Dice: 12d12', '+2 when raging']);
      });

      it('shows the combat statistics', () => {
        expect(texts('li.creature-combat-ac > span')).toEqual(['Armor Class: 20 *']);
        expect(texts('li.creature-combat-ac li')).toEqual(['Flat-Footed: 21', 'Touch: 8', '+2 against evil']);
        helper.expectTextContent('li.creature-combat-initiative', 'Initiative Bonus: -1');
        helper.expectTextContent('li.creature-combat-ba', 'Base Attack: +9');
        helper.expectTextContent('li.creature-combat-grapple', 'Grapple: +20');
        helper.expectTextContent('li.creature-combat-space', 'Space: 10 feet');
        helper.expectTextContent('li.creature-combat-reach', 'Reach: 10 feet');
        expect(texts('li.creature-combat-speeds li')).toEqual([
          'Land: 40 feet per round (Base)',
          'Fly: 30 feet per round (Perfect Maneuverability)',
        ]);
        expect(texts('li.creature-combat-saves li')).toEqual(['Fortitude: —', 'Reflex: +3', 'Will: +4 *', '+4 against fear']);
      });

      it('shows the attacks', () => {
        expect(attacks('li.creature-attacks-standard')).toEqual([creature.attacks[0]]);
        expect(attacks('li.creature-attacks-full-melee')).toEqual(creature.fullMeleeAttack);
        expect(attacks('li.creature-attacks-full-ranged')).toEqual(creature.fullRangedAttack);
        expect(attacks('li.creature-attacks-special')).toEqual(creature.specialAttacks);
        expect(headingOf('li.creature-attacks-standard')).toEqual('Attacks');
        expect(headingOf('li.creature-attacks-full-melee')).toEqual('Full Melee Attack');
        expect(headingOf('li.creature-attacks-full-ranged')).toEqual('Full Ranged Attack');
        expect(headingOf('li.creature-attacks-special')).toEqual('Special Attacks');
      });

      it('shows the abilities in rules order, with no score as —', () => {
        expect(texts('li.creature-abilities li')).toEqual([
          'Strength: 25 (+7)',
          'Constitution: —',
          'Dexterity: 8 (-1)',
          'Intelligence: 6 (-2)',
          'Wisdom: 10 (+0)',
          'Charisma: 13 (+1)',
        ]);
      });

      it('shows the skills sorted by name', () => {
        const rows = Array.from(fixture.nativeElement.querySelectorAll('li.creature-skills tbody tr')) as HTMLElement[];
        const cells = rows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.textContent!.trim()));

        expect(cells).toEqual([
          ['', 'Climb', '+9 *', '2', '7', '-3'],
          ['', 'Knowledge (Religion)', '-2', '0', '-2', '0'],
          ['', 'Spot', '+6', '3', '0', '0'],
        ]);

        const classSkillIcons = rows.map(row => row.querySelector('td i.bi-check-lg') != null);
        expect(classSkillIcons).toEqual([true, false, true]);
      });

      it('shows the feats and special qualities', () => {
        expect(feats('li.creature-feats')).toEqual(creature.feats);
        expect(feats('li.creature-special-qualities')).toEqual(creature.specialQualities);
        expect(headingOf('li.creature-feats')).toEqual('Feats');
        expect(headingOf('li.creature-special-qualities')).toEqual('Special Qualities');
      });

      it('shows the languages', () => {
        expect(headingOf('li.creature-languages')).toEqual('Languages');
        expect(texts('li.creature-languages li')).toEqual(['Giant', 'Common']);
      });

      it('shows the magic', () => {
        expect(headingOf('li.creature-magic')).toEqual('Magic');
        helper.expectTextContent('li.creature-magic-caster', 'Caster: Sorcerer');
        helper.expectTextContent('li.creature-magic-caster-level', 'Caster Level: 3');
        helper.expectTextContent('li.creature-magic-domains', 'Domains: Air, Good');
        helper.expectTextContent('li.creature-magic-failure', 'Arcane Spell Failure: 15%');
        expect(texts('li.creature-magic-spells-per-day li')).toEqual(['Sorcerer Level 0: 6', 'Sorcerer Level 1: 6 + 1']);

        const known = fixture.debugElement.queryAll(By.css('li.creature-magic-spells-known dndgen-spell-group'))
          .map(e => (e.componentInstance as SpellGroupComponent).group);
        expect(known.map(g => [g.name, g.spells.map(s => s.name)])).toEqual([
          ['Sorcerer Level 0', ['Light']],
          ['Sorcerer Level 1', ['Magic Missile']],
        ]);

        const prepared = fixture.debugElement.queryAll(By.css('li.creature-magic-spells-prepared dndgen-spell-group'))
          .map(e => (e.componentInstance as SpellGroupComponent).group);
        expect(prepared.map(g => [g.name, g.spells.map(s => s.name)])).toEqual([
          ['Sorcerer Level 1', ['Shield']],
        ]);
      });

      it('shows the equipment', () => {
        helper.expectItem('li.creature-equipment-weapons dndgen-item', creature.equipment.weapons[0]);
        helper.expectItem('li.creature-equipment-armor dndgen-item', creature.equipment.armor!);
        helper.expectItem('li.creature-equipment-shield dndgen-item', creature.equipment.shield!);
        helper.expectItem('li.creature-equipment-items dndgen-item', creature.equipment.items[0]);
        expect(headingOf('li.creature-equipment-weapons')).toEqual('Weapons');
        expect(headingOf('li.creature-equipment-armor')).toEqual('Armor');
        expect(headingOf('li.creature-equipment-shield')).toEqual('Shield');
        expect(headingOf('li.creature-equipment-items')).toEqual('Items');
      });

      it('shows the demographics that have values', () => {
        expect(texts('li.creature-demographics li')).toEqual([
          'Gender: Male',
          'Age: 45 years (Adulthood)',
          'Maximum Age: Immortal',
          'Height: 10\' 6" (Average)',
          'Weight: 1,100 pounds (Heavy)',
          'Skin: Deep ruddy-brown skin',
          'Hair: Black hair',
          'Other: Translucent',
        ]);
      });
    });

    describe('a minimal creature', () => {
      beforeEach(async () => {
        await render(CreatureTestHelper.createMinimalCreature());
      });

      it('shows no level adjustment, templates, or grapple', () => {
        helper.expectTextContent('li.creature-type', 'Type: Ooze');
        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: —');
        helper.expectTextContent('li.creature-templates', 'Templates: None');
        helper.expectTextContent('li.creature-combat-grapple', 'Grapple: —');
        expect(texts('li.creature-combat-ac > span')).toEqual(['Armor Class: 3']);
        expect(texts('li.creature-combat-ac li')).toEqual(['Flat-Footed: 3', 'Touch: 3']);
        expect(texts('li.creature-hit-points li')).toEqual(['Hit Dice: 4d10+32']);
        expect(texts('li.creature-combat-saves li')).toEqual(['Fortitude: +9', 'Reflex: -4', 'Will: -4']);
      });

      it('shows empty sections as None', () => {
        expect(headingOf('li.creature-attacks-standard')).toEqual('Attacks: None');
        expect(headingOf('li.creature-attacks-full-melee')).toEqual('Full Melee Attack: None');
        expect(headingOf('li.creature-attacks-full-ranged')).toEqual('Full Ranged Attack: None');
        expect(headingOf('li.creature-attacks-special')).toEqual('Special Attacks: None');
        expect(headingOf('li.creature-skills')).toEqual('Skills: None');
        expect(headingOf('li.creature-feats')).toEqual('Feats: None');
        expect(headingOf('li.creature-special-qualities')).toEqual('Special Qualities: None');
        expect(headingOf('li.creature-languages')).toEqual('Languages: None');
        expect(headingOf('li.creature-magic')).toEqual('Magic: None');
        expect(headingOf('li.creature-equipment-weapons')).toEqual('Weapons: None');
        expect(headingOf('li.creature-equipment-armor')).toEqual('Armor: None');
        expect(headingOf('li.creature-equipment-shield')).toEqual('Shield: None');
        expect(headingOf('li.creature-equipment-items')).toEqual('Items: None');
        helper.expectExists('li.creature-skills tbody tr', false);
        helper.expectExists('dndgen-attack', false);
        helper.expectExists('dndgen-feat', false);
        helper.expectExists('dndgen-item', false);
      });

      it('shows only the demographics that have values', () => {
        expect(texts('li.creature-demographics li')).toEqual([
          'Gender: Agender',
          'Age: Ageless',
          'Maximum Age: Immortal',
        ]);
      });
    });

    describe('generated creatures', () => {
      const creatures = [
        { name: 'Human', templates: [] },
        { name: 'Human', templates: ['Ghost'] },
        { name: 'Couatl', templates: [] },
        { name: 'Hill Giant', templates: [] },
        { name: 'Red Dragon, Adult', templates: ['Half-Fiend'] },
      ];

      creatures.forEach(test => {
        it(`shows a generated ${[...test.templates, test.name].join(' ')}`, async () => {
          const creatureService = TestBed.inject(CreatureService);
          const creature = await firstValueFrom(creatureService.generateCreature(test.name, test.templates));

          await render(creature);

          helper.expectDetails('dndgen-details.creature-header', creature.summary, true);
          helper.expectTextContent('li.creature-cr', `Challenge Rating: ${creature.challengeRating}`);
          helper.expectTextContent('li.creature-templates', `Templates: ${test.templates.length ? test.templates.join(', ') : 'None'}`);
          expect(texts('li.creature-abilities li').length).toBe(6);
          expect(texts('li.creature-combat-saves li').slice(0, 3).map(s => s.split(':')[0])).toEqual(['Fortitude', 'Reflex', 'Will']);
          expect(attacks('li.creature-attacks-special')).toEqual(creature.specialAttacks);
        });
      });

      it('shows a generated Ghost Human with no Constitution score', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Human', ['Ghost']));

        await render(creature);

        expect(texts('li.creature-abilities li')).toContain('Constitution: —');
        expect(texts('li.creature-combat-saves li')).toContain('Fortitude: —');
      });

      it('shows a generated creature with no level adjustment as —', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Bat', []));
        expect('levelAdjustment' in creature).toBe(false);

        await render(creature);

        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: —');
      });

      it('shows a generated Couatl with magic', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Couatl', []));

        await render(creature);

        expect(headingOf('li.creature-magic')).toEqual('Magic');
        helper.expectTextContent('li.creature-magic-caster', `Caster: ${creature.magic.caster}`);
        expect(texts('li.creature-magic-spells-per-day li').length).toBe(creature.magic.spellsPerDay.length);
      });
    });
  });
});
