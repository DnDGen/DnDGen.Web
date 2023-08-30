import { Input, Component, OnInit } from '@angular/core';
import { RollService } from './roll.service';
import { StandardDie } from './standardDie.model';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';

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
    this.roll = 0;
    this.rolling = false;
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

  ngOnInit(): void {
    this.standardDie = this.standardDice[7];

    this.validateRoll(this.standardQuantity, this.standardDie.die);
    this.validateRoll(this.customQuantity, this.customDie);
    this.validateExpression(this.expression);
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
