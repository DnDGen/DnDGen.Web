import { Input, Component, OnInit } from '@angular/core';
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
    SpellQuantityPipe,
  ]
})

export class CharacterGenComponent implements OnInit {
  constructor(
    private characterService: CharacterService,
    private leadershipService: LeadershipService,
    private leaderPipe: LeaderPipe,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService) { }

  public characterModel!: CharacterGenViewModel;
  public sizes = Size;

  @Input() alignmentRandomizerType = '';
  @Input() setAlignment = '';

  @Input() classNameRandomizerType = '';
  @Input() setClassName = '';

  @Input() levelRandomizerType = '';
  @Input() setLevel = 1;
  @Input() allowLevelAdjustments = true;

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

  public loading = false;
  public character: Character | null = null;
  public valid: boolean = false;
  public validating: boolean = false;
  public generating: boolean = false;
  public leadership: Leadership | null = null;
  public cohort: Character | null = null;
  public followers: Character[] = [];
  public generatingMessage: string = '';

  ngOnInit(): void {
    this.loading = true;
    this.validating = true;

    this.characterService.getViewModel()
      .pipe(
        tap(data => this.characterModel = data),
        tap(() => this.setInitialValues()),
        switchMap(() => this.characterService
          .validate(
            this.alignmentRandomizerType,
            this.setAlignment,
            this.classNameRandomizerType,
            this.setClassName,
            this.levelRandomizerType,
            this.setLevel,
            this.allowLevelAdjustments,
            this.baseRaceRandomizerType,
            this.setBaseRace,
            this.metaraceRandomizerType,
            this.forceMetarace,
            this.setMetarace)),
        tap(data => this.valid = data),
      )
      .subscribe({
        complete: () => this.finishInit(),
        error: error => this.handleError(error)
      });
  }

  private get followersTotal(): number {
    if (!this.leadership)
      return 0;

    return this.leadership.followerQuantities.level1 +
      this.leadership.followerQuantities.level2 +
      this.leadership.followerQuantities.level3 +
      this.leadership.followerQuantities.level4 +
      this.leadership.followerQuantities.level5 +
      this.leadership.followerQuantities.level6;
  }

  private finishInit(): void {
    this.validating = false;
    this.loading = false;
  }

  private setInitialValues(): void {
    this.alignmentRandomizerType = this.characterModel.alignmentRandomizerTypes[0];
    this.setAlignment = this.characterModel.alignments[0];

    this.classNameRandomizerType = this.characterModel.classNameRandomizerTypes[0];
    this.setClassName = this.characterModel.classNames[0];

    this.levelRandomizerType = this.characterModel.levelRandomizerTypes[0];

    this.baseRaceRandomizerType = this.characterModel.baseRaceRandomizerTypes[0];
    this.setBaseRace = this.characterModel.baseRaces[0];

    this.metaraceRandomizerType = this.characterModel.metaraceRandomizerTypes[0];
    this.setMetarace = this.characterModel.metaraces[0];

    this.abilitiesRandomizerType = this.characterModel.abilitiesRandomizerTypes[0];
    
    this.leaderAlignment = this.characterModel.alignments[0];
    this.leaderClassName = this.characterModel.classNames[0];
  }

  private handleError(error: any): void {
    this.logger.logError(error.message);

    this.character = null;
    this.leadership = null;
    this.cohort = null;
    this.followers = [];

    this.loading = false;
    this.generating = false;
    this.validating = false;
    this.generatingMessage = '';
    
    this.sweetAlertService.showError();
  }

  public validateRandomizers(
    alignmentRandomizerType?: string, setAlignment?: string,
    classNameRandomizerType?: string, setClassName?: string,
    levelRandomizerType?: string, setLevel?: number, allowLevelAdjustments?: boolean,
    baseRaceRandomizerType?: string, setBaseRace?: string,
    metaraceRandomizerType?: string, setMetarace?: string, forceMetarace?: boolean,
    abilitiesRandomizerType?: string, setStrength?: number, setConstitution?: number, setDexterity?: number, setIntelligence?: number, setWisdom?: number, setCharisma?: number,
  ): void {
    this.validating = true;

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
        (allowLevelAdjustments ?? this.allowLevelAdjustments),
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
    this.valid = data;
    this.validating = false;
  }

  public generateCharacter(): void {
    this.generating = true;
    this.character = null;
    this.leadership = null;
    this.cohort = null;
    this.followers = [];

    this.generatingMessage = 'Generating character...';

    this.characterService
      .generate(
        this.alignmentRandomizerType,
        this.setAlignment,
        this.classNameRandomizerType,
        this.setClassName,
        this.levelRandomizerType,
        this.setLevel,
        this.allowLevelAdjustments,
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
        tap(data => this.character = data),
        filter(() => this.character != null && this.character.isLeader),
        tap(() => this.generatingMessage = 'Generating leadership...'),
        tap(() => this.setLeadershipInputsFromCharacter()),
        switchMap(() => this.getFullLeadership()),
      )
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error),
      });
  }

  private finishGeneration(): void {
    this.generating = false;
  }

  private setLeadershipInputsFromCharacter() {
    this.leaderAlignment = this.character?.alignment.full ?? '';
    this.leaderAnimal = this.character?.magic.animal ?? '';
    this.leaderCharismaBonus = this.character?.abilities.Charisma.bonus ?? 0;
    this.leaderClassName = this.character?.class.name ?? '';
    this.leaderLevel = this.character?.class.level ?? 0;
  }

  public generateLeadership(): void {
    this.generating = true;
    this.leadership = null;
    this.cohort = null;
    this.followers = [];
    
    this.getFullLeadership()
      .subscribe({
        complete: () => this.finishGeneration(),
        error: error => this.handleError(error)
      });
  }

  private getFullLeadership(): Observable<any> {
    this.generatingMessage = 'Generating leadership...';

    return this.leadershipService.generate(this.leaderLevel, this.leaderCharismaBonus, this.leaderAnimal)
      .pipe(
        tap(data => this.leadership = data),
        filter(() => this.leadership != null),
        tap(() => this.generatingMessage = 'Generating cohort...'),
        switchMap(() => this.leadershipService.generateCohort(
          this.leaderLevel,
          this.leadership!.cohortScore,
          this.leaderAlignment,
          this.leaderClassName)),
        tap(data => this.cohort = data),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level1 > 0),
        switchMap(() => this.getFollowers(1, this.leadership!.followerQuantities.level1)),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level2 > 0),
        switchMap(() => this.getFollowers(2, this.leadership!.followerQuantities.level2)),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level3 > 0),
        switchMap(() => this.getFollowers(3, this.leadership!.followerQuantities.level3)),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level4 > 0),
        switchMap(() => this.getFollowers(4, this.leadership!.followerQuantities.level4)),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level5 > 0),
        switchMap(() => this.getFollowers(5, this.leadership!.followerQuantities.level5)),
        filter(() => this.leadership != null && this.leadership!.followerQuantities.level6 > 0),
        switchMap(() => this.getFollowers(6, this.leadership!.followerQuantities.level6)),
        map(() => this.leadership)
      );
  }

  private getFollowers(level: number, quantity: number): Observable<Character[]> {
    let followers: Character[] = [];
    this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`;

    return this.leadershipService.generateFollower(level, this.leaderAlignment, this.leaderClassName)
      .pipe(
        tap(data => this.followers.push(data)),
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
    if (!this.character) {
      return;
    }

    var formattedCharacter = this.leaderPipe.transform(this.character, this.leadership, this.cohort, this.followers);
    this.fileSaverService.save(formattedCharacter, this.character.summary);
  }
}
