import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { routes } from './app.routes';

import { DetailsComponent } from './shared/details.component';
import { InchesToFeetPipe } from './shared/inchesToFeet.pipe';

import { RollGenComponent } from './roll/rollgen.component';

import { TreasureGenComponent } from './treasure/treasuregen.component';
import { TreasureComponent } from './treasure/treasure.component';
import { ItemComponent } from './treasure/item.component';

import { CharacterGenComponent } from './character/charactergen.component';
import { LeaderComponent } from './character/leadership.component';
import { CharacterComponent } from './character/character.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        ErrorComponent,

        //Shared
        DetailsComponent,
        InchesToFeetPipe,

        //RollGen
        RollGenComponent,

        //TreasureGen
        TreasureGenComponent,
        TreasureComponent,
        ItemComponent,

        //CharacterGen
        CharacterGenComponent,
        LeaderComponent,
        CharacterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterOutlet,
        RouterModule.forRoot(routes),
        NgbModule
    ],
    providers: [
        InchesToFeetPipe,
        provideHttpClient(withInterceptorsFromDi()),
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
