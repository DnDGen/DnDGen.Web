import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Treasure } from '../../treasure/models/treasure.model';
import { TestHelper } from '../../test-helper';
import { DungeonTreasureComponent } from './dungeon-treasure.component';
import { Coin } from '../../treasure/models/coin.model';
import { DungeonTreasure } from '../models/dungeon-treasure.model';
import { TreasureComponent } from '../../treasure/components/treasure.component';

describe('Dungeon Treasure Component', () => {
  describe('unit', () => {
    let component: DungeonTreasureComponent;

    beforeEach(() => {
      component = new DungeonTreasureComponent();
    });
  
    it(`should set the dungeon treasure `, () => {
      const dungeonTreasure = new DungeonTreasure();
      component.dungeonTreasure = dungeonTreasure;

      expect(component.dungeonTreasure).toBe(dungeonTreasure);
    });
  });
});