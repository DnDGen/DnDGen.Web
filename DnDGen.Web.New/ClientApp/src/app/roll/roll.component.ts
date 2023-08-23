import { Component } from '@angular/core';
import { RollService } from './roll.service';

@Component({
  selector: 'dndgen-roll-component',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css'],
  providers: [ RollService ]
})

export class RollComponent {
  constructor(
    private rollService: RollService,
    private sweetAlertService: SweetAlertService) { }

  public standardQuantity = 1;
  public customQuantity = 1;
  public customDie = 1;
  public rolling = false;
  public expression = '3d6+2';
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

  public standardDie = this.standardDice[7];

  public rollStandard() {
    this.rolling = true;
    this.rollService.getRoll(this.standardQuantity, this.standardDie.die)
      .then(setRoll, handleError);
  };

  setRoll(response) {
    this.roll = response.data;
    this.rolling = false;
  }

  handleError() {
    sweetAlertService.showError();
    this.roll = 0;
    this.rolling = false;
    this.validating = false;
  }

  public rollCustom() {
    this.rolling = true;
    rollService.getRoll(this.customQuantity, this.customDie)
      .then(setRoll, handleError);
  };

  public rollExpression() {
    this.rolling = true;
    rollService.getExpressionRoll(this.expression)
      .then(setRoll, handleError);
  };

  $scope.$watch('vm.expression', function (newValue, oldValue) {
    vm.validating = true;

    if (!vm.expression || vm.expression === '') {
      vm.rollIsValid = false;
      vm.validating = false;
    }
    else {
      rollService.validateExpression(vm.expression).then(function (response) {
        vm.rollIsValid = response.data;
        vm.validating = false;
      }, function () {
        handleError();
        vm.rollIsValid = false;
      });
    }
  });

  $scope.$watch('vm.standardQuantity', function (newValue, oldValue) {
    validateRoll(vm.standardQuantity, vm.standardDie.die);
  });

  $scope.$watch('vm.standardDie', function (newValue, oldValue) {
    validateRoll(vm.standardQuantity, vm.standardDie.die);
  }, true);

  $scope.$watch('vm.customQuantity', function (newValue, oldValue) {
    validateRoll(vm.customQuantity, vm.customDie);
  });

  $scope.$watch('vm.customDie', function (newValue, oldValue) {
    validateRoll(vm.customQuantity, vm.customDie);
  });

  function validateRoll(quantity, die) {
    vm.validating = true;

    if (!quantity || !die || quantity === '' || die === '') {
      vm.rollIsValid = false;
      vm.validating = false;
    }
    else {
      rollService.validateRoll(quantity, die).then(function (response) {
        vm.rollIsValid = response.data;
        vm.validating = false;
      }, function () {
        handleError();
        vm.rollIsValid = false;
      });
    }
  }
}
