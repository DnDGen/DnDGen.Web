import { Input, Component, OnInit } from '@angular/core';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { CharacterPipe } from '../../character/pipes/character.pipe';
import { Size } from '../../shared/components/size.enum';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { TreasurePipe } from '../../treasure/pipes/treasure.pipe';
import { DecimalPipe } from '@angular/common';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { InchesToFeetPipe } from '../../character/pipes/inchesToFeet.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spellQuantity.pipe';
import { DungeonGenViewModel } from '../models/dungeongenViewModel.model';
import { CreatureTypeFilter } from '../../encounter/models/creatureTypeFilter.model';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EncounterPipe } from '../../encounter/pipes/encounter.pipe';
import { Area } from '../models/area.model';
import { DungeonService } from '../services/dungeon.service';
import { DungeonPipe } from '../pipes/dungeon.pipe';
import { AreaComponent } from './area.component';
import { switchMap, tap } from 'rxjs';
import { EncounterService } from '../../encounter/services/encounter.service';

@Component({
    selector: 'dndgen-dungeongen',
    templateUrl: './dungeongen.component.html',
    providers: [
        DungeonService,
        EncounterService,
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
    imports: [LoadingComponent, FormsModule, AreaComponent]
})

export class DungeonGenComponent implements OnInit {
  constructor(
    private dungeonService: DungeonService,
    private encounterService: EncounterService,
    private dungeonPipe: DungeonPipe,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public dungeonModel!: DungeonGenViewModel;
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
        tap(data => this.dungeonModel = data),
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
    this.temperature = this.dungeonModel.defaults.temperature;
    this.environment = this.dungeonModel.defaults.environment;
    this.timeOfDay = this.dungeonModel.defaults.timeOfDay;
    this.level = this.dungeonModel.defaults.level;
    this.allowAquatic = this.dungeonModel.defaults.allowAquatic;
    this.allowUnderground = this.dungeonModel.defaults.allowUnderground;
    
    for (var i = 0; i < this.dungeonModel.creatureTypes.length; i++) {
      this.creatureTypeFilters.push({ 
          id: this.dungeonModel.creatureTypes[i].replaceAll(' ', '_'),
          displayName: this.dungeonModel.creatureTypes[i],
          checked: false
      });
    }
  }

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.areas = [];

    this.loading = false;
    this.generating = false;
    this.validating = false;
    
    this.sweetAlertService.showError();
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

  public generateFromHall(): void {
    this.generating = true;
    this.areas = [];

    this.dungeonService
      .generateAreasFromHall(
        this.dungeonLevel,
        this.environment,
        this.temperature,
        this.timeOfDay,
        this.level,
        this.checkedFilters,
        this.allowAquatic,
        this.allowUnderground,
      )
      .pipe(
        tap(data => this.areas = data),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  public generateFromDoor(): void {
    this.generating = true;
    this.areas = [];

    this.dungeonService
      .generateAreasFromDoor(
        this.dungeonLevel,
        this.environment,
        this.temperature,
        this.timeOfDay,
        this.level,
        this.checkedFilters,
        this.allowAquatic,
        this.allowUnderground,
      )
      .pipe(
        tap(data => this.areas = data),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private setValidity(data: boolean) {
    this.valid = data;
    this.validating = false;
  }

  public validate(
    dungeonLevel: number,
    environment: string,
    temperature: string,
    timeOfDay: string,
    level: number,
    allowAquatic: boolean,
    allowUnderground: boolean,
  ): void {
    this.validating = true;

    if (!dungeonLevel || !level) {
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

  private finishGeneration(): void {
    this.generating = false;
  }

  public download(): void {
    if (!this.areas.length) {
      return;
    }

    var formattedDungeon = this.dungeonPipe.transform(this.areas);
    this.fileSaverService.save(formattedDungeon, this.areas[0].type);
  }
}
