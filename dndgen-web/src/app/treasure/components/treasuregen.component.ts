import { Input, Component, OnInit } from '@angular/core';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { TreasureService } from '../services/treasure.service';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Item } from '../models/item.model';
import { ItemPipe } from '../pipes/item.pipe';
import { TreasurePipe } from '../pipes/treasure.pipe';
import { switchMap, tap } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'dndgen-treasuregen',
  templateUrl: './treasuregen.component.html',
  styleUrls: ['./treasuregen.component.css'],
  providers: [
    TreasureService,
    ItemPipe,
    TreasurePipe,
    DecimalPipe,
  ]
})

export class TreasureGenComponent implements OnInit {
  constructor(
    private treasureService: TreasureService,
    private sweetAlertService: SweetAlertService,
    private fileSaverService: FileSaverService,
    private itemPipe: ItemPipe,
    private treasurePipe: TreasurePipe,
    private logger: LoggerService) { }

  public treasureModel!: TreasureGenViewModel;

  public get loading(): boolean {
    if (this.treasureModel) {
      return true;
    }

    return false;
  }

  public get itemNames() {
    if (!(this.itemType))
      return [];

    let names = this.treasureModel.itemNames[this.itemType.itemType];

    if (!names)
      return [];

    return names;
  }
  
  @Input() level = 1;
  @Input() treasureType = '';
  @Input() itemType: ItemTypeViewModel | null = null;
  @Input() power = '';
  @Input() itemName = '';

  public generating = false;
  public validating = false;
  public validTreasure = false;
  public validItem = false;

  public treasure: Treasure | null = null;
  public item: Item | null = null;
    
  ngOnInit(): void {
    this.validating = true;

    this.treasureService.getViewModel()
      .pipe(
        tap(data => this.treasureModel = data),
        tap(() => this.setInitialValues()),
        switchMap(() => this.treasureService.validateTreasure(this.treasureType, this.level)),
        tap(data => this.validTreasure = data),
        switchMap(() => this.treasureService.validateItem(this.itemType!.itemType, this.power, this.itemName)),
        tap(data => this.validItem = data),
      )
      .subscribe({
        next: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private finishInit(): void {
    this.validating = false;
  }

  private setInitialValues(): void {
    this.treasureType = this.treasureModel.treasureTypes[0];
    this.power = this.treasureModel.powers[0];
    this.itemType = this.treasureModel.itemTypeViewModels[0];
    this.itemName = '';
  }

  public generateTreasure() {
    this.generating = true;

    this.treasureService.getTreasure(this.treasureType, this.level)
      .subscribe({
        next: data => this.setTreasure(data),
        error: error => this.handleError(error)
      });
  };

  private setTreasure(data: Treasure) {
    this.treasure = data;
    this.generating = false;

    this.item = null;
  }

  private handleError(error: any) {
    this.logger.logError(error.message);

    this.generating = false;
    this.validating = false;
    this.treasure = null;
    this.item = null;

    this.sweetAlertService.showError();
  }

  public generateItem() {
    this.generating = true;

    this.treasureService.getItem(this.itemType!.itemType, this.power, this.itemName)
      .subscribe({
        next: data => this.setItem(data),
        error: error => this.handleError(error)
      });
  };

  private setItem(data: Item) {
    this.item = data;
    this.generating = false;

    this.treasure = null;
  }
  
  public validateTreasure(treasureType: string, level: number) {
    this.validating = true;

    if (!treasureType || !level) {
      this.setTreasureValidity(false);
      return;
    }

    this.treasureService.validateTreasure(treasureType, level)
      .subscribe({
        next: data => this.setTreasureValidity(data),
        error: error => this.handleValidationError(error)
      });
  }

  private setTreasureValidity(data: boolean) {
    this.validTreasure = data;
    this.validating = false;
  }

  private handleValidationError(error: any) {
    this.validItem = false;
    this.validTreasure = false;

    this.handleError(error);
  }

  public validateItem(itemType: string, power: string, itemName: string) {
    this.validating = true;

    if (!itemType || !power) {
      this.setItemValidity(false);
      return;
    }

    this.treasureService.validateItem(itemType, power, itemName)
      .subscribe({
        next: data => this.setItemValidity(data),
        error: error => this.handleValidationError(error)
      });
  }

  private setItemValidity(data: boolean) {
    this.validItem = data;
    this.validating = false;
  }
  
  public validateItemAndResetName(itemType: string, power: string, itemName: string) {
    this.itemName = itemName;

    this.validateItem(itemType, power, itemName);
  }

  public downloadTreasure() {
    if (!this.treasure)
      return;

    const formattedTreasure = this.treasurePipe.transform(this.treasure);
    const coins = this.treasure.coin.quantity == 0 ? '0 coins' : `${this.treasure.coin.quantity} ${this.treasure.coin.currency}`;
    const fileName = `Treasure (${coins}, ${this.treasure.goods.length} goods, ${this.treasure.items.length} items)`;

    this.fileSaverService.save(formattedTreasure, fileName);
  }

  public downloadItem() {
    if (!this.item)
      return;

    let formattedItem = this.itemPipe.transform(this.item);
    let fileName = `Item (${this.item.description})`;

    this.fileSaverService.save(formattedItem, fileName);
  }
}
