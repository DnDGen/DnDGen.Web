import { Abilities } from "./abilities.model"
import { Alignment } from "./alignment.model"
import { CharacterClass } from "./characterClass.model"
import { Combat } from "./combat.model"
import { Equipment } from "./equipment.model"
import { FeatCollection } from "./featCollection.model"
import { Magic } from "./magic.model"
import { Race } from "./race.model"
import { Skill } from "./skill.model"

export class Character {
  public "class": CharacterClass

  constructor(
    public summary: string,
    public specialChallengeRatings: string[] = [],
    public alignment: Alignment = new Alignment(''),
    classParam: CharacterClass = new CharacterClass(''),
    public race: Race = new Race(''),
    public interestingTrait: string = '',
    public combat: Combat = new Combat(),
    public skills: Skill[] = [],
    public languages: string[] = [],
    public feats: FeatCollection = new FeatCollection(),
    public abilities: Abilities = new Abilities(),
    public equipment: Equipment = new Equipment(),
    public magic: Magic = new Magic(),
    public isLeader: boolean = false,
    public challengeRating: number = 0
  ) {
    this.class = classParam;
  }
}
