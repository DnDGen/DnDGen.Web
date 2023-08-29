import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RollGenComponent } from './roll/rollgen.component';
import { TreasureComponent } from './treasure/treasure.component';
import { ItemComponent } from './treasure/item.component';
import { CharacterGenComponent } from './character/charactergen.component';
import { EventLogComponent } from './shared/eventLog.component';
import { LeaderComponent } from './character/leader.component';
import { CharacterComponent } from './character/character.component';
//import { CounterComponent } from './counter/counter.component';
//import { FetchDataComponent } from './fetch-data/fetch-data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,

    EventLogComponent,

    RollGenComponent,

    TreasureComponent,
    ItemComponent,

    CharacterGenComponent,
    LeaderComponent,
    CharacterComponent,
    //CounterComponent,
    //FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'roll', component: RollGenComponent, pathMatch: 'full' },
      { path: 'character', component: CharacterGenComponent, pathMatch: 'full' },
      //{ path: 'counter', component: CounterComponent },
      //{ path: 'fetch-data', component: FetchDataComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
