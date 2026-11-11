import { Input, Component, OnInit, signal } from '@angular/core';
import { CreatureService } from '../services/creature.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Creature } from '../models/creature.model';
import { CreatureGenViewModel } from '../models/creaturegen-view-model.model';
import { switchMap, tap } from 'rxjs';
import { Size } from '../../shared/components/size.enum';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchableSelectComponent } from '../../shared/components/searchable-select.component';
import { OrderedMultiSelectComponent } from '../../shared/components/ordered-multi-select.component';
import { CreatureComponent } from './creature.component';
import { FileSaverService } from '../../shared/services/file-saver.service';
import { CreaturePipe } from '../pipes/creature.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { DecimalPipe } from '@angular/common';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { InchesToFeetPipe } from '../../character/pipes/inches-to-feet.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';

@Component({
    selector: 'dndgen-creaturegen',
    templateUrl: './creaturegen.component.html',
    providers: [
        CreatureService,
        CreaturePipe,
        ItemPipe,
        DecimalPipe,
        MeasurementPipe,
        InchesToFeetPipe,
        FrequencyPipe,
        SpellQuantityPipe,
    ],
    standalone: true,
    imports: [LoadingComponent, FormsModule, NgbNavModule, SearchableSelectComponent, OrderedMultiSelectComponent, CreatureComponent]
})

export class CreatureGenComponent implements OnInit {
  constructor(
    private creatureService: CreatureService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService,
    private fileSaverService: FileSaverService,
    private creaturePipe: CreaturePipe) { }

  public creatureModel = signal<CreatureGenViewModel | undefined>(undefined);
  public sizes = Size;

  @Input() creatureName = '';
  @Input() creatureTemplates: string[] = [];

  @Input() randomTemplates: string[] = [];
  @Input() randomChallengeRating = '';
  @Input() randomAlignment = '';
  @Input() randomCreatureType = '';

  public loading = signal(false);
  public validating = signal(false);
  public generating = signal(false);
  public validCreature = signal(false);
  public validRandom = signal(false);
  public creature = signal<Creature | null>(null);
  public generatingMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.validating.set(true);

    this.creatureService.getViewModel()
      .pipe(
        tap(data => this.creatureModel.set(data)),
        switchMap(() => this.creatureService.validateRandom(
          this.randomTemplates,
          this.randomChallengeRating,
          this.randomAlignment,
          this.randomCreatureType)),
        tap(data => this.validRandom.set(data)),
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

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.creature.set(null);

    this.loading.set(false);
    this.generating.set(false);
    this.validating.set(false);
    this.generatingMessage.set('');

    this.sweetAlertService.showError();
  }

  private handleValidationError(error: any): void {
    this.validCreature.set(false);
    this.validRandom.set(false);

    this.handleError(error);
  }

  public setCreatureName(creatureName: string): void {
    this.creatureName = creatureName;
    this.validateCreature(creatureName, this.creatureTemplates);
  }

  public setCreatureTemplates(templates: string[]): void {
    this.creatureTemplates = templates;
    this.validateCreature(this.creatureName, templates);
  }

  public validateCreature(creatureName: string, templates: string[]): void {
    this.validating.set(true);

    if (!creatureName) {
      this.setCreatureValidity(false);
      return;
    }

    this.creatureService.validateCreature(creatureName, templates)
      .subscribe({
        next: data => this.setCreatureValidity(data),
        error: error => this.handleValidationError(error)
      });
  }

  private setCreatureValidity(data: boolean): void {
    this.validCreature.set(data);
    this.validating.set(false);
  }

  public setRandomTemplates(templates: string[]): void {
    this.randomTemplates = templates;
    this.validateRandom(templates, this.randomChallengeRating, this.randomAlignment, this.randomCreatureType);
  }

  public validateRandom(templates: string[], challengeRating: string, alignment: string, creatureType: string): void {
    this.validating.set(true);

    this.creatureService.validateRandom(templates, challengeRating, alignment, creatureType)
      .subscribe({
        next: data => this.setRandomValidity(data),
        error: error => this.handleValidationError(error)
      });
  }

  private setRandomValidity(data: boolean): void {
    this.validRandom.set(data);
    this.validating.set(false);
  }

  public generateCreature(): void {
    this.startGenerating();

    this.creatureService.generateCreature(this.creatureName, this.creatureTemplates)
      .subscribe({
        next: data => this.setCreature(data),
        error: error => this.handleError(error)
      });
  }

  public generateRandom(): void {
    this.startGenerating();

    this.creatureService.generateRandom(this.randomTemplates, this.randomChallengeRating, this.randomAlignment, this.randomCreatureType)
      .subscribe({
        next: data => this.setCreature(data),
        error: error => this.handleError(error)
      });
  }

  private startGenerating(): void {
    this.generating.set(true);
    this.creature.set(null);
    this.generatingMessage.set('Generating creature...');
  }

  private setCreature(data: Creature): void {
    this.creature.set(data);
    this.generating.set(false);
    this.generatingMessage.set('');
  }

  public download(): void {
    const creatureSource = this.creature();
    if (!creatureSource)
      return;

    const formattedCreature = this.creaturePipe.transform(creatureSource);
    this.fileSaverService.save(formattedCreature, creatureSource.summary);
  }
}
