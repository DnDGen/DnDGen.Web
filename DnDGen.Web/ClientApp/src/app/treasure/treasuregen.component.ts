import { Input, Component, OnInit } from '@angular/core';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';
import { FileSaverService } from '../shared/fileSaver.service';
import { TreasureService } from './treasure.service';
import { TreasureGenViewModel } from './treasuregenViewModel.model';
import { ItemTypeViewModel } from './itemTypeViewModel.model';
import { Treasure } from './treasure.model';
import { Item } from './item.model';
import { TreasureFormatterService } from './treasureFormatter.service';

@Component({
  selector: 'dndgen-treasuregen',
  templateUrl: './treasuregen.component.html',
  styleUrls: ['./treasuregen.component.css'],
  providers: [
    TreasureService,
  ]
})

export class TreasureGenComponent implements OnInit {
  constructor(
    private treasureService: TreasureService,
    private sweetAlertService: SweetAlertService,
    private fileSaverService: FileSaverService,
    private treasureFormatterService: TreasureFormatterService,
    private logger: LoggerService) { }

  ngOnInit(): void {
    this.treasureService.getViewModel()
      .subscribe({
        next: data => {
          this.setViewModel(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  }

  private setViewModel(data: TreasureGenViewModel): void {
    this.treasureModel = data;

    this.treasureType = this.treasureModel.treasureTypes[0];
    this.itemType = this.treasureModel.itemTypeViewModels[0];
    this.power = this.treasureModel.powers[0];
    this.itemNames = this.treasureModel.itemNames.get(this.itemType.itemType);

    this.validateRoll(this.standardQuantity, this.standardDie.die);
    this.validateRoll(this.customQuantity, this.customDie);
    this.validateExpression(this.expression);
  }

  public treasureModel!: TreasureGenViewModel;
  public itemNames!: string[] | undefined;
  @Input() level = 1;
  @Input() treasureType = '';
  @Input() itemType: ItemTypeViewModel = this.treasureModel.itemTypeViewModels[0];;
  @Input() power = '';
  @Input() itemName = null;

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
        next: data => {
          this.setTreasure(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  };

  private setTreasure(data: Treasure) {
    this.treasure = data;
    this.generating = false;

    this.item = null;
  }

  private handleError() {
    this.sweetAlertService.showError();

    this.generating = false;
    this.validating = false;
    this.treasure = null;
    this.item = null;
  }

  public generateItem() {
    this.generating = true;

    this.treasureService.getItem(this.itemType.itemType, this.power, this.itemName)
      .subscribe({
        next: data => {
          this.setItem(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  };

  private setItem(data: Item) {
    this.item = data;
    this.generating = false;

    this.treasure = null;
  }

  function validateTreasure() {
    this.validating = true;

    treasureService.validateTreasure(this.treasureType, this.level)
      .then(setTreasureValidity, handleValidationError);
  }

  function setTreasureValidity(response) {
    this.validTreasure = response.data;
    this.validating = false;
  }

  function handleValidationError() {
    this.generating = false;
    this.validating = false;
    this.validItem = false;
    this.validTreasure = false;
  }

  function validateItem() {
    this.validating = true;

    treasureService.validateItem(this.itemType.itemType, this.power, this.itemName)
      .then(setItemValidity, handleValidationError);
  }

  function setItemValidity(response) {
    this.validItem = response.data;
    this.validating = false;
  }

  $scope.$watch('this.treasureType', validateTreasure, true);
  $scope.$watch('this.level', validateTreasure, true);

  $scope.$watch('this.itemType', function (newValue, oldValue) {
    this.itemNames = this.treasureModel.itemNames[this.itemType.itemType];
    this.itemName = null;

    validateItem();
  }, true);

  $scope.$watch('this.power', validateItem, true);
  $scope.$watch('this.itemName', validateItem, true);

  this.downloadTreasure = function () {
    var formattedTreasure = treasureFormatterService.formatTreasure(this.treasure);
    var fileName = 'Treasure ' + new Date().toString();

    fileSaverService.save(formattedTreasure, fileName);
  };

  this.downloadItem = function () {
    var formattedItem = treasureFormatterService.formatItem(this.item);
    var fileName = 'Item (' + this.item.name + ') ' + new Date().toString();

    fileSaverService.save(formattedItem, fileName);
  };

  public rollStandard() {
    this.rolling = true;

    this.rollService.getRoll(this.standardQuantity, this.standardDie.die)
      .subscribe({
        next: data => {
          this.setRoll(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  };

  private setRoll(rollResult: number) {
    this.roll = rollResult;
    this.rolling = false;
  }

  private handleError() {
    this.sweetAlertService.showError();
    this.treasure = null;
    this.item = null;
    this.generating = false;
    this.validating = false;
  }

  public rollCustom() {
    this.rolling = true;

    this.rollService.getRoll(this.customQuantity, this.customDie)
      .subscribe({
        next: data => {
          this.setRoll(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  };

  public rollExpression() {
    this.rolling = true;

    this.rollService.getExpressionRoll(this.expression)
      .subscribe({
        next: data => {
          this.setRoll(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  };

  public validateTreasure(treasureType: string, level: number) {
    this.validating = true;

    if (!treasureType || !level) {
      this.validTreasure = false;
      this.validating = false;
      return;
    }

    this.treasureService.validateTreasure(treasureType, level)
      .subscribe({
        next: data => {
          this.validTreasure = data;
          this.validating = false;
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();

          this.generating = false;
          this.validating = false;
          this.validItem = false;
          this.validTreasure = false;
        }
      });
  }
  
  public validateRoll(quantity: number, die: number) {
    this.validating = true;

    if (!quantity || !die) {
      this.rollIsValid = false;
      this.validating = false;
      return;
    }

    this.rollService.validateRoll(quantity, die)
      .subscribe({
        next: data => {
          this.rollIsValid = data;
          this.validating = false;
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
          this.rollIsValid = false;
        }
      });
  }

  public validateExpression(expression: string) {
    this.validating = true;

    if (!expression || expression === '') {
      this.rollIsValid = false;
      this.validating = false;
      return;
    }

    this.rollService.validateExpression(expression)
      .subscribe({
        next: data => {
          this.rollIsValid = data;
          this.validating = false;
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
          this.rollIsValid = false;
        }
      });
  }
}
