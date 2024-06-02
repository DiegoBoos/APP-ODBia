import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { authenticationInterceptor } from './interceptors/interceptors.service';

import { environment } from '@environment/environment';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),

    
    provideHttpClient(
      withFetch(),
      withInterceptors([authenticationInterceptor])
    ),
    
    importProvidersFrom(
      BlockUIModule.forRoot(),

    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            )
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId')
          // }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: InterceptorService,
    //   multi: true,
    // },
  ],
  
};
