import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Character } from '../../character/models/character.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { TestHelper } from '../../test-helper';
import { EncounterComponent } from './encounter.component';
import { Encounter } from '../models/encounter.model';
import { EncounterCreature } from '../models/encounter-creature.model';
import { Creature } from '../models/creature.model';
import { Coin } from '../../treasure/models/coin.model';
import { ItemComponent } from '../../treasure/components/item.component';

describe('Encounter Component', () => {
  describe('unit', () => {
    let component: EncounterComponent;

    beforeEach(() => {
      component = new EncounterComponent();
    });
  
    it(`should set the encounter `, () => {
      const encounter = new Encounter('my encounter description');
      component.encounter = encounter;

      expect(component.encounter).toBe(encounter);
    });
  });
});