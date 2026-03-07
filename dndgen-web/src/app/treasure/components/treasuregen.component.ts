import { Input, Component, OnInit, signal } from '@angular/core';
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
import { Size } from '../../shared/components/size.enum';
import { ItemComponent } from './item.component';
import { TreasureComponent } from './treasure.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-treasuregen',
    templateUrl: './treasuregen.component.html',
    styleUrls: ['./treasuregen.component.css'],
    providers: [
        TreasureService,
        TreasurePipe,
        ItemPipe,
        DecimalPipe,
    ],
    standalone: true,
    imports: [LoadingComponent, FormsModule, TreasureComponent, ItemComponent, NgbNavModule]
})
export class TreasureGenComponent implements OnInit {
  constructor(
    private treasureService: TreasureService,
    private sweetAlertService: SweetAlertService,
    private fileSaverService: FileSaverService,
    private itemPipe: ItemPipe,
    private treasurePipe: TreasurePipe,
    private logger: LoggerService) { }

  public treasureModel = signal<TreasureGenViewModel | undefined>(undefined);
  public sizes = Size;

  public get itemNames() {
    const model = this.treasureModel();
    const type = this.itemType;
    
    if (!type || !model)
      return [];

    let names = model.itemNames[type.itemType];

    if (!names)
      return [];

    return names;
  }
  
  @Input() level = 1;
  @Input() treasureType = '';
  @Input() itemType: ItemTypeViewModel | null = null;
  @Input() power = '';
  @Input() itemName = '';

  public loading = signal(false);
  public generating = signal(false);
  public validating = signal(false);
  public validTreasure = signal(false);
  public validItem = signal(false);

  public treasure = signal<Treasure | null>(null);
  public item = signal<Item | null>(null);
    
  ngOnInit(): void {
    this.validating.set(true);
    this.loading.set(true);

    this.treasureService.getViewModel()
      .pipe(
        tap(data => this.setViewModel(data)),
        tap(() => this.setInitialValues()),
        switchMap(() => this.treasureService.validateTreasure(this.treasureType, this.level)),
        tap(data => this.setTreasureValidity(data)),
        switchMap(() => this.treasureService.validateItem(this.itemType!.itemType, this.power, this.itemName)),
        tap(data => this.setItemValidity(data)),
      )
      .subscribe({
        complete: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private setViewModel(data: TreasureGenViewModel): void {
    this.treasureModel.set(data);
  }

  private finishInit(): void {
    this.validating.set(false);
    this.loading.set(false);
  }

  private setInitialValues(): void {
    const model = this.treasureModel();
    if (!model) return;
    
    this.treasureType = model.treasureTypes[0];
    this.power = model.powers[0];
    this.itemType = model.itemTypeViewModels[0];
    this.itemName = '';
  }

  public generateTreasure() {
    this.generating.set(true);

    this.treasureService.getTreasure(this.treasureType, this.level)
      .subscribe({
        next: data => this.setTreasure(data),
        error: error => this.handleError(error)
      });
  };

  private setTreasure(data: Treasure) {
    this.treasure.set(data);
    this.generating.set(false);

    this.item.set(null);
  }

  private handleError(error: any) {
    this.logger.logError(error.message);

    this.generating.set(false);
    this.loading.set(false);
    this.validating.set(false);
    this.treasure.set(null);
    this.item.set(null);

    this.sweetAlertService.showError();
  }

  public generateItem() {
    this.generating.set(true);

    this.treasureService.getItem(this.itemType!.itemType, this.power, this.itemName)
      .subscribe({
        next: data => this.setItem(data),
        error: error => this.handleError(error)
      });
  };

  private setItem(data: Item) {
    this.item.set(data);
    this.generating.set(false);

    this.treasure.set(null);
  }
  
  public validateTreasure(treasureType: string, level: number) {
    this.validating.set(true);

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
    this.validTreasure.set(data);
    this.validating.set(false);
  }

  private handleValidationError(error: any) {
    this.validItem.set(false);
    this.validTreasure.set(false);

    this.handleError(error);
  }

  public validateItem(itemType: string, power: string, itemName: string) {
    this.validating.set(true);

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
    this.validItem.set(data);
    this.validating.set(false);
  }
  
  public validateItemAndResetName(itemType: string, power: string, itemName: string) {
    this.itemName = itemName;

    this.validateItem(itemType, power, itemName);
  }

  public downloadTreasure() {
    const treasureData = this.treasure();
    if (!treasureData)
      return;

    const formattedTreasure = this.treasurePipe.transform(treasureData);
    const coins = treasureData.coin.quantity == 0 ? '0 coins' : `${treasureData.coin.quantity} ${treasureData.coin.currency}`;
    const fileName = `Treasure (${coins}, ${treasureData.goods.length} goods, ${treasureData.items.length} items)`;

    this.fileSaverService.save(formattedTreasure, fileName);
  }

  public downloadItem() {
    const itemData = this.item();
    if (!itemData)
      return;

    let formattedItem = this.itemPipe.transform(itemData);
    let fileName = `Item (${itemData.summary})`;

    this.fileSaverService.save(formattedItem, fileName);
  }
}
