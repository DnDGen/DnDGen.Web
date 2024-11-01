import { Input, Component, OnInit } from '@angular/core';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { switchMap, tap } from 'rxjs';
import { CharacterPipe } from '../../character/pipes/character.pipe';
import { Size } from '../../shared/components/size.enum';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { TreasurePipe } from '../../treasure/pipes/treasure.pipe';
import { DecimalPipe } from '@angular/common';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { InchesToFeetPipe } from '../../character/pipes/inchesToFeet.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spellQuantity.pipe';
import { EncounterService } from '../services/encounter.service';
import { EncounterPipe } from '../pipes/encounter.pipe';
import { EncounterGenViewModel } from '../models/encountergenViewModel.model';
import { CreatureTypeFilter } from '../models/creatureTypeFilter.model';
import { Encounter } from '../models/encounter.model';
import { EncounterComponent } from './encounter.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
    selector: 'dndgen-encountergen',
    templateUrl: './encountergen.component.html',
    providers: [
        EncounterService,
        EncounterPipe,
        CharacterPipe,
        ItemPipe,
        TreasurePipe,
        DecimalPipe,
        MeasurementPipe,
        InchesToFeetPipe,
        FrequencyPipe,
        SpellQuantityPipe,
    ],
    standalone: true,
    imports: [LoadingComponent, FormsModule, EncounterComponent]
})

export class EncounterGenComponent implements OnInit {
  constructor(
    private encounterService: EncounterService,
    private encounterPipe: EncounterPipe,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public encounterModel!: EncounterGenViewModel;
  public sizes = Size;
  public creatureTypeFilters: CreatureTypeFilter[] = [];

  @Input() temperature = '';
  @Input() environment = '';
  @Input() timeOfDay = '';
  @Input() level = 1;
  @Input() allowAquatic = false;
  @Input() allowUnderground = false;

  public loading = false;
  public encounter: Encounter | null = null;
  public valid: boolean = false;
  public validating: boolean = false;
  public generating: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.validating = true;

    this.encounterService.getViewModel()
      .pipe(
        tap(data => this.encounterModel = data),
        tap(() => this.setInitialValues()),
        switchMap(() => this.encounterService
          .validate(
            this.environment,
            this.temperature,
            this.timeOfDay,
            this.level,
            this.checkedFilters,
            this.allowAquatic,
            this.allowUnderground)),
        tap(data => this.valid = data),
      )
      .subscribe({
        complete: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private finishInit(): void {
    this.validating = false;
    this.loading = false;
  }

  private setInitialValues(): void {
    this.temperature = this.encounterModel.defaults.temperature;
    this.environment = this.encounterModel.defaults.environment;
    this.timeOfDay = this.encounterModel.defaults.timeOfDay;
    this.level = this.encounterModel.defaults.level;
    
    for (var i = 0; i < this.encounterModel.creatureTypes.length; i++) {
      this.creatureTypeFilters.push({ 
          id: this.encounterModel.creatureTypes[i].replaceAll(' ', '_'),
          displayName: this.encounterModel.creatureTypes[i],
          checked: false
      });
    }
  }

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.encounter = null;

    this.loading = false;
    this.generating = false;
    this.validating = false;
    
    this.sweetAlertService.showError();
  }

  public validate(
    environment: string,
    temperature: string,
    timeOfDay: string,
    level: number,
    allowAquatic: boolean,
    allowUnderground: boolean,
  ): void {
    this.validating = true;

    if (!level) {
      this.setValidity(false);
      return;
    }

    this.encounterService
      .validate(
        environment,
        temperature,
        timeOfDay,
        level,
        this.checkedFilters,
        allowAquatic,
        allowUnderground,
      )
      .subscribe({
        next: data => this.setValidity(data),
        error: error => {
          this.setValidity(false);
          this.handleError(error);
        }
      });
  }
  
  private get checkedFilters(): string[] {
    var checkedFilters = [];

    for (var i = 0; i < this.creatureTypeFilters.length; i++) {
        if (this.creatureTypeFilters[i].checked) {
            checkedFilters.push(this.creatureTypeFilters[i].displayName);
        }
    }

    return checkedFilters;
  }

  private setValidity(data: boolean) {
    this.valid = data;
    this.validating = false;
  }

  public generateEncounter(): void {
    this.generating = true;
    this.encounter = null;

    this.encounterService
      .generate(
        this.environment,
        this.temperature,
        this.timeOfDay,
        this.level,
        this.checkedFilters,
        this.allowAquatic,
        this.allowUnderground,
      )
      .pipe(
        tap(data => this.encounter = data),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private finishGeneration(): void {
    this.generating = false;
  }

  public download(): void {
    if (!this.encounter) {
      return;
    }

    var formattedEncounter = this.encounterPipe.transform(this.encounter);
    this.fileSaverService.save(formattedEncounter, this.encounter.description);
  }
}
