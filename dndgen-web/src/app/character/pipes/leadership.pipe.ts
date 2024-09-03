import { Pipe, PipeTransform } from '@angular/core';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { CharacterPipe } from './character.pipe';

@Pipe({ name: 'leadership' })
export class LeadershipPipe implements PipeTransform {
    constructor(private characterPipe: CharacterPipe) { }

    transform(value: Leadership | null, cohort: Character | null, followers: Character[], prefix?: string): string {
        return this.formatLeadership(value, cohort, followers, prefix);
    }

    private formatLeadership(leadership: Leadership | null, cohort: Character | null, followers: Character[], prefix?: string): string {
        if (!prefix)
        prefix = '';

        if (!leadership)
            return '';

        let formattedLeadership = prefix + "Leadership:\r\n";
        formattedLeadership += prefix + "\t" + "Score: " + leadership.score + "\r\n";
        formattedLeadership += this.formatList(leadership.leadershipModifiers, 'Leadership Modifiers', prefix + "\t");

        formattedLeadership += '\r\n';

        if (cohort) {
            formattedLeadership += prefix + 'Cohort:\r\n';
            formattedLeadership += this.characterPipe.transform(cohort, prefix + '\t');
        } else {
            formattedLeadership += prefix + 'Cohort: None\r\n';
        }

        formattedLeadership += '\r\n';

        if (followers && followers.length > 0) {
        formattedLeadership += prefix + `Followers (x${followers.length}):\r\n`;

        for (var i = 0; i < followers.length; i++) {
            formattedLeadership += '\r\n';
            formattedLeadership += this.characterPipe.transform(followers[i], prefix + '\t');
        }
        } else {
        formattedLeadership += prefix + `Followers (x${followers.length}): None\r\n`;
        }

        return formattedLeadership;
    }

    private formatList(list: string[], title: string, prefix: string): string {
        if (!list.length)
            return '';

        if (!prefix)
            prefix = '';

        var formattedList = prefix + title + ':\r\n';

        for (var i = 0; i < list.length; i++) {
            formattedList += prefix + '\t' + list[i] + '\r\n';
        }

        return formattedList;
    }
}
