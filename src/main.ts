import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

// Bootstrap the application with the root component and application configuration
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
