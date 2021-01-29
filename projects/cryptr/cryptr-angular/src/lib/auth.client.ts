import { InjectionToken } from '@angular/core';
import CleeckSpa from '@cryptr/cryptr-spa-js';

import { AuthClientConfig } from './auth.config';

export class CleeckClientFactory {
  static createClient(configFactory: AuthClientConfig): any {
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

    return new CleeckSpa.client(config);
  }
}

export const CleeckClientService = new InjectionToken<any>(
  'cleeck.client'
);
