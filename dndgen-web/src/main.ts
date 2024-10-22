/// <reference types="@angular/localize" />

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app/app.routes';
import { RouterOutlet, provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, RouterOutlet, NgbModule),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: 'APP_ID', useValue: 'dndgen-web' },
        provideRouter(routes)
    ]
})
  .catch(err => console.log(err));
