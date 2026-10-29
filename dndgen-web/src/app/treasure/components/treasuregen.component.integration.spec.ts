import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreasureGenComponent } from './treasuregen.component';
import { TreasureService } from '../services/treasure.service';
import { TreasurePipe } from '../pipes/treasure.pipe';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { TreasureGenViewModel } from '../models/treasuregen-view-model.model';
import { FileSaverService } from '../../shared/services/file-saver.service';
import { ItemTypeViewModel } from '../models/item-type-view-model.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Item } from '../models/item.model';
import { By } from '@angular/platform-browser';
import { TreasureComponent } from './treasure.component';
import { ItemComponent } from './item.component';
import FileSaver from 'file-saver';
import { Good } from '../models/good.model';
import { ItemPipe } from '../pipes/item.pipe';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../test-helper';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';

describe('TreasureGen Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<TreasureGenComponent>;
    let helper: TestHelper<TreasureGenComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([TreasureGenComponent]);
  
      fixture = TestBed.createComponent(TreasureGenComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForChangeDetection();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should show the loading component when loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(true);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(false);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });
  
    it(`should set the treasure model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.treasureModel()).toBeTruthy();
      
      const viewModel = component.treasureModel()!;
      expect(viewModel.treasureTypes).toEqual(['Treasure', 'Coin', 'Goods', 'Items']);
      expect(viewModel.maxTreasureLevel).toEqual(100);
      expect(viewModel.powers).toEqual(['Mundane', 'Minor', 'Medium', 'Major']);
      expect(viewModel.itemTypeViewModels.length).toEqual(11);

      for(var i = 0; i < viewModel.itemTypeViewModels.length; i++) {
        let itemType = viewModel.itemTypeViewModels[i].itemType;
        expect(viewModel.itemNames[itemType]).toBeTruthy();
        expect(viewModel.itemNames[itemType].length).toBeGreaterThan(0);
      }
    });
  
    it(`should validate inputs on init/changes`, async () => {
      const component = fixture.componentInstance;
      expect(component.validating()).toBe(false);
      expect(component.generating()).toBe(false);
      expect(component.validTreasure()).toBe(true);
      expect(component.validItem()).toBe(true);
    });
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      helper.expectTextContents('ul.nav-tabs a.nav-link', ['Treasure', 'Item']);

      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeTruthy();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
    });

    describe('the treasure tab', () => {
      it(`should render the treasure tab`, () => {
        helper.expectExists('#treasure');
        
        helper.expectSelect('#treasure #treasureTypes', true, 'Treasure', 4, ['Treasure', 'Coin', 'Goods', 'Items']);
        helper.expectNumberInput('#treasure #treasureLevel', true, 1, 1, 100);

        helper.expectHasAttribute('#treasure #treasureButton', 'disabled', false);
        helper.expectLoading('#treasure #treasureValidating', false, Size.Small);
      });
    
      it(`should show when validating treasure`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);
  
        await helper.waitForChangeDetection();

        helper.expectValidating(component.validating(), '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - missing level`, async () => {
        helper.setInput('#treasureLevel', '');
  
        expect(fixture.componentInstance.level).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level invalid`, async () => {
        helper.setInput('#treasureLevel', 'wrong');
  
        expect(fixture.componentInstance.level).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too low`, async () => {
        helper.setInput('#treasureLevel', '0');
  
        expect(fixture.componentInstance.level).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
      });
    
      const levelTestCases = [1, 2, 10, 20, 100];

      levelTestCases.forEach(test => {
        it(`should show that treasure is valid - level ${test}`, async () => {
          helper.setInput('#treasureLevel', test.toString());
    
          expect(fixture.componentInstance.level).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating(), '#treasureButton', '#treasureValidating');
    
          //run validation
          await helper.waitForChangeDetection();
    
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
        });
      });
    
      it(`should show that treasure is invalid - missing treasure type`, async () => {
        helper.setSelectByValue('#treasureTypes', '');
  
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
      });
    
      const treasureTypesIndicesTestCases = Array.from(Array(4).keys());

      treasureTypesIndicesTestCases.forEach(test => {
        TestHelper.runFlakyTest(() => {
          it(`should show that treasure is valid - treasure type index ${test}`, async () => {
            helper.setSelectByIndex('#treasureTypes', test);
      
            expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel()!.treasureTypes[test]);
            helper.expectValidating(fixture.componentInstance.validating(), '#treasureButton', '#treasureValidating');

            //run validation
            await helper.waitForChangeDetection();
      
            helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
          });
        });
      });

      it.skip(`should show that treasure is invalid - validation fails`, () => {
        expect('there are no invalid treasure combinations').toBe('');
      });
    
      it(`should show that treasure is valid - validation succeeds`, async () => {
        helper.setInput('#treasureLevel', '42');
        helper.setSelectByIndex('#treasureTypes', 3);
  
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel()!.treasureTypes[3]);
        helper.expectValidating(fixture.componentInstance.validating(), '#treasureButton', '#treasureValidating');
  
        //run validation
        await helper.waitForChangeDetection();
  
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validTreasure(), '#treasureButton', '#treasureValidating');
      });
    
      it(`should show when generating treasure`, async () => {
        const component = fixture.componentInstance;
        component.generating.set(true);
  
        await helper.waitForChangeDetection();

        helper.expectGenerating(
          fixture.componentInstance.generating(), 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');
      });
    
      it(`should generate the default treasure`, async () => {
        helper.clickButton('#treasureButton');
  
        helper.expectGenerating(
          fixture.componentInstance.generating(), 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');

        //run generate treasure
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(
          fixture.componentInstance.generating(), 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating',
          '#downloadTreasureButton');

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection > dndgen-treasure', true);
        helper.expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComp = element.componentInstance as TreasureComponent;
        expect(treasureComp.treasure).toBeTruthy();
        expect(treasureComp.treasure).not.toBeNull();
      });
      
      TestHelper.runFlakyTest(() => { 
        it(`should generate non-default treasure`, async () => {
          helper.setInput('#treasureLevel', '42');
          helper.setSelectByIndex('#treasureTypes', 3);
    
          fixture.detectChanges();

          expect(fixture.componentInstance.level).toEqual(42);
          expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel()!.treasureTypes[3]);

          //run validation
          await helper.waitForChangeDetection();

          helper.clickButton('#treasureButton');
    
          fixture.detectChanges();
          
          helper.expectGenerating(
            fixture.componentInstance.generating(), 
            '#treasureButton', 
            '#treasureSection', 
            '#generatingSection', 
            '#treasureValidating', 
            '#downloadTreasureButton');

          //run generate treasure
          await helper.waitForChangeDetection();
    
          helper.expectGenerated(
            fixture.componentInstance.generating(), 
            '#treasureButton', 
            '#treasureSection', 
            '#generatingSection', 
            '#treasureValidating',
            '#downloadTreasureButton');

          helper.expectExists('#noTreasure', false);
          helper.expectExists('#treasureSection > dndgen-treasure', true);
          helper.expectExists('#treasureSection > dndgen-item', false);

          const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
          expect(element).toBeTruthy();
          expect(element.componentInstance).toBeTruthy();
          expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
    
          const treasureComp = element.componentInstance as TreasureComponent;
          expect(treasureComp.treasure).toBeTruthy();
          expect(treasureComp.treasure).not.toBeNull();
          expect(treasureComp.treasure.isAny).toBe(true);
          expect(treasureComp.treasure.coin).toBeTruthy();
          expect(treasureComp.treasure.coin.currency).toBe('');
          expect(treasureComp.treasure.coin.quantity).toBe(0);
          expect(treasureComp.treasure.goods).toEqual([]);
          expect(treasureComp.treasure.items.length).toBeGreaterThan(0);
        });
      });
    });
  
    describe('the item tab', () => {
      it(`should render the item tab`, () => {
        helper.expectExists('#item');
  
        //item type
        helper.expectSelect('#item #itemTypes', true, 'Alchemical Item', 11, [
          'Alchemical Item',
          'Armor',
          'Potion',
          'Ring',
          'Rod',
          'Scroll',
          'Staff',
          'Tool',
          'Wand',
          'Weapon',
          'Wondrous Item',
        ]);
  
        //power
        helper.expectSelect('#item #powers', true, 'Mundane', 4, [
          'Mundane',
          'Minor',
          'Medium',
          'Major',
        ]);
  
        //item name
        const alchemicalItemNames = fixture.componentInstance.treasureModel()!.itemNames['AlchemicalItem'];
        helper.expectSelect('#item #itemNames', false, '', alchemicalItemNames.length + 1, [''].concat(alchemicalItemNames));
        helper.expectExists('#itemNames', true);
  
        //Any item name
        helper.expectExists('#item #anyItemName', false);

        helper.expectHasAttribute('#itemButton', 'disabled', false);
        helper.expectLoading('#itemValidating', false, Size.Small);
      });
    
      it(`should update item names when item type changes`, async () => {
        helper.setSelectByIndex('#itemTypes', 4);
  
        helper.expectSelect('#item #itemTypes', true, 'Rod', 11);
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');

        //run validation
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel()!.itemNames['Rod']);
        
        //item name
        const rodNames = fixture.componentInstance.treasureModel()!.itemNames['Rod'];
        helper.expectSelect('#itemNames', false, '', rodNames.length + 1, [''].concat(rodNames));
        helper.expectExists('#itemNames', true);
      });
    
      it(`should un-set an item name back to empty`, async () => {
        helper.setSelectByIndex('#itemNames', 4);
  
        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await helper.waitForChangeDetection();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');

        helper.setSelectByIndex('#itemNames', 0);
  
        expect(fixture.componentInstance.itemName).toEqual('');
        
        //run validation
        await helper.waitForChangeDetection();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
      });
    
      it(`should un-set an item name back to empty when item type changes`, async () => {
        helper.setSelectByIndex('#itemNames', 4);
  
        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#itemTypes', 6);
  
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Staff');
        
        //run validation
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel()!.itemNames['Staff']);
        expect(fixture.componentInstance.itemName).toEqual('');
        
        //item name
        const staffNames = fixture.componentInstance.treasureModel()!.itemNames['Staff'];
        helper.expectSelect('#itemNames', false, '', staffNames.length + 1, [''].concat(staffNames));
        helper.expectExists('#itemNames', true);
      });
    
      it(`should show when validating an item`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);
  
        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
      });
    
      it(`should show that an item is invalid - missing item type`, () => {
        helper.setSelectByValue('#itemTypes', '');
  
        expect(fixture.componentInstance.itemType).toBeFalsy();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
      });

      for(let itemTypeIndex = 0; itemTypeIndex < 11; itemTypeIndex++) {
        it(`should show that item is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel()!.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel()!.powers[powerIndex]);

          //run validation
          await helper.waitForChangeDetection();
    
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
    
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemName).toEqual('');
          
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectInput('#anyItemName', false, '');
            helper.expectExists('#itemNames', false);
          } else {
            helper.expectSelect('#itemNames', false, '', itemNames.length + 1, [''].concat(itemNames));
            helper.expectExists('#anyItemName', false);
          }

          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });

        it(`should show that item with any name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel()!.itemNames[itemTypeViewModel.itemType];
          
          let powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
          
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
            
          //run validation
          await helper.waitForChangeDetection();
    
          if (itemTypeViewModel.itemType != 'Wand' && itemTypeViewModel.itemType != 'Scroll') {
            helper.expectExists('#itemNames', true);
            helper.expectExists('#anyItemName', false);
            return;
          }

          helper.expectExists('#itemNames', false);
          helper.expectExists('#anyItemName', true);

          helper.setInput('#anyItemName', `My ${itemTypeViewModel.displayName}`);
    
          expect(fixture.componentInstance.itemName).toEqual(`My ${itemTypeViewModel.displayName}`);
          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });

        it(`should show that item with non-empty name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel()!.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
          
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await helper.waitForChangeDetection();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectExists('#itemNames', false);
            helper.expectExists('#anyItemName', true);
            return;
          }

          helper.expectExists('#itemNames', true);
          helper.expectExists('#anyItemName', false);

          helper.setSelectByIndex('#itemNames', 2);
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual(itemNames[1]);
          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });

        it(`should show an item is invalid - not a valid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel()!.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
            
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await helper.waitForChangeDetection();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectExists('#itemNames', false);
            helper.expectExists('#anyItemName', true);
            return;
          }

          helper.expectExists('#itemNames', true);
          helper.expectExists('#anyItemName', false);
  
          helper.setSelectByValue('#itemNames', 'not a name');
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          //Since we are emptying out the invalid name, it ends up valid
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });
  
        it(`should not allow an invalid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel()!.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
            
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await helper.waitForChangeDetection();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectExists('#itemNames', false);
            helper.expectExists('#anyItemName', true);
            return;
          }

          helper.expectExists('#itemNames', true);
          helper.expectExists('#anyItemName', false);
  
          let wrongIndex = itemTypeIndex - 1 >= 0 ? itemTypeIndex - 1 : 10;
          let wrongItemType = fixture.componentInstance.treasureModel()!.itemTypeViewModels[wrongIndex];
          let wrongName = fixture.componentInstance.treasureModel()!.itemNames[wrongItemType.itemType][0];
          helper.setSelectByValue('#itemNames', wrongName);
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel()!.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });
      }

      it('should show an item is invalid - missing power', () => {
        helper.setSelectByValue('#powers', '');
    
        expect(fixture.componentInstance.power).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid power', () => {
        helper.setSelectByValue('#powers', 'Omnipotent');
    
        expect(fixture.componentInstance.power).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid matching power', async () => {
        const rodIndex = fixture.componentInstance.treasureModel()!.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Rod');
        const minorIndex = fixture.componentInstance.treasureModel()!.powers.findIndex(p => p == 'Minor');
  
        expect(rodIndex).toBe(4);
        expect(minorIndex).toBe(1);
        helper.setSelectByIndex('#itemTypes', rodIndex);
        
        const compiled = fixture.nativeElement as HTMLElement;
        const selectedPower = compiled!.querySelector('#itemTypes > option:checked');
        helper.expectExists('#itemTypes > option:checked', true);
        expect(selectedPower?.textContent).toEqual('Rod');

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');
        expect(fixture.componentInstance.validating()).toBe(true);
        helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');

        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.validating()).toBe(false);

        helper.setSelectByIndex('#powers', minorIndex);
    
        expect(fixture.componentInstance.power).toEqual('Minor');
        expect(fixture.componentInstance.validating()).toBe(true);
        helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');

        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.validating()).toBe(false);
        expect(fixture.componentInstance.validItem()).toBe(false);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
      });

      const powerIndicesTestCases = Array.from(Array(4).keys());
      
      powerIndicesTestCases.forEach(powerIndex => {
        it(`should show that item is valid - power index ${powerIndex}`, async () => {
          const armorIndex = fixture.componentInstance.treasureModel()!.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Armor');

          helper.setSelectByIndex('#itemTypes', armorIndex);
          helper.setSelectByIndex('#powers', powerIndex);

          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel()!.itemTypeViewModels[armorIndex]);
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel()!.powers[powerIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating(), '#itemButton', '#itemValidating');
  
          //run validation
          await helper.waitForChangeDetection();
    
          expect(fixture.componentInstance.validating()).toBe(false);
          expect(fixture.componentInstance.validItem()).toBe(true);
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validItem(), '#itemButton', '#itemValidating');
        });
      });
    
      it(`should show when generating an item`, async () => {
        const component = fixture.componentInstance;
        component.generating.set(true);
  
        await helper.waitForChangeDetection();

        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);
      });
    
      it(`should generate the default item`, async () => {
        helper.clickButton('#itemButton');
  
        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        //run generate item
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComp = element.componentInstance as ItemComponent;
        expect(itemComp.item).toBeTruthy();
        expect(itemComp.item).not.toBeNull();
        expect(itemComp.item?.name).toBeTruthy();
      });
    
      it(`should generate the default item with name`, async () => {
        helper.setSelectByIndex('#itemNames', 1);

        expect(fixture.componentInstance.itemName).toEqual("Acid");
        expect(fixture.componentInstance.validating()).toBe(true);
        

        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.validating()).toBe(false);
        expect(fixture.componentInstance.validItem()).toBe(true);

        helper.clickButton('#itemButton');
  
        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        //run generate item
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComp = element.componentInstance as ItemComponent;
        expect(itemComp.item).toBeTruthy();
        expect(itemComp.item).not.toBeNull();
        expect(itemComp.item?.name).toEqual("Acid");
        expect(itemComp.item?.itemType).toEqual('Alchemical Item');
      });
    
      it(`should generate a non-default item`, async () => {
        helper.setSelectByIndex('#itemTypes', 1);
        helper.setSelectByIndex('#powers', 2);
  
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.validItem()).toBe(true);
        expect(fixture.componentInstance.validating()).toBe(false);

        helper.clickButton('#itemButton');
  
        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        //run roll
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComp = element.componentInstance as ItemComponent;
        expect(itemComp.item).toBeTruthy();
        expect(itemComp.item).not.toBeNull();
        expect(itemComp.item?.name).toBeTruthy();
        expect(itemComp.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with name`, async () => {
        helper.setSelectByIndex('#itemTypes', 1);
        helper.setSelectByIndex('#powers', 2);
  
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.validItem()).toBe(true);
        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel()!.itemNames['Armor']);
        helper.setSelectByIndex('#itemNames', 3);
  
        expect(fixture.componentInstance.itemName).toEqual('Banded mail');

        //run validation
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.validItem()).toBe(true);
        helper.clickButton('#itemButton');
  
        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        //run roll
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComp = element.componentInstance as ItemComponent;
        expect(itemComp.item).toBeTruthy();
        expect(itemComp.item).not.toBeNull();
        expect(['Banded mail', 'Banded Mail of Luck']).toContain(itemComp.item?.name);
        expect(itemComp.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with any name`, async () => {
        const wandIndex = fixture.componentInstance.treasureModel()!.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Wand');
        helper.setSelectByIndex('#itemTypes', wandIndex);
        helper.setSelectByIndex('#powers', 3);
  
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Wand');
        expect(fixture.componentInstance.power).toEqual('Major');

        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#anyItemName', 'Wand of Awesomeness');
  
        expect(fixture.componentInstance.itemName).toEqual('Wand of Awesomeness');

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#itemButton');
  
        helper.expectGenerating(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        //run generate item
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(), '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectExists('#downloadTreasureButton', false);

        helper.expectExists('#noTreasure', false);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComp = element.componentInstance as ItemComponent;
        expect(itemComp.item).toBeTruthy();
        expect(itemComp.item).not.toBeNull();
        expect(itemComp.item?.name).toEqual('Wand of Awesomeness');
        expect(itemComp.item?.itemType).toEqual('Wand');
        expect(itemComp.item?.isMagical).toBe(true);
        expect(itemComp.item?.magic.charges).toBeGreaterThan(0);
      });
    });
  
    it(`should render no treasure`, () => {
      helper.expectExists('#noTreasure', true);

      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();

      element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render treasure`, async () => {
      fixture.componentInstance.treasure.set(new Treasure());

      await helper.waitForChangeDetection();

      helper.expectExists('#noTreasure', false);
      helper.expectExists('#treasureSection dndgen-treasure', true);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render item`, async () => {
      fixture.componentInstance.item.set(new Item('my item', 'my item type'));

      await helper.waitForChangeDetection();

      helper.expectExists('#noTreasure', false);
      helper.expectExists('#treasureSection dndgen-item', true);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();
    });
    
    it(`should download treasure`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      let treasure = new Treasure(true, new Coin('munny', 9266));
      treasure.isAny = true;
      fixture.componentInstance.treasure.set(treasure);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadTreasureButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/^Treasure \(.+, [0-9] goods, [0-9] items\)\.txt$/));
        
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('9,266 munny\r\n' +
        'Goods (x0)\r\n' +
        'Items (x0)\r\n');
    });
    
    it(`should download item`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      let item = new Item('my item', 'my item type');
      item.summary = 'my item summary';
      fixture.componentInstance.item.set(item);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/^Item \(my item summary\)\.txt$/));
      
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('my item summary\r\n');
    });
    
    it(`BUG - should download armor`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      let armor = new Armor('my armor', 'Armor');
      armor.summary = 'my armor summary';
      armor.size = 'Medium';
      armor.totalArmorBonus = 9;
      armor.totalArmorCheckPenalty = -2;
      armor.totalMaxDexterityBonus = 6;

      fixture.componentInstance.item.set(armor as Item);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/^Item \(my armor summary\)\.txt$/));
      
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      const lines = text.split('\r\n');
      const expected = [
        'my armor summary',
        '\t' + 'Armor:',
        '\t\t' + 'Size: Medium',
        '\t\t' + 'Armor Bonus: 9',
        '\t\t' + 'Armor Check Penalty: -2',
        '\t\t' + 'Max Dexterity Bonus: 6',
        '',
      ];
      TestHelper.expectLines(lines, expected);
    });
    
    it(`BUG - should download weapon v1`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      let weapon = new Weapon('my weapon', 'Weapon');
      weapon.summary = 'my weapon summary';
      weapon.size = 'Medium';
      weapon.combatTypes = ['melee', 'ranged'];
      weapon.damageDescription = 'my damage description';
      weapon.threatRangeDescription = 'my threat range description';
      weapon.criticalDamageDescription = 'my critical damage description';

      fixture.componentInstance.item.set(weapon as Item);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/^Item \(my weapon summary\)\.txt$/));
      
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      const lines = text.split('\r\n');
      const expected = [
          'my weapon summary',
          '\t' + 'Weapon:',
          '\t\t' + 'Size: Medium',
          '\t\t' + 'Combat Types: melee, ranged',
          '\t\t' + 'Damage: my damage description',
          '\t\t' + 'Threat Range: my threat range description',
          '\t\t' + 'Critical Damage: my critical damage description',
          '',
      ];
      TestHelper.expectLines(lines, expected);
    });
    
    it(`BUG - should download weapon v2`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      let weapon = new Weapon('my weapon', 'Weapon');
      weapon.summary = 'my weapon summary';
      weapon.size = 'Medium';
      weapon.combatTypes = ['melee', 'ranged'];
      weapon.damageSummary = 'my damage summary';
      weapon.threatRangeSummary = 'my threat range summary';
      weapon.criticalDamageSummary = 'my critical damage summary';

      fixture.componentInstance.item.set(weapon as Item);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/^Item \(my weapon summary\)\.txt$/));
      
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      const lines = text.split('\r\n');
      const expected = [
          'my weapon summary',
          '\t' + 'Weapon:',
          '\t\t' + 'Size: Medium',
          '\t\t' + 'Combat Types: melee, ranged',
          '\t\t' + 'Damage: my damage summary',
          '\t\t' + 'Threat Range: my threat range summary',
          '\t\t' + 'Critical Damage: my critical damage summary',
          '',
      ];
      TestHelper.expectLines(lines, expected);
    });
  });
});