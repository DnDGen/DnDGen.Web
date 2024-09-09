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
import { DetailsComponent } from './shared/components/details.component';
import { InchesToFeetPipe } from './character/pipes/inchesToFeet.pipe';
import { RollGenComponent } from './roll/components/rollgen.component';
import { TreasureGenComponent } from './treasure/components/treasuregen.component';
import { TreasureComponent } from './treasure/components/treasure.component';
import { ItemComponent } from './treasure/components/item.component';
import { CharacterGenComponent } from './character/components/charactergen.component';
import { LeadershipComponent } from './character/components/leadership.component';
import { CharacterComponent } from './character/components/character.component';
import { BonusPipe } from './shared/pipes/bonus.pipe';
import { BonusesPipe } from './shared/pipes/bonuses.pipe';
import { MeasurementPipe } from './character/pipes/measurement.pipe';
import { FeatComponent } from './character/components/feat.component';
import { FrequencyPipe } from './character/pipes/frequency.pipe';
import { SpellQuantityPipe } from './character/pipes/spellQuantity.pipe';
import { SpellGroupComponent } from './character/components/spellGroup.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        ErrorComponent,

        //Shared
        DetailsComponent,
        BonusPipe,
        BonusesPipe,

        //RollGen
        RollGenComponent,

        //TreasureGen
        TreasureGenComponent,
        TreasureComponent,
        ItemComponent,

        //CharacterGen
        CharacterGenComponent,
        LeadershipComponent,
        CharacterComponent,
        FeatComponent,
        SpellGroupComponent,
        InchesToFeetPipe,
        MeasurementPipe,
        FrequencyPipe,
        SpellQuantityPipe,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterOutlet,
        RouterModule.forRoot(routes),
        NgbModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        BonusPipe,
        BonusesPipe,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
