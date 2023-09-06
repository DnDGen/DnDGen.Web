import { Input, Component, OnInit } from '@angular/core';
import { CharacterService } from './character.service';
import { LeadershipService } from './leadership.service';
import { RandomizerService } from './randomizer.service';
import { CharacterFormatterService } from './characterFormatter.service';
import { FileSaverService } from '../shared/fileSaver.service';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';
import { Character } from './character.model';
import { Leadership } from './leadership.model';
import { EventService } from '../shared/event.service';
import { CharacterGenViewModel } from './charactergenViewModel.model';

@Component({
  selector: 'dndgen-charactergen',
  templateUrl: './charactergen.component.html',
  providers: [
    CharacterService,
    LeadershipService,
    RandomizerService,
    EventService,
    CharacterFormatterService,
  ]
})

export class CharacterGenComponent implements OnInit {
  constructor(
    private characterService: CharacterService,
    private leadershipService: LeadershipService,
    private randomizerService: RandomizerService,
    private characterFormatterService: CharacterFormatterService,
    private fileSaverService: FileSaverService,
    private sweetAlertService: SweetAlertService,
    private eventService: EventService,
    private logger: LoggerService) { }

  ngOnInit(): void {
    this.characterService.getViewModel()
      .subscribe({
        next: data => {
          this.setViewModel(data);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  }

  private setViewModel(data: CharacterGenViewModel): void {
    this.characterModel = data;

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

    this.validateRandomizers();
  }

  private handleError(): void {
    this.sweetAlertService.showError();

    this.character = null;
    this.leadership = null;
    this.cohort = null;
    this.followers = [];

    this.generating = false;
    this.validating = false;
    this.generatingMessage = '';
  }

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

  public clientId: string = '';
  public character!: Character | null;
  public valid: boolean = false; //compatible
  public validating: boolean = false; //verifying
  public generating: boolean = false;
  public leadership!: Leadership | null;
  public cohort!: Character | null;
  public followers: Character[] = [];
  public generatingMessage: string = '';

  public validateRandomizers(): void {
    this.validating = true;

    if (this.levelRandomizerType === 'Set' && this.setLevel === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setStrength === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setConstitution === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setDexterity === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setIntelligence === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setWisdom === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.abilitiesRandomizerType === 'Set' && this.setCharisma === 0) {
      this.valid = false;
      this.validating = false;
    }

    if (this.validating) {
      this.eventService.getClientId()
        .subscribe({
          next: data => {
            this.clientId = data;
            this.getRandomizerValidity();
          },
          error: error => {
            this.logger.logError(error.message);
            this.handleError();

            this.eventService.clearEvents(this.clientId);
          }
        });
    }
  }

  private getRandomizerValidity(): void {
    this.randomizerService
      .validate(
        this.clientId,
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
        next: data => {
          this.valid = data;

          this.validating = false;
          this.eventService.clearEvents(this.clientId);
        },
        error: error => {
          this.logger.logError(error.message);
          this.valid = false;
          this.handleError();

          this.eventService.clearEvents(this.clientId);
        }
      });
  }

  public generate(): void {
    this.generating = true;
    this.character = null;
    this.leadership = null;
    this.cohort = null;
    this.followers = [];

    this.generatingMessage = 'Generating character...';

    this.eventService.getClientId()
      .subscribe({
        next: data => {
          this.clientId = data;
          this.generateCharacter();
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();

          this.eventService.clearEvents(this.clientId);
        }
      });
  }

  private generateCharacter(): void {
    this.characterService
      .generate(
        this.clientId,
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
      .subscribe({
        next: data => {
          this.character = data;
          this.generateLeadership();
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();

          this.eventService.clearEvents(this.clientId);
        }
      });
  }

  private generateLeadership(): void {
    if (!this.character || !this.character.isLeader) {
      this.generating = false;
      this.generatingMessage = '';
      return;
    }

    this.generatingMessage = 'Generating leadership...';

    this.leadershipService.generate(this.clientId, this.character['class'].level, this.character.abilities.Charisma.bonus, this.character.magic.animal)
      .subscribe({
        next: data => {
          this.leadership = data;
          this.generateCohort();
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();

          this.eventService.clearEvents(this.clientId);
        }
      });
  }

  private generateCohort(): void {
    if (!this.character || !this.character.isLeader || !this.leadership) {
      this.generating = false;
      this.generatingMessage = '';
      return;
    }

    this.generatingMessage = 'Generating cohort...';

    this.leadershipService
      .generateCohort(
        this.clientId,
        this.character['class'].level,
        this.leadership.cohortScore,
        this.character.alignment.full,
        this.character['class'].name)
      .subscribe({
        next: data => {
          this.cohort = data;
          this.generateAllFollowers();
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();

          this.eventService.clearEvents(this.clientId);
        }
      });
  }

  private generateAllFollowers(): void {
    if (!this.leadership || this.leadership.followerQuantities.level1 === 0) {
      this.generating = false;
      this.generatingMessage = '';
      return;
    }

    var expectedTotal = this.leadership.followerQuantities.level1 +
      this.leadership.followerQuantities.level2 +
      this.leadership.followerQuantities.level3 +
      this.leadership.followerQuantities.level4 +
      this.leadership.followerQuantities.level5 +
      this.leadership.followerQuantities.level6;

    this.generatingMessage = 'Generating ' + expectedTotal + ' followers...';

    this.generateFollowers(1, this.leadership.followerQuantities.level1, expectedTotal);
    this.generateFollowers(2, this.leadership.followerQuantities.level2, expectedTotal);
    this.generateFollowers(3, this.leadership.followerQuantities.level3, expectedTotal);
    this.generateFollowers(4, this.leadership.followerQuantities.level4, expectedTotal);
    this.generateFollowers(5, this.leadership.followerQuantities.level5, expectedTotal);
    this.generateFollowers(6, this.leadership.followerQuantities.level6, expectedTotal);
  }

  private generateFollowers(level: number, amount: number, expectedTotal: number): void {
    if (!this.character || !this.character.isLeader || !this.leadership) {
      this.generating = false;
      this.generatingMessage = '';
      return;
    }

    if (this.followers.length == expectedTotal) {
      this.generating = false;
      this.generatingMessage = '';

      this.eventService.clearEvents(this.clientId);

      return;
    }
    else if (amount == 0) {
      return;
    }

    this.generatingMessage = 'Generating follower ' + (this.followers.length + 1) + ' of ' + expectedTotal + '...';

    this.leadershipService.generateFollower(this.clientId, level, this.character.alignment.full, this.character['class'].name)
      .subscribe({
        next: data => {
          this.followers.push(data);
          this.generateFollowers(level, amount - 1, expectedTotal);
        },
        error: error => {
          this.logger.logError(error.message);
          this.handleError();
        }
      });
  }

  public download(): void {
    if (!this.character) {
      return;
    }

    var formattedCharacter = this.characterFormatterService.formatCharacter(this.character, this.leadership, this.cohort, this.followers);
    this.fileSaverService.save(formattedCharacter, this.character.summary);
  }
}
