export class Creature {
    constructor(
        public name: string,
        public description: string,
        public subCreature: Creature | null = null,
    ) { }
  }
  