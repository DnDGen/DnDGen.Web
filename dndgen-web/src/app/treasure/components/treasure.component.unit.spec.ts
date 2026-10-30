import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreasureComponent } from './treasure.component';
import { Item } from '../models/item.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { ItemComponent } from './item.component';
import { TestHelper } from '../../test-helper';

describe('Treasure Component', () => {
  describe('unit', () => {
    let component: TreasureComponent;

    beforeEach(() => {
      component = new TreasureComponent();
    });
  
    it(`should set the treasure `, () => {
      let treasure = new Treasure(
        true,
        new Coin('munny', 9266),
        [new Good('good 1', 90210), new Good('good 2', 42)],
        [new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2')],
      );
      component.treasure = treasure;

      expect(component.treasure).toBe(treasure);
    });
  });
});