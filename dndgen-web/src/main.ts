/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

const providers = [
  { provide: 'APP_ID', useValue: 'dndgen-web' }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
