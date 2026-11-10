import { Input, Component } from '@angular/core';
import { Creature } from '../models/creature.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { DecimalPipe } from '@angular/common';
import { InchesToFeetPipe } from '../../character/pipes/inches-to-feet.pipe';
import { FeatComponent } from '../../character/components/feat.component';
import { ItemComponent } from '../../treasure/components/item.component';
import { SpellGroupComponent } from '../../character/components/spell-group.component';
import { AttackComponent } from './attack.component';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { CreatureFormatService } from '../services/creature-format.service';

@Component({
    selector: 'dndgen-creature',
    templateUrl: './creature.component.html',
    standalone: true,
    providers: [
      DecimalPipe,
      InchesToFeetPipe,
    ],
    imports: [
      DetailsComponent,
      FeatComponent,
      ItemComponent,
      SpellGroupComponent,
      AttackComponent,
      BonusPipe,
      MeasurementPipe,
      SpellQuantityPipe,
      DecimalPipe,
    ]
})

export class CreatureComponent {
  constructor(public format: CreatureFormatService) { }

  @Input() creature!: Creature;
}
