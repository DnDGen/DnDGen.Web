import { Input, Component, OnInit, signal } from '@angular/core';
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

  public dungeonModel = signal<DungeonGenViewModel | undefined>(undefined);
  public sizes = Size;
  public creatureTypeFilters: CreatureTypeFilter[] = [];

  @Input() dungeonLevel = 1;
  @Input() temperature = '';
  @Input() environment = '';
  @Input() timeOfDay = '';
  @Input() level = 1;
  @Input() allowAquatic = false;
  @Input() allowUnderground = false;

  public loading = signal(false);
  public areas = signal<Area[]>([]);
  public valid = signal(false);
  public validating = signal(false);
  public generating = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.validating.set(true);

    this.dungeonService.getViewModel()
      .pipe(
        tap(data => this.dungeonModel.set(data)),
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
    const model = this.dungeonModel()!;

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

    this.areas.set([]);

    this.loading.set(false);
    this.generating.set(false);
    this.validating.set(false);
    
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
    this.generating.set(true);
    this.areas.set([]);

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
        tap(data => this.areas.set(data)),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  public generateFromDoor(): void {
    this.generating.set(true);
    this.areas.set([]);

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
        tap(data => this.areas.set(data)),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private setValidity(data: boolean) {
    this.valid.set(data);
    this.validating.set(false);
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
    this.validating.set(true);

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
    this.generating.set(false);
  }

  public download(): void {
    const currentAreas = this.areas();
    if (!currentAreas.length) {
      return;
    }

    var formattedDungeon = this.dungeonPipe.transform(currentAreas);
    this.fileSaverService.save(formattedDungeon, currentAreas[0].type);
  }
}
