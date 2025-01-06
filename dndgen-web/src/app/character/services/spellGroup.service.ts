import { Injectable } from '@angular/core';
import { Spell } from '../models/spell.model';
import { SpellGroup } from '../models/spellGroup.model';

@Injectable({
  providedIn: 'root',
})
export class SpellGroupService {
  constructor() { }

  public sortIntoGroups(spells: Spell[]): SpellGroup[] {
    let spellGroups = spells.reduce((groups: SpellGroup[], spell: Spell) => this.addToSpellGroup(groups, spell), []);

    for(var i = 0; i < spellGroups.length; i++) {
        spellGroups[i].spells = spellGroups[i].spells.sort((a, b) => this.compare(a.name, b.name));
    }

    return spellGroups.sort((a, b) => this.compare(a.name, b.name));
  }

  private addToSpellGroup(groups: SpellGroup[], spell: Spell): SpellGroup[] {

    for(let i = 0; i < spell.sources.length; i++) {
      const name = this.getSpellGroupName(spell.sources[i].level, spell.sources[i].source);
  
      let existing = groups.find(g => g.name == name);
      if (!existing) {
          existing = {
              name: name,
              spells: []
          };
          groups.push(existing);
      }
  
      existing.spells.push(spell);
    }
    
    return groups;
  }

  private compare(a: string, b: string) {
    if ( a.toLowerCase() < b.toLowerCase() ){
      return -1;
    }
    if ( a.toLowerCase() > b.toLowerCase() ){
      return 1;
    }
    return 0;
  }

  public getSpellGroupName(level: number, source: string) {
    return `${source} Level ${level}`;
  }
}
