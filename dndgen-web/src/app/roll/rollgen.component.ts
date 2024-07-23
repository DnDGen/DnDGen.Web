import { Input, Component, OnInit } from '@angular/core';
import { RollService } from './services/roll.service';
import { StandardDie } from './models/standardDie.model';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';
import { RollGenViewModel } from './models/rollgenViewModel.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'dndgen-rollgen',
  templateUrl: './rollgen.component.html',
  styleUrls: ['./rollgen.component.css'],
  providers: [
    RollService
  ]
})

export class RollGenComponent implements OnInit {
  constructor(
    private rollService: RollService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public rollModel!: RollGenViewModel;

  @Input() standardQuantity = 1;
  @Input() customQuantity = 1;
  @Input() customDie = 1;
  @Input() expression = '3d6+2';

  public rolling = false;
  public validating = false;
  public rollIsValid = true;

  public roll = 0;

  public standardDice: StandardDie[] = [
    new StandardDie('2', 2),
    new StandardDie('3', 3),
    new StandardDie('4', 4),
    new StandardDie('6', 6),
    new StandardDie('8', 8),
    new StandardDie('10', 10),
    new StandardDie('12', 12),
    new StandardDie('20', 20),
    new StandardDie('Percentile', 100)
  ];

  @Input() standardDie = this.standardDice[7];

  ngOnInit(): void {
    this.rollService.getViewModel()
      .subscribe({
        next: data => this.setViewModel(data),
        error: error => this.handleError(error)
      });
  }

  private setViewModel(data: RollGenViewModel): void {
    this.rollModel = data;
  }

  public rollStandard() {
    this.rolling = true;

    this.rollService.getRoll(this.standardQuantity, this.standardDie.die)
      .subscribe({
        next: data => this.setRoll(data),
        error: error => this.handleError(error)
      });
  };

  private setRoll(rollResult: number) {
    this.roll = rollResult;
    this.rolling = false;
  }

  private handleError(error: any) {
    this.logger.logError(error.message);

    this.roll = 0;
    this.rolling = false;
    this.validating = false;

    this.sweetAlertService.showError();
  }

  public rollCustom() {
    this.rolling = true;

    this.rollService.getRoll(this.customQuantity, this.customDie)
      .subscribe({
        next: data => this.setRoll(data),
        error: error => this.handleError(error)
      });
  };

  public rollExpression() {
    this.rolling = true;

    this.rollService.getExpressionRoll(this.expression)
      .subscribe({
        next: data => this.setRoll(data),
        error: error => this.handleError(error)
      });
  };
  
  public validateRoll(quantity: number, die: number) {
    this.validating = true;

    if (!quantity || !die) {
      this.rollIsValid = false;
      this.validating = false;
      return;
    }

    this.rollService.validateRoll(quantity, die)
      .subscribe({
        next: data => this.setRollValidity(data),
        error: error => this.handleValidationError(error)
      });
  }

  private setRollValidity(data: boolean) {
    this.rollIsValid = data;
    this.validating = false;
  }

  private handleValidationError(error: any) {
    this.rollIsValid = false;

    this.handleError(error);
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
        next: data => this.setRollValidity(data),
        error: error => this.handleValidationError(error)
      });
  }
}
