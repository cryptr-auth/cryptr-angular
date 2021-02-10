import { InjectionToken } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';

import { AuthClientConfig } from './auth.config';
const DEFAULT_CONFIG = {
  audience: 'http://localhost:4200',
  tenant_domain: 'shark-academy',
  client_id: '724b141a-e1eb-4f5b-bfca-22eca8ae3cc4',
  default_redirect_uri: 'http://localhost:4200/',
  // region: 'us',
  cryptr_base_url: 'http://localhost:4000',
  default_locale: 'fr',
  httpInterceptor: {
    apiRequestsToSecure: [
      'http://localhost:5000/*',
    ]
  },
  telemetry: false
};

export class CryptrClientFactory {
  static createClient(configFactory: AuthClientConfig): any {
    const config = configFactory !== null ? configFactory.get() : DEFAULT_CONFIG;

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
