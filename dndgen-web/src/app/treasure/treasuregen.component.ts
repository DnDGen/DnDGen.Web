import { Input, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'dndgen-treasuregen',
  templateUrl: './treasuregen.component.html',
  styleUrls: ['./treasuregen.component.css'],
  providers: [
    TreasureService,
    // TreasureFormatterService,
  ]
})

export class TreasureGenComponent implements OnInit {
  constructor(
    private treasureService: TreasureService,
    private sweetAlertService: SweetAlertService,
    private fileSaverService: FileSaverService,
    private treasureFormatterService: TreasureFormatterService,
    private idService: UuidService,
    private logger: LoggerService) { }

  ngOnInit(): void {
    this.treasureService.getViewModel()
      .subscribe({
        next: this.setViewModel,
        error: this.handleError
      });
  }

  private setViewModel(data: TreasureGenViewModel): void {
    this.treasureModel = data;

    this.treasureType = this.treasureModel.treasureTypes[0];
    this.itemType = this.treasureModel.itemTypeViewModels[0];
    this.power = this.treasureModel.powers[0];
    this.itemNames = this.treasureModel.itemNames[this.itemType.itemType]!;

    // this.validateTreasure(this.treasureType, this.level);
    // this.validateItem(this.itemType.itemType, this.power, this.itemName);
  }

  public treasureModel!: TreasureGenViewModel;
  public itemNames!: string[];
  @Input() level = 1;
  @Input() treasureType = '';
  @Input() itemType: ItemTypeViewModel | null = null;
  @Input() power = '';
  @Input() itemName = '';

  public generating = false;
  public validating = false;
  public validTreasure = false;
  public validItem = true;

  public treasure: Treasure | null = null;
  public item: Item | null = null;
  
  public generateTreasure() {
    this.generating = true;

    this.treasureService.getTreasure(this.treasureType, this.level)
      .subscribe({
        next: this.setTreasure,
        error: this.handleError
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
        next: this.setItem,
        error: this.handleError
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
      this.validTreasure = false;
      this.validating = false;
      return;
    }

    this.treasureService.validateTreasure(treasureType, level)
      .subscribe({
        next: this.setTreasureValidity,
        error: this.handleValidationError
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
      this.validItem = false;
      this.validating = false;
      return;
    }

    this.treasureService.validateItem(itemType, power, itemName)
      .subscribe({
        next: this.setItemValidity,
        error: this.handleValidationError
      });
  }

  private setItemValidity(data: boolean) {
    this.validItem = data;
    this.validating = false;
  }
  
  public updateItemNames(itemType: ItemTypeViewModel) {
    this.itemNames = this.treasureModel.itemNames[itemType.itemType]!;
    this.itemName = '';

    this.validateItem(this.itemType!.itemType, this.power, this.itemName);
  }

  public downloadTreasure() {
    if (!this.treasure)
      return;

    var formattedTreasure = this.treasureFormatterService.formatTreasure(this.treasure);
    var fileName = 'Treasure ' + this.idService.generate();

    this.fileSaverService.save(formattedTreasure, fileName);
  }

  public downloadItem() {
    if (!this.item)
      return;

    var formattedItem = this.treasureFormatterService.formatItem(this.item);
    var fileName = 'Item (' + this.item.name + ') ' + this.idService.generate();

    this.fileSaverService.save(formattedItem, fileName);
  }
}
