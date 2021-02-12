import { InjectionToken } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';

import { AuthClientConfig } from './auth.config';
export class CryptrClientFactory {
  static createClient(configFactory: AuthClientConfig): any {
    if (!!configFactory) {
      console.log('factory')
      console.debug(configFactory.get())
    }
    const config = configFactory.get();

    if (!config) {
      throw new Error(
        'Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set'
      );
    } else {
      const { default_redirect_uri, httpInterceptor: { apiRequestsToSecure } } = config;
      if (apiRequestsToSecure === undefined || apiRequestsToSecure.length === 0) {
        throw new Error(
          'You must specify at least one item in config.httpInterceptor.apiRequestsToSecure . Mainly use your Resource server url'
        );
      }
      console.warn(`The path ${default_redirect_uri} have to be decorated with 'canActivate: [AuthGuard]' options`);
    }

    return new CryptrSpa.client(config);
  }
}

export const CryptrClientService = new InjectionToken<any>(
  'cryptr.client', { providedIn: 'root', factory: () => CryptrClientFactory.createClient(null) }
);
