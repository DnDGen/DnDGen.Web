import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

import { CollapsibleListComponent } from './shared/collapsibleList.component';
import { EventLogComponent } from './shared/eventLog.component';
import { InchesToFeetPipe } from './shared/inchesToFeet.pipe';

import { RollGenComponent } from './roll/rollgen.component';

import { TreasureComponent } from './treasure/treasure.component';
import { ItemComponent } from './treasure/item.component';

import { CharacterGenComponent } from './character/charactergen.component';
import { LeaderComponent } from './character/leader.component';
import { CharacterComponent } from './character/character.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ErrorComponent,

    //Shared
    CollapsibleListComponent,
    EventLogComponent,
    InchesToFeetPipe,

    //RollGen
    RollGenComponent,

    //TreasureGen
    TreasureComponent,
    ItemComponent,

    //CharacterGen
    CharacterGenComponent,
    LeaderComponent,
    CharacterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', redirectTo: "/", pathMatch: 'full' },
      { path: 'roll', component: RollGenComponent, pathMatch: 'full' },
      //TODO: TreasureGen
      { path: 'character', component: CharacterGenComponent, pathMatch: 'full' },
      //TODO: EncounterGen
      //TODO: DungeonGen
      { path: '**', component: ErrorComponent, pathMatch: 'full' }
    ])
  ],
  providers: [
    InchesToFeetPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }