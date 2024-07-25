import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

const providers = [
  { provide: 'APP_ID', useValue: 'dndgen-web' }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
