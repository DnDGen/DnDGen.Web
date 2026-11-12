import { Alignment } from "../../character/models/alignment.model";
import { Feat } from "../../character/models/feat.model";
import { Attack } from "./attack.model";
import { CreatureAbility } from "./creature-ability.model";
import { CreatureArmorClass } from "./creature-armor-class.model";
import { CreatureEquipment } from "./creature-equipment.model";
import { CreatureMagic } from "./creature-magic.model";
import { Measurement } from "../../shared/models/measurement.model";
import { CreatureSkill } from "./creature-skill.model";
import { CreatureType } from "./creature-type.model";
import { Demographics } from "./demographics.model";
import { HitPoints } from "./hit-points.model";
import { Save } from "./save.model";

export class Creature {
  constructor(
    public summary: string,
    public name: string = '',
    public type: CreatureType = new CreatureType(),
    public size: string = '',
    public challengeRating: string = '',
    public alignment: Alignment = new Alignment(''),
    public levelAdjustment?: number | null,
    public casterLevel: number = 0,
    public templates: string[] = [],
    public abilities: { [name: string]: CreatureAbility } = {},
    public hitPoints: HitPoints = new HitPoints(),
    public speeds: { [movement: string]: Measurement } = {},
    public armorClass: CreatureArmorClass = new CreatureArmorClass(),
    public initiativeBonus: number = 0,
    public totalInitiativeBonus: number = 0,
    public baseAttackBonus: number = 0,
    public grappleBonus: number | null = null,
    public space: Measurement = new Measurement(),
    public reach: Measurement = new Measurement(),
    public saves: { [name: string]: Save } = {},
    public skills: CreatureSkill[] = [],
    public feats: Feat[] = [],
    public specialQualities: Feat[] = [],
    public attacks: Attack[] = [],
    public fullMeleeAttack: Attack[] = [],
    public fullRangedAttack: Attack[] = [],
    public specialAttacks: Attack[] = [],
    public languages: string[] = [],
    public magic: CreatureMagic = new CreatureMagic(),
    public equipment: CreatureEquipment = new CreatureEquipment(),
    public demographics: Demographics = new Demographics()
  ) { }
}
