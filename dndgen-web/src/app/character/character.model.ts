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
    public specialChallengeRatings: string[],
    public alignment: Alignment,
    classParam: CharacterClass,
    public race: Race,
    public interestingTrait: string,
    public combat: Combat,
    public skills: Skill[],
    public languages: string[],
    public feats: FeatCollection,
    public abilities: Abilities,
    public equipment: Equipment,
    public magic: Magic,
    public isLeader: boolean,
    public summary: string,
    public challengeRating: number
  ) {
    this.class = classParam;
  }
}
