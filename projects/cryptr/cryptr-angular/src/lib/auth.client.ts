import { InjectionToken } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';

import { AuthClientConfig } from './auth.config';
export class CryptrClientFactory {
  static createClient(configFactory: AuthClientConfig): any {
    const config = configFactory.get();

    try {
      if (!config) {
        throw new Error(
          'Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set'
        );
      } else {
        const { httpInterceptor: { apiRequestsToSecure } } = config;
        if (apiRequestsToSecure === undefined || apiRequestsToSecure.length === 0) {
          throw new Error(
            'You must specify at least one item in config.httpInterceptor.apiRequestsToSecure . Mainly use your Resource server url'
          );
        }
        console.warn(`Secured paths have to be decorated with 'canActivate: [AuthGuard]' options`);
      }
      return new CryptrSpa.client(config);
    } catch (error) {
      console.error('authclient error');
      console.error(error);
    }
  }
}

export const CryptrClientService = new InjectionToken<any>('cryptr.client');
