export class EncounterDefaults {
    constructor(
      public environment: string,
      public temperature: string,
      public timeOfDay: string,
      public level: number,
      public allowAquatic: boolean = false,
      public allowUnderground: boolean = false,
    ) { }
  }
  