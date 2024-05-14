import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { InterceptorService } from './interceptors/interceptors.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),

    importProvidersFrom(
      HttpClientModule,
      // SocketIoModule.forRoot(config),
      BlockUIModule.forRoot()
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
};
