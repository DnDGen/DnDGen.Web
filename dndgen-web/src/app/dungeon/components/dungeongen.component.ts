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
import { EncounterGenViewModel } from '../models/dungeongenViewModel.model';
import { CreatureTypeFilter } from '../models/creatureTypeFilter.model';
import { Encounter } from '../models/encounter.model';
import { EncounterComponent } from './encounter.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EncounterPipe } from '../../encounter/pipes/encounter.pipe';
import { Area } from '../models/area.model';
import { DungeonService } from '../services/dungeon.service';

@Component({
    selector: 'dndgen-dungeongen',
    templateUrl: './dungeongen.component.html',
    providers: [
        DungeonService,
        DungeonPipe,
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
    imports: [LoadingComponent, FormsModule, DungeonComponent]
})

export class DungeonGenComponent implements OnInit {
  constructor(
    private dungeonService: DungeonService,
    private dungeonPipe: DungeonPipe,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public encounterModel!: EncounterGenViewModel;
  public sizes = Size;
  public creatureTypeFilters: CreatureTypeFilter[] = [];

  @Input() dungeonLevel = 1;
  @Input() temperature = '';
  @Input() environment = '';
  @Input() timeOfDay = '';
  @Input() level = 1;
  @Input() allowAquatic = false;
  @Input() allowUnderground = false;

  public loading = false;
  public areas: Area[] = [];
  public valid: boolean = false;
  public validating: boolean = false;
  public generating: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.validating = true;

    this.dungeonService.getViewModel()
      .pipe(
        tap(data => this.encounterModel = data),
        tap(() => this.setInitialValues()),
        switchMap(() => this.dungeonService
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

    this.dungeonService
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

    this.dungeonService
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

    var formattedDungeon = this.dungeonPipe.transform(this.encounter);
    this.fileSaverService.save(formattedDungeon, this.encounter.description);
  }
}
