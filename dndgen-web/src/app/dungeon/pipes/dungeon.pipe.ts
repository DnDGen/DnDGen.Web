import { Pipe, PipeTransform } from '@angular/core';
import { TreasurePipe } from '../../treasure/pipes/treasure.pipe';
import { Area } from '../models/area.model';
import { Contents } from '../models/contents.model';
import { DungeonTreasure } from '../models/dungeonTreasure.model';
import { EncounterPipe } from '../../encounter/pipes/encounter.pipe';

@Pipe({ 
    name: 'dungeon',
    standalone: true,
})
export class DungeonPipe implements PipeTransform {
    constructor(
        private encounterPipe: EncounterPipe,
        private treasurePipe: TreasurePipe,
    ) { }

    transform(value: Area[], prefix?: string): string {
        if (!prefix)
            prefix = '';

        return this.formatDungeonAreas(value, prefix);
    }

    private formatDungeonAreas(areas: Area[], prefix: string): string {
        var formattedAreas = '';

        for (var i = 0; i < areas.length; i++) {
            formattedAreas += this.formatArea(areas[i], prefix);
        }

        return formattedAreas;
    }

    private formatArea(area: Area, prefix: string): string {
        var formattedArea = prefix + area.type;

        if (area.descriptions.length > 0 || area.length > 0 || area.contents.isEmpty === false) {
            formattedArea += ':';
        }

        formattedArea += '\r\n';

        if (area.descriptions.length > 0) {
            formattedArea += prefix + '\tDescriptions:\r\n';

            for (var i = 0; i < area.descriptions.length; i++) {
                formattedArea += prefix + '\t\t' + area.descriptions[i] + '\r\n';
            }
        }

        if (area.length > 0) {
            if (area.width === 0) {
                formattedArea += prefix + '\tDimensions: continues ' + area.length + '\'\r\n';
            }
            else if (area.width === 1) {
                formattedArea += prefix + '\tDimensions: about ' + area.length + ' square feet\r\n';
            }
            else if (area.width > 1) {
                formattedArea += prefix + '\tDimensions: ' + area.length + '\' x ' + area.width + '\'\r\n';
            }
        }

        if (area.contents.isEmpty === false) {
            formattedArea += this.formatContents(area.contents, prefix);
        }

        return formattedArea;
    }

    private formatContents(contents: Contents, prefix: string): string {
        var formattedContents = prefix + '\tContents:\r\n';

        for (var i = 0; i < contents.miscellaneous.length; i++) {
            formattedContents += prefix + '\t\t' + contents.miscellaneous[i] + '\r\n';
        }

        if (contents.traps.length > 0) {
            formattedContents += prefix + '\t\tTraps:\r\n';

            for (var i = 0; i < contents.traps.length; i++) {
                formattedContents += prefix + '\t\t\t' + contents.traps[i].name + ':\r\n';
                formattedContents += this.formatList(contents.traps[i].descriptions, prefix + '\t\t\t\t');
                formattedContents += prefix + '\t\t\t\tChallenge Rating: ' + contents.traps[i].challengeRating + '\r\n';
                formattedContents += prefix + '\t\t\t\tSearch DC: ' + contents.traps[i].searchDc + '\r\n';
                formattedContents += prefix + '\t\t\t\tDisable Device DC: ' + contents.traps[i].disableDeviceDc + '\r\n';
            }
        }

        if (contents.encounters.length > 0) {
            formattedContents += prefix + '\t\tEncounters:\r\n';

            for (var i = 0; i < contents.encounters.length; i++) {
                formattedContents += this.encounterPipe.transform(contents.encounters[i], prefix + '\t\t\t');
            }
        }

        if (contents.treasures.length > 0) {
            formattedContents += prefix + '\t\tTreasures:\r\n';

            for (var i = 0; i < contents.treasures.length; i++) {
                formattedContents += this.formatDungeonTreasure(contents.treasures[i], 'Treasure ' + (i + 1), prefix);
            }
        }

        if (contents.pool) {
            formattedContents += prefix + '\t\tPool';

            if (contents.pool.encounter || contents.pool.treasure || contents.pool.magicPower.length > 0)
                formattedContents += ':';

            formattedContents += '\r\n';

            if (contents.pool.encounter) {
                formattedContents += prefix + '\t\t\tEncounter:\r\n';
                formattedContents += this.encounterPipe.transform(contents.pool.encounter, prefix + '\t\t\t\t');
            }

            if (contents.pool.treasure) {
                formattedContents += this.formatDungeonTreasure(contents.pool.treasure, 'Treasure', prefix);
            }

            if (contents.pool.magicPower.length > 0) {
                formattedContents += prefix + '\t\t\tMagic Power: ' + contents.pool.magicPower + '\r\n';
            }
        }

        return formattedContents;
    }

    private formatList(list: string[], prefix: string): string {
        if (!prefix)
            prefix = '';

        var formattedList = '';

        for (var i = 0; i < list.length; i++) {
            formattedList += prefix + list[i] + '\r\n';
        }

        return formattedList;
    }

    private formatDungeonTreasure(dungeonTreasure: DungeonTreasure, title: string, prefix: string) {
        var formattedDungeonTreasure = prefix + '\t\t\t' + title + ':';

        if (dungeonTreasure.treasure.isAny === false)
            formattedDungeonTreasure += ' None';

        formattedDungeonTreasure += '\r\n';

        if (dungeonTreasure.container.length > 0)
            formattedDungeonTreasure += prefix + '\t\t\t\tContainer: ' + dungeonTreasure.container + '\r\n';

        if (dungeonTreasure.concealment.length > 0)
            formattedDungeonTreasure += prefix + '\t\t\t\tConcealment: ' + dungeonTreasure.concealment + '\r\n';

        if (dungeonTreasure.treasure.isAny)
            formattedDungeonTreasure += this.treasurePipe.transform(dungeonTreasure.treasure, prefix + '\t\t\t\t');

        return formattedDungeonTreasure;
    }
}
