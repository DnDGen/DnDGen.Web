import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { RollGenComponent } from './roll/components/rollgen.component';
import { TreasureGenComponent } from './treasure/components/treasuregen.component';
import { CharacterGenComponent } from './character/components/charactergen.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', redirectTo: "/", pathMatch: 'full' },
    { path: 'roll', component: RollGenComponent, pathMatch: 'full' },
    { path: 'treasure', component: TreasureGenComponent, pathMatch: 'full' },
    { path: 'character', component: CharacterGenComponent, pathMatch: 'full' },
    //TODO: EncounterGen
    //TODO: DungeonGen
    { path: '**', component: ErrorComponent, pathMatch: 'full' }
];
