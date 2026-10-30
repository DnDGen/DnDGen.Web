import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestHelper } from '../../test-helper';
import { Encounter } from '../../encounter/models/encounter.model';
import { AreaComponent } from './area.component';
import { Area } from '../models/area.model';
import { Pool } from '../models/pool.model';
import { DungeonTreasure } from '../models/dungeon-treasure.model';
import { Trap } from '../models/trap.model';

describe('Area Component', () => {
  describe('unit', () => {
    let component: AreaComponent;

    beforeEach(() => {
      component = new AreaComponent();
    });
  
    it(`should set the area `, () => {
      const area = new Area('my area type');
      component.area = area;

      expect(component.area).toBe(area);
    });
  });
});