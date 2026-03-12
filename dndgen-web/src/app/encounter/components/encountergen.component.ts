import { Input, Component, OnInit, signal } from '@angular/core';
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

  // Signals for reactive UI state
  public encounterModel = signal<EncounterGenViewModel | undefined>(undefined);
  public encounter = signal<Encounter | null>(null);
  public valid = signal(false);
  public validating = signal(false);
  public generating = signal(false);
  public loading = signal(false);

  // Regular properties for constants and inputs
  public sizes = Size;
  public creatureTypeFilters: CreatureTypeFilter[] = [];

  @Input() temperature = '';
  @Input() environment = '';
  @Input() timeOfDay = '';
  @Input() level = 1;
  @Input() allowAquatic = false;
  @Input() allowUnderground = false;

  ngOnInit(): void {
    this.loading.set(true);
    this.validating.set(true);

    this.encounterService.getViewModel()
      .pipe(
        tap(data => this.encounterModel.set(data)),
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
        tap(data => this.valid.set(data)),
      )
      .subscribe({
        complete: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private finishInit(): void {
    this.validating.set(false);
    this.loading.set(false);
  }

  private setInitialValues(): void {
    const model = this.encounterModel()!;

    this.temperature = model.defaults.temperature;
    this.environment = model.defaults.environment;
    this.timeOfDay = model.defaults.timeOfDay;
    this.level = model.defaults.level;
    this.allowAquatic = model.defaults.allowAquatic;
    this.allowUnderground = model.defaults.allowUnderground;
    
    for (var i = 0; i < model.creatureTypes.length; i++) {
      this.creatureTypeFilters.push({ 
          id: model.creatureTypes[i].replaceAll(' ', '_'),
          displayName: model.creatureTypes[i],
          checked: false
      });
    }
  }

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.encounter.set(null);

    this.loading.set(false);
    this.generating.set(false);
    this.validating.set(false);
    
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
    this.validating.set(true);

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
    var checkedFilters: string[] = [];

    for (var i = 0; i < this.creatureTypeFilters.length; i++) {
        if (this.creatureTypeFilters[i].checked) {
            checkedFilters.push(this.creatureTypeFilters[i].displayName);
        }
    }

    return checkedFilters;
  }

  private setValidity(data: boolean) {
    this.valid.set(data);
    this.validating.set(false);
  }

  public generateEncounter(): void {
    this.generating.set(true);
    this.encounter.set(null);

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
        tap(data => this.encounter.set(data)),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private finishGeneration(): void {
    this.generating.set(false);
  }

  public download(): void {
    const encounter = this.encounter();
    if (!encounter) {
      return;
    }

    var formattedEncounter = this.encounterPipe.transform(encounter);
    this.fileSaverService.save(formattedEncounter, encounter.description);
  }
}
