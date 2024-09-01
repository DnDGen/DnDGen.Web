import { Input, Component } from '@angular/core';
import { Character } from './models/character.model';

@Component({
  selector: 'dndgen-character',
  templateUrl: './character.component.html'
})

export class CharacterComponent {
  @Input() character!: Character;

  public isTwoHanded(): boolean {
    if (!this.character.equipment.primaryHand)
      return false;

    return this.character.equipment.primaryHand!.attributes.indexOf('Two-Handed') > -1;
  }
}
