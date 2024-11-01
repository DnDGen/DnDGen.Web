import { Pipe, PipeTransform } from '@angular/core';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { CharacterPipe } from './character.pipe';
import { LeadershipPipe } from './leadership.pipe';

@Pipe({ 
    name: 'leader',
    standalone: true
})
export class LeaderPipe implements PipeTransform {
    constructor(
        private leadershipPipe: LeadershipPipe,
        private characterPipe: CharacterPipe) { }

    transform(value: Character, leadership: Leadership | null, cohort: Character | null, followers: Character[], prefix?: string): string {
        return this.formatLeader(value, leadership, cohort, followers, prefix);
    }

    private formatLeader(character: Character, leadership: Leadership | null, cohort: Character | null, followers: Character[], prefix?: string): string {
        if (!prefix)
        prefix = '';

        let formattedLeader = this.characterPipe.transform(character, prefix);
        formattedLeader += '\r\n';
        formattedLeader += this.leadershipPipe.transform(leadership, cohort, followers, prefix);

        return formattedLeader;
    }
}
