import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { RollService } from './roll.service';
import { SweetAlertService } from '../shared/sweetAlert.service';

@Component({
  selector: 'dndgen-roll-component',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css'],
  providers: [ RollService ]
})

export class RollComponent implements OnChanges {
  constructor(
    private rollService: RollService,
    private sweetAlertService: SweetAlertService) { }

  @Input() standardQuantity = 1;
  @Input() customQuantity = 1;
  @Input() customDie = 1;
  @Input() expression = '3d6+2';

  public rolling = false;
  public validating = false;
  public rollIsValid = false;

  public roll = 0;

  public standardDice = [
    { name: '2', die: 2 },
    { name: '3', die: 3 },
    { name: '4', die: 4 },
    { name: '6', die: 6 },
    { name: '8', die: 8 },
    { name: '10', die: 10 },
    { name: '12', die: 12 },
    { name: '20', die: 20 },
    { name: 'Percentile', die: 100 }
  ];

  @Input() standardDie = this.standardDice[7];

  public rollStandard() {
    this.rolling = true;
    var rollResult = this.rollService.getRoll(this.standardQuantity, this.standardDie.die);

    if (rollResult == null) {
      this.handleError();
      return;
    }

    this.setRoll(rollResult);
  };

  private setRoll(rollResult: number) {
    this.roll = rollResult;
    this.rolling = false;
  }

  private handleError() {
    this.sweetAlertService.showError();
    this.roll = 0;
    this.rolling = false;
    this.validating = false;
  }

  public rollCustom() {
    this.rolling = true;
    var rollResult = this.rollService.getRoll(this.customQuantity, this.customDie);

    if (rollResult == null) {
      this.handleError();
      return;
    }

    this.setRoll(rollResult);
  };

  public rollExpression() {
    this.rolling = true;
    var rollResult = this.rollService.getExpressionRoll(this.expression);

    if (rollResult == null) {
      this.handleError();
      return;
    }

    this.setRoll(rollResult);
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.standardQuantity.currentValue != changes.standardQuantity.previousValue
      || changes.standardDie.currentValue != changes.standardDie.previousValue) {
      this.validateRoll(changes.standardQuantity.currentValue, changes.standardDie.currentValue);
    }

    if (changes.customQuantity.currentValue != changes.customQuantity.previousValue
      || changes.customDie.currentValue != changes.customDie.previousValue) {
      this.validateRoll(changes.customQuantity.currentValue, changes.customDie.currentValue);
    }

    if (changes.expression.currentValue != changes.expression.previousValue) {
      this.validateExpression(changes.expression.currentValue);
    }
  }

  private validateRoll(quantity: number, die: number) {
    this.validating = true;

    if (!quantity || !die) {
      this.rollIsValid = false;
      this.validating = false;
      return;
    }

    var validationResult = this.rollService.validateRoll(quantity, die);

    if (validationResult == null) {
      this.handleError();
      this.rollIsValid = false;
      return;
    }

    this.rollIsValid = validationResult;
    this.validating = false;
  }

  private validateExpression(expression: string) {
    this.validating = true;

    if (!expression || expression === '') {
      this.rollIsValid = false;
      this.validating = false;
      return;
    }

    var validationResult = this.rollService.validateExpression(expression);

    if (validationResult == null) {
      this.handleError();
      this.rollIsValid = false;
      return;
    }

    this.rollIsValid = validationResult;
    this.validating = false;
  }
}
