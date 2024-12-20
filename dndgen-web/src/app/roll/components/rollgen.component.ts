import { Input, Component, OnInit } from '@angular/core';
import { RollService } from '../services/roll.service';
import { StandardDie } from '../models/standardDie.model';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { RollGenViewModel } from '../models/rollgenViewModel.model';
import { Size } from '../../shared/components/size.enum';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
    selector: 'dndgen-rollgen',
    templateUrl: './rollgen.component.html',
    styleUrls: ['./rollgen.component.css'],
    providers: [
        RollService
    ],
    standalone: true,
    imports: [LoadingComponent, FormsModule, DecimalPipe]
})

export class RollGenComponent implements OnInit {
  constructor(
    private rollService: RollService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public rollModel!: RollGenViewModel;
  public sizes = Size;

  private expressionText$ = new Subject<string>();

  @Input() standardQuantity = 1;
  @Input() customQuantity = 1;
  @Input() customDie = 5;
  @Input() expression = '4d6k3+2';

  public rolling = false;
  public loading = false;
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
    this.loading = true;

    this.rollService.getViewModel()
      .subscribe({
        next: data => this.setViewModel(data),
        error: error => this.handleError(error)
      });
    
    this.expressionText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(expression => this.rollService.validateExpression(expression)
          //We will not display an error message here
          //One example is if you send a badly-formatted expression, such as "(1d6", it returns a 500
          //This isn't an actual error, just invalid, so set it as such
          .pipe(catchError(() => of(false)))),
        tap(data => this.setRollValidity(data))
      )
      .subscribe();
  }

  private setViewModel(data: RollGenViewModel): void {
    this.rollModel = data;
    this.loading = false;
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
    this.loading = false;

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

    this.expressionText$.next(expression);
  }
}
