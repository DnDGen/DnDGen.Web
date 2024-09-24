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
import { EMPTY, Observable, of, pipe, repeat, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dndgen-charactergen',
  templateUrl: './charactergen.component.html',
  providers: [
    CharacterService,
    LeadershipService,
    LeaderPipe,
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

  @Input() alignmentRandomizerType = '';
  @Input() setAlignment = '';

  @Input() classNameRandomizerType = '';
  @Input() setClassName = '';

  @Input() levelRandomizerType = '';
  @Input() setLevel = 0;
  @Input() allowLevelAdjustments = true;

  @Input() baseRaceRandomizerType = '';
  @Input() setBaseRace = '';

  @Input() metaraceRandomizerType = '';
  @Input() forceMetarace = false;
  @Input() setMetarace = '';

  @Input() abilitiesRandomizerType = '';
  @Input() setStrength = 0;
  @Input() setConstitution = 0;
  @Input() setDexterity = 0;
  @Input() setIntelligence = 0;
  @Input() setWisdom = 0;
  @Input() setCharisma = 0;
  @Input() allowAbilitiesAdjustments = true;
  
  @Input() leaderAlignment = '';
  @Input() leaderClassName = '';
  @Input() leaderLevel = 6;
  @Input() leaderCharismaBonus = 0;
  @Input() leaderAnimal = '';

  public loading = false;
  public character!: Character | null;
  public valid: boolean = false;
  public validating: boolean = false;
  public generating: boolean = false;
  public leadership!: Leadership | null;
  public cohort!: Character | null;
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
        next: () => this.finishInit(),
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
    this.setLevel = 0;
    this.allowLevelAdjustments = true;

    this.baseRaceRandomizerType = this.characterModel.baseRaceRandomizerTypes[0];
    this.setBaseRace = this.characterModel.baseRaces[0];

    this.metaraceRandomizerType = this.characterModel.metaraceRandomizerTypes[0];
    this.forceMetarace = false;
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

  public validateRandomizers(): void {
    this.validating = true;

    if (this.levelRandomizerType === 'Set' && this.setLevel === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setStrength === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setConstitution === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setDexterity === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setIntelligence === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setWisdom === 0) {
      this.setValidity(false);
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setCharisma === 0) {
      this.setValidity(false);
    }

    if (this.validating) {
      this.characterService
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
          this.setMetarace)
        .subscribe({
          next: data => this.setValidity(data),
          error: error => {
            this.valid = false;
            this.handleError(error);
          }
        });
    }
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
        switchMap(() => this.continueGeneration(!this.character || !this.character.isLeader)),
        tap(() => this.generatingMessage = 'Generating leadership...'),
        tap(() => this.setLeadershipInputsFromCharacter()),
        //TODO: Refactor to shared method
        switchMap(() => this.leadershipService.generate(this.leaderLevel, this.leaderCharismaBonus, this.leaderAnimal)),
        tap(data => this.leadership = data),
        switchMap(() => this.continueGeneration(!this.character || !this.character.isLeader || !this.leadership)),
        tap(() => this.generatingMessage = 'Generating cohort...'),
        switchMap(() => this.leadershipService.generateCohort(
          this.leaderLevel,
          this.leadership!.cohortScore,
          this.leaderAlignment,
          this.leaderClassName)),
        tap(data => this.cohort = data),
        switchMap(() => this.continueGeneration(!this.leadership || this.leadership.followerQuantities.level1 === 0)),
        //TODO: Refactor to shared, repeatable, per-level method
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(1, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level1),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(2, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level2),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(3, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level3),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(4, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level4),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(5, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level5),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(6, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level6),
      )
      .subscribe({
        next: () => this.finishGeneration(),
        error: error => this.handleError(error)
      });
  }

  private finishGeneration(): void {
    this.generating = false;
  }

  private continueGeneration(stop: boolean): Observable<any> {
    if (stop) {
      this.generating = false;
      this.generatingMessage = '';
      return EMPTY;
    }

    return of('continue');
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
    
    this.generatingMessage = 'Generating leadership...';

    this.leadershipService.generate(this.leaderLevel, this.leaderCharismaBonus, this.leaderAnimal)
      .pipe(
        tap(data => this.leadership = data),
        switchMap(() => this.continueGeneration(!this.character || !this.character.isLeader || !this.leadership)),
        tap(() => this.generatingMessage = 'Generating cohort...'),
        switchMap(() => this.leadershipService.generateCohort(
          this.leaderLevel,
          this.leadership!.cohortScore,
          this.leaderAlignment,
          this.leaderClassName)),
        tap(data => this.cohort = data),
        switchMap(() => this.continueGeneration(!this.leadership || this.leadership.followerQuantities.level1 === 0)),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(1, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level1),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(2, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level2),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(3, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level3),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(4, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level4),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(5, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level5),
        pipe(
          tap(() => this.generatingMessage = `Generating follower ${this.followers.length + 1} of ${this.followersTotal}...`),
          switchMap(() => this.leadershipService.generateFollower(6, this.leaderAlignment, this.leaderClassName)),
          tap(data => this.followers.push(data))
        ),
        repeat(this.leadership!.followerQuantities.level6),
      )
      .subscribe({
        next: () => this.finishGeneration(),
        error: error => this.handleError(error)
      });
  }

  public download(): void {
    if (!this.character) {
      return;
    }

    var formattedCharacter = this.leaderPipe.transform(this.character, this.leadership, this.cohort, this.followers);
    this.fileSaverService.save(formattedCharacter, this.character.summary);
  }
}
