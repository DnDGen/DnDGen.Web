import { Pipe, PipeTransform } from '@angular/core';
import { Encounter } from '../models/encounter.model';
import { CharacterPipe } from '../../character/pipes/character.pipe';
import { EncounterCreature } from '../models/encounterCreature.model';
import { Creature } from '../models/creature.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { TreasurePipe } from '../../treasure/pipes/treasure.pipe';

@Pipe({ 
    name: 'encounter',
    standalone: true 
})
export class EncounterPipe implements PipeTransform {
    constructor(
        private characterPipe: CharacterPipe,
        private treasurePipe: TreasurePipe,
    ) { }

    transform(value: Encounter, prefix?: string): string {
        return this.formatEncounter(value, prefix);
    }
  
    private formatEncounter(encounter: Encounter, prefix?: string) {
        if (!prefix)
            prefix = '';

        var formattedEncounter = '';

        if (encounter.description) {
            formattedEncounter += prefix + encounter.description + '\r\n';
        }

        formattedEncounter += prefix + 'Target Encounter Level: ' + encounter.targetEncounterLevel + '\r\n';
        formattedEncounter += prefix + 'Average Encounter Level: ' + encounter.averageEncounterLevel + ' (' + encounter.averageDifficulty + ')' + '\r\n';
        formattedEncounter += prefix + 'Actual Encounter Level: ' + encounter.actualEncounterLevel + ' (' + encounter.actualDifficulty + ')' + '\r\n';
        formattedEncounter += prefix + 'Creatures:' + '\r\n';

        for (var i = 0; i < encounter.creatures.length; i++) {
            formattedEncounter += this.formatCreature(encounter.creatures[i], prefix + '\t');
        }

        formattedEncounter += this.formatTreasures(encounter.treasures, prefix);

        if (encounter.characters.length === 0)
            return formattedEncounter;

        formattedEncounter += prefix + 'Characters:\r\n';

        for (var j = 0; j < encounter.characters.length; j++) {
            formattedEncounter += this.characterPipe.transform(encounter.characters[j], prefix + '\t');
            formattedEncounter += '\r\n';
        }

        return formattedEncounter;
    }

    private formatCreature(creature: EncounterCreature, prefix: string) {
        var formattedCreature = '';

        formattedCreature = prefix + this.formatCreatureName(creature.creature, prefix);

        formattedCreature += prefix + '\t' + 'Challenge Rating: ' + creature.challengeRating + '\r\n';
        formattedCreature += prefix + '\t' + 'Quantity: ' + creature.quantity + '\r\n';

        return formattedCreature;
    }

    private formatCreatureName(creature: Creature, prefix: string) {
        var formattedCreature = creature.name;

        if (creature.description) {
            formattedCreature += ' (' + creature.description + ')';
        }

        formattedCreature += '\r\n';

        if (creature.subCreature) {
            formattedCreature += prefix + '\t' + 'Sub-creature: ' + this.formatCreatureName(creature.subCreature, prefix + '\t');
        }

        return formattedCreature;
    }

    private formatTreasures(treasures: Treasure[], prefix: string) {
        var header = prefix + "Treasure:";
        var formattedTreasure = '';

        for (var i = 0; i < treasures.length; i++) {
            if (treasures[i].isAny)
                formattedTreasure += this.treasurePipe.transform(treasures[i], prefix + "\t");
        }

        if (!formattedTreasure.length)
            header += ' None';

        header += '\r\n';

        return header + formattedTreasure;
    }
}
