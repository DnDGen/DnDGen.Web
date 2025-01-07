import { Damage } from "./damage.model";
import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Weapon extends Item {
  constructor(
    public override name: string,
    public override itemType: string,
    public override summary: string = '',
    public override baseNames: string[] = [],
    public override traits: string[] = [],
    public override attributes: string[] = [],
    public override magic: Magic = new Magic(),
    public override quantity: number = 1,
    public override contents: string[] = [],
    public override isMagical: boolean = false,

    public size: string = '',
    public damageDescription: string = '',
    public ammunition: string = '',
    public damages: Damage[] = [],
    public damageRoll: string = '',
    public secondaryDamages: Damage[] = [],
    public secondaryDamageRoll: string = '',
    public secondaryDamageDescription: string = '',
    public criticalDamages: Damage[] = [],
    public criticalDamageRoll: string = '',
    public criticalDamageDescription: string = '',
    public criticalMultiplier: string = '',
    public secondaryCriticalDamages: Damage[] = [],
    public secondaryCriticalDamageRoll: string = '',
    public secondaryCriticalDamageDescription: string = '',
    public secondaryCriticalMultiplier: string = '',
    public threatRange: number = 0,
    public threatRangeDescription: string = '',
    public isDoubleWeapon: boolean = false,
    public secondaryMagicBonus: number = 0,
    public secondaryHasAbilities: boolean = false,
    public combatTypes: string[] = [],
  ) {
    super(name, itemType, summary, baseNames, traits, attributes, magic, quantity, contents, isMagical, true);
  }
}
