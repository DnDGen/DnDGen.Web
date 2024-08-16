import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';
import { FileSaverService } from '../shared/fileSaver.service';
import { TreasureService } from './services/treasure.service';
import { TreasureGenViewModel } from './models/treasuregenViewModel.model';
import { ItemTypeViewModel } from './models/itemTypeViewModel.model';
import { Treasure } from './models/treasure.model';
import { Item } from './models/item.model';
import { TreasureFormatterService } from './services/treasureFormatter.service';
import { UuidService } from '../shared/uuid.service';
import { concatMap, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'dndgen-treasuregen',
  templateUrl: './treasuregen.component.html',
  styleUrls: ['./treasuregen.component.css'],
  providers: [
    TreasureService,
    TreasureFormatterService,
  ]
})

export class TreasureGenComponent implements OnInit, OnChanges {
  constructor(
    private treasureService: TreasureService,
    private sweetAlertService: SweetAlertService,
    private fileSaverService: FileSaverService,
    private treasureFormatterService: TreasureFormatterService,
    private idService: UuidService,
    private logger: LoggerService) { }

  public treasureModel!: TreasureGenViewModel;
  public itemNames: string[] = [];
  
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
      .subscribe({
        next: data => this.setViewModel(data),
        error: error => this.handleError(error)
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['treasureType'] || changes['level']) {
      this.validateTreasure(this.treasureType, this.level);
    }
    else if (changes['itemType'] || changes['power'] || changes['itemName']) {
      this.validateItem(this.itemType!.itemType, this.power, this.itemName);
    }
  }

  private setViewModel(data: TreasureGenViewModel): void {
    this.treasureModel = data;
    this.validating = false;

    this.treasureType = this.treasureModel.treasureTypes[0];
    this.power = this.treasureModel.powers[0];

    //INFO: Doing this instead of calling updateItemType to avoid validation observable
    this.itemType = this.treasureModel.itemTypeViewModels[0];
    this.itemNames = this.treasureModel.itemNames[this.itemType.itemType]!;
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
  
  public updateItemType(itemType: ItemTypeViewModel) {
    this.itemType = itemType;
    this.itemNames = this.treasureModel.itemNames[this.itemType.itemType]!;
    this.itemName = '';

    this.validateItem(this.itemType!.itemType, this.power, this.itemName);
  }

  public downloadTreasure() {
    if (!this.treasure)
      return;

    let formattedTreasure = this.treasureFormatterService.formatTreasure(this.treasure);
    let fileName = 'Treasure ' + this.idService.generate();

    this.fileSaverService.save(formattedTreasure, fileName);
  }

  public downloadItem() {
    if (!this.item)
      return;

    let formattedItem = this.treasureFormatterService.formatItem(this.item);
    let fileName = `Item (${this.item.name}) ` + this.idService.generate();

    this.fileSaverService.save(formattedItem, fileName);
  }
}
