import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {marked} from 'marked';

import { routes } from './app.routes';
import { MARKED_TOKEN } from '@tmjeee/a-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    {provide: MARKED_TOKEN, useValue: marked.setOptions({
      gfm: true,
      breaks: true,
    })},
  ],
};
