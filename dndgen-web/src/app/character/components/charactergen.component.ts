import { Input, Component, OnInit, signal } from '@angular/core';
import { CharacterService } from '../services/character.service';
import { LeadershipService } from '../services/leadership.service';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
import { LeaderPipe } from '../pipes/leader.pipe';
import { filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { LeadershipPipe } from '../pipes/leadership.pipe';
import { CharacterPipe } from '../pipes/character.pipe';
import { Size } from '../../shared/components/size.enum';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { TreasurePipe } from '../../treasure/pipes/treasure.pipe';
import { DecimalPipe } from '@angular/common';
import { MeasurementPipe } from '../pipes/measurement.pipe';
import { InchesToFeetPipe } from '../pipes/inchesToFeet.pipe';
import { FrequencyPipe } from '../pipes/frequency.pipe';
import { SpellQuantityPipe } from '../pipes/spellQuantity.pipe';
import { LeadershipComponent } from './leadership.component';
import { CharacterComponent } from './character.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-charactergen',
    templateUrl: './charactergen.component.html',
    providers: [
        CharacterService,
        LeadershipService,
        LeaderPipe,
        LeadershipPipe,
        CharacterPipe,
        ItemPipe,
        TreasurePipe,
        DecimalPipe,
        MeasurementPipe,
        InchesToFeetPipe,
        FrequencyPipe,
        SpellQuantityPipe
    ],
    standalone: true,
    imports: [LoadingComponent, FormsModule, CharacterComponent, LeadershipComponent, NgbNavModule]
})

export class CharacterGenComponent implements OnInit {
  constructor(
    private characterService: CharacterService,
    private leadershipService: LeadershipService,
    private leaderPipe: LeaderPipe,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public characterModel = signal<CharacterGenViewModel | undefined>(undefined);
  public sizes = Size;

  @Input() alignmentRandomizerType = '';
  @Input() setAlignment = '';

  @Input() classNameRandomizerType = '';
  @Input() setClassName = '';

  @Input() levelRandomizerType = '';
  @Input() setLevel = 1;

  @Input() baseRaceRandomizerType = '';
  @Input() setBaseRace = '';

  @Input() metaraceRandomizerType = '';
  @Input() forceMetarace = false;
  @Input() setMetarace = '';

  @Input() abilitiesRandomizerType = '';
  @Input() setStrength = 10;
  @Input() setConstitution = 10;
  @Input() setDexterity = 10;
  @Input() setIntelligence = 10;
  @Input() setWisdom = 10;
  @Input() setCharisma = 10;
  @Input() allowAbilitiesAdjustments = true;
  
  @Input() leaderAlignment = '';
  @Input() leaderClassName = '';
  @Input() leaderLevel = 6;
  @Input() leaderCharismaBonus = 0;
  @Input() leaderAnimal = '';

  public loading = signal(false);
  public character = signal<Character | null>(null);
  public valid = signal(false);
  public validating = signal(false);
  public generating = signal(false);
  public leadership = signal<Leadership | null>(null);
  public cohort = signal<Character | null>(null);
  public followers = signal<Character[]>([]);
  public generatingMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.validating.set(true);

    this.characterService.getViewModel()
      .pipe(
        tap(data => this.characterModel.set(data)),
        tap(() => this.setInitialValues()),
        switchMap(() => this.characterService
          .validate(
            this.alignmentRandomizerType,
            this.setAlignment,
            this.classNameRandomizerType,
            this.setClassName,
            this.levelRandomizerType,
            this.setLevel,
            this.baseRaceRandomizerType,
            this.setBaseRace,
            this.metaraceRandomizerType,
            this.forceMetarace,
            this.setMetarace)),
        tap(data => this.valid.set(data)),
      )
      .subscribe({
        complete: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private get followersTotal(): number {
    const leadershipValue = this.leadership();
    if (!leadershipValue)
      return 0;

    return leadershipValue.followerQuantities.level1 +
      leadershipValue.followerQuantities.level2 +
      leadershipValue.followerQuantities.level3 +
      leadershipValue.followerQuantities.level4 +
      leadershipValue.followerQuantities.level5 +
      leadershipValue.followerQuantities.level6;
  }

  private finishInit(): void {
    this.validating.set(false);
    this.loading.set(false);
  }

  private setInitialValues(): void {
    const model = this.characterModel()!;

    this.alignmentRandomizerType = model.alignmentRandomizerTypes[0];
    this.setAlignment = model.alignments[0];

    this.classNameRandomizerType = model.classNameRandomizerTypes[0];
    this.setClassName = model.classNames[0];

    this.levelRandomizerType = model.levelRandomizerTypes[0];

    this.baseRaceRandomizerType = model.baseRaceRandomizerTypes[0];
    this.setBaseRace = model.baseRaces[0];

    this.metaraceRandomizerType = model.metaraceRandomizerTypes[0];
    this.setMetarace = model.metaraces[0];

    this.abilitiesRandomizerType = model.abilitiesRandomizerTypes[0];
    
    this.leaderAlignment = model.alignments[0];
    this.leaderClassName = model.classNames[0];
  }

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.character.set(null);
    this.leadership.set(null);
    this.cohort.set(null);
    this.followers.set([]);

    this.loading.set(false);
    this.generating.set(false);
    this.validating.set(false);
    this.generatingMessage.set('');
    
    this.sweetAlertService.showError();
  }

  public validateRandomizers(
    alignmentRandomizerType?: string, setAlignment?: string,
    classNameRandomizerType?: string, setClassName?: string,
    levelRandomizerType?: string, setLevel?: number,
    baseRaceRandomizerType?: string, setBaseRace?: string,
    metaraceRandomizerType?: string, setMetarace?: string, forceMetarace?: boolean,
    abilitiesRandomizerType?: string, setStrength?: number, setConstitution?: number, setDexterity?: number, setIntelligence?: number, setWisdom?: number, setCharisma?: number,
  ): void {
    this.validating.set(true);

    if ((!(alignmentRandomizerType ?? this.alignmentRandomizerType))
      || (!(setAlignment ?? this.setAlignment))
      || (!(classNameRandomizerType ?? this.classNameRandomizerType))
      || (!(setClassName ?? this.setClassName))
      || (!(levelRandomizerType ?? this.levelRandomizerType))
      || (!(setLevel ?? this.setLevel))
      || ((setLevel ?? this.setLevel) <= 0)
      || (!(baseRaceRandomizerType ?? this.baseRaceRandomizerType))
      || (!(setBaseRace ?? this.setBaseRace))
      || (!(metaraceRandomizerType ?? this.metaraceRandomizerType))
      || (!(setMetarace ?? this.setMetarace))
      || (!(abilitiesRandomizerType ?? this.abilitiesRandomizerType))
      || ((setStrength ?? this.setStrength) <= 0)
      || ((setConstitution ?? this.setConstitution) <= 0)
      || ((setDexterity ?? this.setDexterity) <= 0)
      || ((setIntelligence ?? this.setIntelligence) <= 0)
      || ((setWisdom ?? this.setWisdom) <= 0)
      || ((setCharisma ?? this.setCharisma) <= 0)
    ) {
      this.setValidity(false);
      return;
    }
    
    this.characterService
      .validate(
        (alignmentRandomizerType ?? this.alignmentRandomizerType),
        (setAlignment ?? this.setAlignment),
        (classNameRandomizerType ?? this.classNameRandomizerType),
        (setClassName ?? this.setClassName),
        (levelRandomizerType ?? this.levelRandomizerType),
        (setLevel ?? this.setLevel),
        (baseRaceRandomizerType ?? this.baseRaceRandomizerType),
        (setBaseRace ?? this.setBaseRace),
        (metaraceRandomizerType ?? this.metaraceRandomizerType),
        (forceMetarace ?? this.forceMetarace),
        (setMetarace ?? this.setMetarace))
      .subscribe({
        next: data => this.setValidity(data),
        error: error => {
          this.setValidity(false);
          this.handleError(error);
        }
      });
  }

  private setValidity(data: boolean) {
    this.valid.set(data);
    this.validating.set(false);
  }

  public generateCharacter(): void {
    this.generating.set(true);
    this.character.set(null);
    this.leadership.set(null);
    this.cohort.set(null);
    this.followers.set([]);

    this.generatingMessage.set('Generating character...');

    this.characterService
      .generate(
        this.alignmentRandomizerType,
        this.setAlignment,
        this.classNameRandomizerType,
        this.setClassName,
        this.levelRandomizerType,
        this.setLevel,
        this.baseRaceRandomizerType,
        this.setBaseRace,
        this.metaraceRandomizerType,
        this.forceMetarace,
        this.setMetarace,
        this.abilitiesRandomizerType,
        this.setStrength,
        this.setConstitution,
        this.setDexterity,
        this.setIntelligence,
        this.setWisdom,
        this.setCharisma,
        this.allowAbilitiesAdjustments)
      .pipe(
        tap(data => this.character.set(data)),
        filter(() => this.character() != null && this.character()!.isLeader),
        tap(() => this.generatingMessage.set('Generating leadership...')),
        tap(() => this.setLeadershipInputsFromCharacter()),
        switchMap(() => this.getFullLeadership()),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private finishGeneration(): void {
    this.generating.set(false);
  }

  private setLeadershipInputsFromCharacter() {
    const characterSource = this.character();

    this.leaderAlignment = characterSource?.alignment.full ?? '';
    this.leaderAnimal = characterSource?.magic.animal ?? '';
    this.leaderCharismaBonus = characterSource?.abilities.Charisma.bonus ?? 0;
    this.leaderClassName = characterSource?.class.name ?? '';
    this.leaderLevel = characterSource?.class.level ?? 0;
  }

  public generateLeadership(): void {
    this.generating.set(true);
    this.leadership.set(null);
    this.cohort.set(null);
    this.followers.set([]);
    
    this.getFullLeadership()
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error)
      });
  }

  private getFullLeadership(): Observable<any> {
    this.generatingMessage.set('Generating leadership...');

    return this.leadershipService.generate(this.leaderLevel, this.leaderCharismaBonus, this.leaderAnimal)
      .pipe(
        tap(data => this.leadership.set(data)),
        filter(() => this.leadership() != null),
        tap(() => this.generatingMessage.set('Generating cohort...')),
        switchMap(() => this.leadershipService.generateCohort(
          this.leaderLevel,
          this.leadership()!.cohortScore,
          this.leaderAlignment,
          this.leaderClassName)),
        tap(data => this.cohort.set(data)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level1 > 0),
        switchMap(() => this.getFollowers(1, this.leadership()!.followerQuantities.level1)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level2 > 0),
        switchMap(() => this.getFollowers(2, this.leadership()!.followerQuantities.level2)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level3 > 0),
        switchMap(() => this.getFollowers(3, this.leadership()!.followerQuantities.level3)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level4 > 0),
        switchMap(() => this.getFollowers(4, this.leadership()!.followerQuantities.level4)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level5 > 0),
        switchMap(() => this.getFollowers(5, this.leadership()!.followerQuantities.level5)),
        filter(() => this.leadership() != null && this.leadership()!.followerQuantities.level6 > 0),
        switchMap(() => this.getFollowers(6, this.leadership()!.followerQuantities.level6)),
        map(() => this.leadership())
      );
  }

  private getFollowers(level: number, quantity: number): Observable<Character[]> {
    let followers: Character[] = [];
    const currentFollowers = this.followers();
    this.generatingMessage.set(`Generating follower ${currentFollowers.length + 1} of ${this.followersTotal}...`);

    return this.leadershipService.generateFollower(level, this.leaderAlignment, this.leaderClassName)
      .pipe(
        tap(data => this.followers.update(current => [...current, data])),
        switchMap(character => 
          quantity - 1 <= 0 ?
          of(character) :
          this.getFollowers(level, quantity - 1).pipe(
            map(recursiveData => followers.concat(recursiveData))
          )
        ),
        map(() => followers)
      );
  }

  public download(): void {
    const characterSource = this.character();
    if (!characterSource) {
      return;
    }

    var formattedCharacter = this.leaderPipe.transform(characterSource, this.leadership(), this.cohort(), this.followers());
    this.fileSaverService.save(formattedCharacter, characterSource.summary);
  }
}
